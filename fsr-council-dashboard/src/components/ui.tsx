import type { ReactNode } from "react";
import type {
  NoticeCategory,
  SuggestionCategory,
  SuggestionStatus,
} from "../data/types";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-hairline bg-surface ${padded ? "p-5" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  action,
  className = "",
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 flex items-center justify-between gap-3 ${className}`}>
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {description && (
          <p className="mt-1 text-[13px] text-ink2">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* 상태 배지 — 상태 색은 색만으로 의미를 전달하지 않도록 항상
   글리프 + 텍스트 라벨과 함께 쓴다. */
const STATUS_META: Record<
  SuggestionStatus,
  { glyph: string; dotClass: string }
> = {
  접수: { glyph: "○", dotClass: "text-mutedink" },
  검토중: { glyph: "◔", dotClass: "text-warning" },
  답변완료: { glyph: "✓", dotClass: "text-goodtext" },
  보류: { glyph: "－", dotClass: "text-serious" },
};

export function StatusBadge({ status }: { status: SuggestionStatus }) {
  const meta = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-hairline bg-page px-2 py-0.5 text-[11px] font-medium text-ink2">
      <span aria-hidden className={meta.dotClass}>
        {meta.glyph}
      </span>
      {status}
    </span>
  );
}

export function CategoryBadge({
  label,
}: {
  label: NoticeCategory | SuggestionCategory | string;
}) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent-soft/60 px-2 py-0.5 text-[11px] font-medium text-accent-strong">
      {label}
    </span>
  );
}

export function PinBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">
      고정
    </span>
  );
}

type ButtonVariant = "primary" | "ghost" | "subtle";

const BUTTON_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-strong border border-transparent",
  ghost: "border border-hairline bg-surface text-ink2 hover:text-ink",
  subtle: "border border-transparent bg-transparent text-ink2 hover:text-ink",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${BUTTON_CLASS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export const fieldCls =
  "w-full rounded-lg border border-hairline bg-page px-3 py-2 text-[13px] text-ink placeholder:text-mutedink focus:border-accent focus:outline-none";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-[12px] font-medium text-ink2">
      {children}
    </span>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-axisline px-4 py-8 text-center text-[13px] text-mutedink">
      {message}
    </p>
  );
}

/** 차트 ↔ 표 전환 토글 (모든 차트는 표 뷰 트윈을 가진다) */
export function ViewToggle({
  view,
  onChange,
}: {
  view: "chart" | "table";
  onChange: (v: "chart" | "table") => void;
}) {
  const base =
    "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors";
  return (
    <div
      role="group"
      aria-label="보기 전환"
      className="inline-flex gap-0.5 rounded-lg border border-hairline bg-page p-0.5"
    >
      <button
        type="button"
        aria-pressed={view === "chart"}
        onClick={() => onChange("chart")}
        className={`${base} ${view === "chart" ? "bg-surface text-ink shadow-sm" : "text-mutedink hover:text-ink2"}`}
      >
        차트
      </button>
      <button
        type="button"
        aria-pressed={view === "table"}
        onClick={() => onChange("table")}
        className={`${base} ${view === "table" ? "bg-surface text-ink shadow-sm" : "text-mutedink hover:text-ink2"}`}
      >
        표
      </button>
    </div>
  );
}
