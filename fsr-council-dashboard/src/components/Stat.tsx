import type { ReactNode } from "react";
import { Card } from "./ui";

/** 스탯 타일 — 라벨 · 값(고유폭 아님, 비례 숫자) · 보조 설명 한 줄 */
export function StatTile({
  label,
  value,
  sub,
  children,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-[13px] text-ink2">{label}</span>
      <span className="text-[26px] font-semibold leading-tight text-ink">
        {value}
      </span>
      {sub && <span className="text-[12px] text-mutedink">{sub}</span>}
      {children}
    </Card>
  );
}

/** 미터 — 채움은 시리즈 블루, 트랙은 같은 램프의 밝은 스텝 */
export function MeterBar({
  fraction,
  className = "",
}: {
  fraction: number; // 0..1 (초과분은 잘라서 표시)
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, fraction));
  const over = fraction > 1;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(fraction * 100)}
      className={`h-2 w-full overflow-hidden rounded-full bg-accent-soft ${className}`}
    >
      <div
        className={`h-full rounded-full ${over ? "bg-critical" : "bg-accent"}`}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}
