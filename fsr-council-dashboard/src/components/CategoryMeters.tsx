import type { BudgetCategory } from "../data/types";
import { fmtWon, pct } from "../lib/format";
import { MeterBar } from "./Stat";

/** 항목별 배정 대비 집행 미터 목록. 정확한 수치는 결산표(표 뷰)가 담당한다. */
export function CategoryMeters({
  categories,
  spent,
}: {
  categories: BudgetCategory[];
  spent: Map<string, number>;
}) {
  return (
    <div className="space-y-3">
      {categories.map((c) => {
        const used = spent.get(c.id) ?? 0;
        const p = pct(used, c.planned);
        return (
          <div
            key={c.id}
            className="flex items-center gap-3"
            title={`${c.name} · 집행 ${fmtWon(used)} / 배정 ${fmtWon(c.planned)}`}
          >
            <span className="w-[80px] shrink-0 truncate text-[13px] text-ink2">
              {c.name}
            </span>
            <MeterBar fraction={c.planned > 0 ? used / c.planned : 0} className="flex-1" />
            <span className="w-12 shrink-0 text-right text-[12.5px] font-semibold tabular-nums text-ink">
              {p}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
