import { useState } from "react";
import { fmtWon } from "../lib/format";
import { Card, CardHeader, ViewToggle } from "./ui";

/* ---- 스케일: 축 눈금은 깔끔한 수(1/2/2.5/5 × 10^k)로 올림 ---- */
function niceScale(maxValue: number): { max: number; ticks: number[] } {
  if (maxValue <= 0) return { max: 1_000_000, ticks: [0, 500_000, 1_000_000] };
  const rough = maxValue / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  let step = pow * 10;
  for (const c of [1, 2, 2.5, 5, 10]) {
    if (c * pow >= rough) {
      step = c * pow;
      break;
    }
  }
  const max = step * Math.ceil(maxValue / step - 1e-9);
  const ticks: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) ticks.push(v);
  return { max, ticks };
}

function fmtTick(v: number): string {
  if (v === 0) return "0";
  return `${(v / 10_000).toLocaleString("ko-KR")}만`;
}

function barPath(x: number, y: number, w: number, h: number): string {
  // 데이터 끝(위쪽)만 4px 라운드, 기준선 쪽은 각지게
  const r = Math.min(4, w / 2, h);
  const bottom = y + h;
  return [
    `M${x},${bottom}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + w - r},${y}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${bottom}`,
    "Z",
  ].join(" ");
}

const W = 720;
const H = 240;
const PAD_L = 48;
const PAD_R = 10;
const PAD_T = 24;
const PAD_B = 26;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

function MonthlyChart({ year, values }: { year: number; values: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const { max, ticks } = niceScale(Math.max(...values));
  const band = INNER_W / 12;
  const barW = Math.min(24, band * 0.55);
  const maxIdx = values.reduce(
    (best, v, i) => (v > values[best] ? i : best),
    0,
  );

  const yFor = (v: number) => PAD_T + INNER_H * (1 - v / max);
  const centerFor = (i: number) => PAD_L + band * i + band / 2;

  return (
    // 좁은 화면에서는 SVG를 축소하지 않고 가로 스크롤로 유지한다
    <div className="overflow-x-auto">
      <div className="relative min-w-[560px]">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label={`${year}년 월별 지출 차트`}
        onMouseLeave={() => setHover(null)}
      >
        {/* 그리드: 헤어라인, 실선 */}
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={yFor(t)}
              y2={yFor(t)}
              stroke={t === 0 ? "var(--axis-line)" : "var(--grid-line)"}
              strokeWidth="1"
            />
            <text
              x={PAD_L - 8}
              y={yFor(t) + 3.5}
              textAnchor="end"
              fontSize="10.5"
              fill="var(--ink-muted)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {fmtTick(t)}
            </text>
          </g>
        ))}

        {/* 막대 */}
        {values.map((v, i) => {
          if (v <= 0) return null;
          const h = (v / max) * INNER_H;
          const x = PAD_L + band * i + (band - barW) / 2;
          return (
            <path
              key={i}
              d={barPath(x, yFor(v), barW, h)}
              className={`viz-bar${hover === i ? " viz-bar--hover" : ""}`}
            />
          );
        })}

        {/* 선택적 직접 라벨: 최댓값 달에만 */}
        {values[maxIdx] > 0 && (
          <text
            x={centerFor(maxIdx)}
            y={yFor(values[maxIdx]) - 7}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="var(--ink)"
          >
            {fmtTick(Math.round(values[maxIdx]))}원
          </text>
        )}

        {/* 월 라벨 */}
        {values.map((_, i) => (
          <text
            key={i}
            x={centerFor(i)}
            y={H - 8}
            textAnchor="middle"
            fontSize="10.5"
            fill="var(--ink-muted)"
          >
            {i + 1}월
          </text>
        ))}

        {/* 히트 영역: 마크보다 넓게(밴드 전체), 키보드 접근 가능 */}
        {values.map((v, i) => (
          <rect
            key={i}
            x={PAD_L + band * i}
            y={PAD_T}
            width={band}
            height={INNER_H}
            fill="transparent"
            className="viz-hit"
            tabIndex={0}
            role="img"
            aria-label={`${i + 1}월 지출 ${v > 0 ? fmtWon(v) : "없음"}`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
          />
        ))}
      </svg>

      {/* 툴팁: 값이 앞, 라벨이 뒤 */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-hairline bg-surface px-2.5 py-1.5 shadow-md"
          style={{
            left: `${Math.min(88, Math.max(12, (centerFor(hover) / W) * 100))}%`,
            top: `${(Math.max(yFor(values[hover]) - 6, 46) / H) * 100}%`,
          }}
        >
          <span className="text-[13px] font-semibold text-ink">
            {values[hover] > 0 ? fmtWon(values[hover]) : "지출 없음"}
          </span>
          <span className="ml-1.5 text-[11.5px] text-ink2">
            {hover + 1}월 지출
          </span>
        </div>
      )}
      </div>
    </div>
  );
}

function MonthlyTable({ year, values }: { year: number; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <table className="w-full text-[13px]">
      <caption className="sr-only">{year}년 월별 지출 표</caption>
      <thead>
        <tr className="border-b border-hairline text-left text-[12px] text-mutedink">
          <th className="py-1.5 font-medium">월</th>
          <th className="py-1.5 text-right font-medium">지출액</th>
        </tr>
      </thead>
      <tbody>
        {values.map((v, i) => (
          <tr key={i} className="border-b border-hairline/60">
            <td className="py-1.5 text-ink2">{i + 1}월</td>
            <td className="py-1.5 text-right tabular-nums text-ink">
              {v > 0 ? fmtWon(v) : "—"}
            </td>
          </tr>
        ))}
        <tr>
          <td className="py-2 font-semibold text-ink">합계</td>
          <td className="py-2 text-right font-semibold tabular-nums text-ink">
            {fmtWon(total)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** 월별 집행 추이 카드 (차트/표 전환 포함) */
export function MonthlySpendCard({
  year,
  values,
  className = "",
}: {
  year: number;
  values: number[];
  className?: string;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  return (
    <Card className={className}>
      <CardHeader
        title={`${year}년 월별 집행 추이`}
        action={<ViewToggle view={view} onChange={setView} />}
      />
      {view === "chart" ? (
        <MonthlyChart year={year} values={values} />
      ) : (
        <MonthlyTable year={year} values={values} />
      )}
    </Card>
  );
}
