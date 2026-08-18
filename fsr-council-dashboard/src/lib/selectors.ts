import type { Suggestion, Transaction } from "../data/types";

export function totalIncome(txns: Transaction[]): number {
  return txns
    .filter((t) => t.type === "수입")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function totalSpent(txns: Transaction[]): number {
  return txns
    .filter((t) => t.type === "지출")
    .reduce((sum, t) => sum + t.amount, 0);
}

/** 항목별 지출 합계 (categoryId → 금액) */
export function spentByCategory(txns: Transaction[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of txns) {
    if (t.type !== "지출" || !t.categoryId) continue;
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
  }
  return map;
}

/** 해당 연도 1~12월 지출 합계 배열 */
export function monthlySpent(txns: Transaction[], year: number): number[] {
  const months = Array.from({ length: 12 }, () => 0);
  const prefix = `${year}-`;
  for (const t of txns) {
    if (t.type !== "지출" || !t.date.startsWith(prefix)) continue;
    const m = Number(t.date.slice(5, 7));
    if (m >= 1 && m <= 12) months[m - 1] += t.amount;
  }
  return months;
}

/** 지출 데이터가 있는 가장 최근 연도 (없으면 현재 연도) */
export function latestSpendYear(txns: Transaction[]): number {
  let latest = 0;
  for (const t of txns) {
    if (t.type !== "지출") continue;
    const y = Number(t.date.slice(0, 4));
    if (y > latest) latest = y;
  }
  return latest || new Date().getFullYear();
}

/** 처리 대기 건의 수 (접수 + 검토중) */
export function pendingSuggestions(suggestions: Suggestion[]): number {
  return suggestions.filter(
    (s) => s.status === "접수" || s.status === "검토중",
  ).length;
}
