/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type {
  AppState,
  Notice,
  Suggestion,
  SuggestionStatus,
  Transaction,
} from "./data/types";
import { seedState } from "./data/seed";
import {
  detectArtifactMode,
  publishState,
  readEmbeddedState,
} from "./lib/artifactSync";
import { todayISO } from "./lib/format";

const STORAGE_KEY = "fsr-council-dashboard:v1";

/** 아티팩트(공유 문서) 모드 여부 — 모듈 로드 시 1회 감지 */
const SHARED = detectArtifactMode();

interface Persisted {
  version: 1;
  state: AppState;
  admin: boolean;
  votedIds: string[];
}

interface StoreShape extends Persisted {
  /** 공유 게시가 필요한 변경 횟수 — 리듀서에서 공유 데이터 변경 시 증가 */
  pendingSync: number;
}

type Action =
  | { type: "addNotice"; notice: Notice }
  | { type: "addSuggestion"; suggestion: Suggestion }
  | { type: "voteSuggestion"; id: string }
  | { type: "setSuggestionStatus"; id: string; status: SuggestionStatus }
  | { type: "replySuggestion"; id: string; body: string }
  | { type: "addTransaction"; txn: Transaction }
  | { type: "setAdmin"; admin: boolean }
  | { type: "replaceSharedState"; state: AppState }
  | { type: "reset" };

/* 저장소: localStorage → sessionStorage → 메모리 순으로 사용 가능한 것을 고른다.
   (아티팩트 샌드박스나 사생활 보호 모드에서는 일부가 막혀 있을 수 있다) */
function pickStorage(): Storage | null {
  const probe = (s: Storage): boolean => {
    try {
      const k = "__council_probe__";
      s.setItem(k, "1");
      s.removeItem(k);
      return true;
    } catch {
      return false;
    }
  };
  try {
    if (probe(window.localStorage)) return window.localStorage;
  } catch {
    /* 접근 자체가 차단된 환경 */
  }
  try {
    if (probe(window.sessionStorage)) return window.sessionStorage;
  } catch {
    /* 접근 자체가 차단된 환경 */
  }
  return null;
}

const storage = typeof window === "undefined" ? null : pickStorage();

function loadInitial(): StoreShape {
  let persisted: Persisted | null = null;
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      if (parsed.version === 1 && parsed.state) persisted = parsed;
    }
  } catch {
    persisted = null;
  }

  // 공유 모드에서는 페이지에 내장된 상태가 항상 진실이다.
  const state = SHARED
    ? (readEmbeddedState() ?? seedState)
    : (persisted?.state ?? seedState);

  return {
    version: 1,
    state,
    admin: persisted?.admin ?? false,
    votedIds: persisted?.votedIds ?? [],
    pendingSync: 0,
  };
}

function save(p: StoreShape): void {
  try {
    storage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: p.state,
        admin: p.admin,
        votedIds: p.votedIds,
      } satisfies Persisted),
    );
  } catch {
    // 저장 불가 환경 — 무시 (메모리 상태로만 동작)
  }
}

function reducer(prev: StoreShape, action: Action): StoreShape {
  const { state } = prev;
  const bump = prev.pendingSync + 1;
  switch (action.type) {
    case "addNotice":
      return {
        ...prev,
        pendingSync: bump,
        state: { ...state, notices: [action.notice, ...state.notices] },
      };
    case "addSuggestion":
      return {
        ...prev,
        pendingSync: bump,
        state: {
          ...state,
          suggestions: [action.suggestion, ...state.suggestions],
        },
      };
    case "voteSuggestion": {
      if (prev.votedIds.includes(action.id)) return prev;
      return {
        ...prev,
        pendingSync: bump,
        votedIds: [...prev.votedIds, action.id],
        state: {
          ...state,
          suggestions: state.suggestions.map((s) =>
            s.id === action.id ? { ...s, votes: s.votes + 1 } : s,
          ),
        },
      };
    }
    case "setSuggestionStatus":
      return {
        ...prev,
        pendingSync: bump,
        state: {
          ...state,
          suggestions: state.suggestions.map((s) =>
            s.id === action.id ? { ...s, status: action.status } : s,
          ),
        },
      };
    case "replySuggestion":
      return {
        ...prev,
        pendingSync: bump,
        state: {
          ...state,
          suggestions: state.suggestions.map((s) =>
            s.id === action.id
              ? {
                  ...s,
                  status: "답변완료",
                  reply: {
                    body: action.body,
                    date: todayISO(),
                    author: "협의회 운영진",
                  },
                }
              : s,
          ),
        },
      };
    case "addTransaction":
      return {
        ...prev,
        pendingSync: bump,
        state: {
          ...state,
          transactions: [...state.transactions, action.txn],
        },
      };
    case "setAdmin":
      return { ...prev, admin: action.admin };
    case "replaceSharedState":
      // 게시 실패 시 되돌리기 — pendingSync 는 올리지 않는다
      return { ...prev, state: action.state };
    case "reset":
      return {
        ...prev,
        pendingSync: bump,
        state: seedState,
        votedIds: [],
      };
  }
}

export type SyncStatus = "idle" | "saving" | "readonly" | "conflict" | "error";

interface StoreValue {
  state: AppState;
  admin: boolean;
  votedIds: string[];
  /** 공유 문서(아티팩트) 모드 여부 */
  shared: boolean;
  /** 공유 저장 상태 — 배너/토스트 표시용 */
  syncStatus: SyncStatus;
  addNotice: (notice: Notice) => void;
  addSuggestion: (suggestion: Suggestion) => void;
  voteSuggestion: (id: string) => void;
  setSuggestionStatus: (id: string, status: SuggestionStatus) => void;
  replySuggestion: (id: string, body: string) => void;
  addTransaction: (txn: Transaction) => void;
  setAdmin: (admin: boolean) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(reducer, undefined, loadInitial);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");

  // 게시 실패 시 되돌아갈 기준 = 이 화면이 로드될 때의 공유 상태
  const baseSharedState = useRef(store.state);
  const lastHandledSync = useRef(0);

  useEffect(() => {
    save(store);
  }, [store]);

  // 공유 데이터가 변경되면 새 버전으로 게시한다.
  useEffect(() => {
    if (!SHARED) return;
    if (store.pendingSync === 0) return;
    if (store.pendingSync === lastHandledSync.current) return;
    lastHandledSync.current = store.pendingSync;

    setSyncStatus("saving");
    void publishState(store.state).then((outcome) => {
      switch (outcome) {
        case "published":
          // shell 이 모든 화면(이 화면 포함)을 새 버전으로 리로드한다.
          break;
        case "conflict":
          // 다른 사용자의 버전이 이김 — shell 이 리로드 중이므로 대기만 한다.
          setSyncStatus("conflict");
          break;
        case "readonly":
          dispatch({ type: "replaceSharedState", state: baseSharedState.current });
          setSyncStatus("readonly");
          break;
        case "error":
          dispatch({ type: "replaceSharedState", state: baseSharedState.current });
          setSyncStatus("error");
          break;
      }
    });
  }, [store.pendingSync, store.state]);

  const value = useMemo<StoreValue>(() => {
    // 읽기 전용으로 판명된 화면에서는 공유 데이터 변경을 막는다.
    const canWrite = !(SHARED && syncStatus === "readonly");
    const guard = (fn: () => void) => {
      if (canWrite) fn();
    };
    return {
      state: store.state,
      admin: store.admin,
      votedIds: store.votedIds,
      shared: SHARED,
      syncStatus,
      addNotice: (notice) => guard(() => dispatch({ type: "addNotice", notice })),
      addSuggestion: (suggestion) =>
        guard(() => dispatch({ type: "addSuggestion", suggestion })),
      voteSuggestion: (id) => guard(() => dispatch({ type: "voteSuggestion", id })),
      setSuggestionStatus: (id, status) =>
        guard(() => dispatch({ type: "setSuggestionStatus", id, status })),
      replySuggestion: (id, body) =>
        guard(() => dispatch({ type: "replySuggestion", id, body })),
      addTransaction: (txn) =>
        guard(() => dispatch({ type: "addTransaction", txn })),
      setAdmin: (admin) => dispatch({ type: "setAdmin", admin }),
      reset: () => guard(() => dispatch({ type: "reset" })),
    };
  }, [store, syncStatus]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
