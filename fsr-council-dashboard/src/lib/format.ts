const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function todayISO(): string {
  const d = new Date();
  return toISO(d);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** 2026-08-18 → "2026.08.18" */
export function fmtDate(iso: string): string {
  return iso.replaceAll("-", ".");
}

/** 2026-08-18 → "8월 18일 (화)" */
export function fmtDateK(iso: string): string {
  const d = parseISO(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${DAY_NAMES[d.getDay()]})`;
}

/** 오늘 기준 D-day 문자열. 지난 날짜는 null */
export function dday(iso: string): string | null {
  const target = parseISO(iso).getTime();
  const today = parseISO(todayISO()).getTime();
  const diff = Math.round((target - today) / 86_400_000);
  if (diff < 0) return null;
  return diff === 0 ? "D-DAY" : `D-${diff}`;
}

/** 1234567 → "1,234,567원" */
export function fmtWon(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

/** 큰 금액 축약: 17,760,000 → "1,776만원", 240,000,000 → "2.4억원" */
export function fmtWonCompact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 100_000_000) {
    const v = n / 100_000_000;
    const s = Number.isInteger(v) ? String(v) : v.toFixed(1);
    return `${s}억원`;
  }
  if (abs >= 10_000) {
    return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만원`;
  }
  return fmtWon(n);
}

/** 집행률 등 백분율 (소수점 1자리) */
export function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

export function newId(prefix: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}
