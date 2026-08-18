/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
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
import { todayISO } from "./lib/format";

const STORAGE_KEY = "fsr-council-dashboard:v1";

interface Persisted {
  version: 1;
  state: AppState;
  admin: boolean;
  votedIds: string[];
}

type Action =
  | { type: "addNotice"; notice: Notice }
  | { type: "addSuggestion"; suggestion: Suggestion }
  | { type: "voteSuggestion"; id: string }
  | { type: "setSuggestionStatus"; id: string; status: SuggestionStatus }
  | { type: "replySuggestion"; id: string; body: string }
  | { type: "addTransaction"; txn: Transaction }
  | { type: "setAdmin"; admin: boolean }
  | { type: "reset" };

function freshPersisted(): Persisted {
  return { version: 1, state: seedState, admin: false, votedIds: [] };
}

/* localStorage 는 사용 불가 환경(사생활 보호 모드, 샌드박스)일 수 있으므로
   항상 try/catch 로 감싼다. 실패 시 메모리에서만 동작한다. */
function loadPersisted(): Persisted {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshPersisted();
    const parsed = JSON.parse(raw) as Persisted;
    if (parsed.version !== 1 || !parsed.state) return freshPersisted();
    return parsed;
  } catch {
    return freshPersisted();
  }
}

function savePersisted(p: Persisted): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // 저장 불가 환경 — 무시 (메모리 상태로만 동작)
  }
}

function reducer(prev: Persisted, action: Action): Persisted {
  const { state } = prev;
  switch (action.type) {
    case "addNotice":
      return {
        ...prev,
        state: { ...state, notices: [action.notice, ...state.notices] },
      };
    case "addSuggestion":
      return {
        ...prev,
        state: {
          ...state,
          suggestions: [action.suggestion, ...state.suggestions],
        },
      };
    case "voteSuggestion": {
      if (prev.votedIds.includes(action.id)) return prev;
      return {
        ...prev,
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
        state: {
          ...state,
          transactions: [...state.transactions, action.txn],
        },
      };
    case "setAdmin":
      return { ...prev, admin: action.admin };
    case "reset":
      return { ...freshPersisted(), admin: prev.admin };
  }
}

interface StoreValue {
  state: AppState;
  admin: boolean;
  votedIds: string[];
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
  const [persisted, dispatch] = useReducer(reducer, undefined, loadPersisted);

  useEffect(() => {
    savePersisted(persisted);
  }, [persisted]);

  const value = useMemo<StoreValue>(
    () => ({
      state: persisted.state,
      admin: persisted.admin,
      votedIds: persisted.votedIds,
      addNotice: (notice) => dispatch({ type: "addNotice", notice }),
      addSuggestion: (suggestion) =>
        dispatch({ type: "addSuggestion", suggestion }),
      voteSuggestion: (id) => dispatch({ type: "voteSuggestion", id }),
      setSuggestionStatus: (id, status) =>
        dispatch({ type: "setSuggestionStatus", id, status }),
      replySuggestion: (id, body) =>
        dispatch({ type: "replySuggestion", id, body }),
      addTransaction: (txn) => dispatch({ type: "addTransaction", txn }),
      setAdmin: (admin) => dispatch({ type: "setAdmin", admin }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [persisted],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
