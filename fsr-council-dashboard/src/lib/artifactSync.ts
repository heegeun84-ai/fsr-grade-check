import type { AppState } from "../data/types";

/**
 * Claude Artifact 공유 저장 계층.
 *
 * 배포된 아티팩트 페이지 안에서 실행될 때, 협의회 데이터(AppState)를
 * 페이지 자체에 JSON으로 내장하고, 변경이 생기면 전체 페이지를 새 버전으로
 * 다시 게시(publish)한다. 게시가 성공하면 열려 있는 모든 화면이 새 버전으로
 * 자동 리로드되므로, 모든 열람자가 같은 데이터를 보게 된다.
 *
 * 로컬 개발/정적 호스팅에서는 아래 요소들이 없으므로 이 계층은 비활성화되고
 * 기존 localStorage 동작만 사용된다.
 */

interface ArtifactNamespace {
  publish(html: string): Promise<{ version: string }>;
}

interface ArtifactErrorLike {
  code?: string;
  message?: string;
}

declare global {
  interface Window {
    claude?: {
      use?: (name: string) => Promise<unknown>;
    };
  }
}

const STATE_ID = "council-state";
const CSS_ID = "council-css";
const JS_ID = "council-js";

interface TemplateParts {
  css: string;
  js: string;
}

let templateParts: TemplateParts | null = null;

/** 아티팩트로 게시된 페이지인지 감지하고, 재게시에 필요한 원본 CSS/JS를 확보한다.
 *  모듈 로드 시 한 번 호출된다 (React가 DOM을 만지기 전). */
export function detectArtifactMode(): boolean {
  if (typeof document === "undefined") return false;
  const css = document.getElementById(CSS_ID)?.textContent;
  const js = document.getElementById(JS_ID)?.textContent;
  if (!css || !js) return false;
  templateParts = { css, js };
  return true;
}

/** 페이지에 내장된 공유 상태 JSON을 읽는다. */
export function readEmbeddedState(): AppState | null {
  const el = document.getElementById(STATE_ID);
  const raw = el?.textContent;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.notices)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** 새 버전으로 게시할 완전한 HTML 문서를 상태로부터 렌더링한다.
 *  라이브 DOM을 직렬화하지 않고, 로드 시 확보한 원본 CSS/JS 텍스트를 사용한다. */
export function renderDocument(state: AppState): string {
  if (!templateParts) throw new Error("artifact template not captured");
  // "<" 를 이스케이프해 JSON 안의 "</script>" 가 문서를 깨지 않게 한다
  const json = JSON.stringify(state).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="메트라이프 대표FSR협의회 운영 현황 대시보드 — 공지사항, 건의함, 예산·결산, 회의 일정">
<title>대표FSR협의회 대시보드</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
<style id="${CSS_ID}">
${templateParts.css}
</style>
</head>
<body>
<script type="application/json" id="${STATE_ID}">${json}</script>
<div id="root"></div>
<script type="module" id="${JS_ID}">
${templateParts.js}
</script>
</body>
</html>
`;
}

export type PublishOutcome = "published" | "readonly" | "conflict" | "error";

/** 공유 상태를 새 버전으로 게시한다. 성공 시 shell이 모든 화면을 리로드한다. */
export async function publishState(state: AppState): Promise<PublishOutcome> {
  const claudeGlobal = window.claude;
  const resolveCapability = claudeGlobal?.use?.bind(claudeGlobal);
  if (!resolveCapability || !templateParts) return "error";

  let ns: ArtifactNamespace | null = null;
  try {
    ns = (await resolveCapability("artifact")) as ArtifactNamespace | null;
  } catch {
    ns = null;
  }
  if (!ns) return "readonly"; // 실행 불가 화면 — 읽기 전용으로 취급

  const html = renderDocument(state);
  const attempt = async (): Promise<PublishOutcome> => {
    try {
      await ns.publish(html);
      return "published";
    } catch (e) {
      const code = (e as ArtifactErrorLike)?.code ?? "upstream_error";
      switch (code) {
        case "not_writer":
        case "not_granted":
        case "not_declared":
        case "consent_required":
        case "capability_disabled":
        case "capability_removed":
          return "readonly";
        case "conflict":
          // 다른 사용자의 버전이 먼저 게시됨 — shell이 이미 리로드 중
          return "conflict";
        default:
          return "error";
      }
    }
  };

  const first = await attempt();
  if (first !== "error") return first;
  // upstream_error 는 짧은 무작위 지연 후 1회만 재시도
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
  return attempt();
}
