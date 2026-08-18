import { useState } from "react";
import { Icon } from "../components/Icon";
import {
  Button,
  Card,
  CategoryBadge,
  EmptyState,
  FieldLabel,
  PageHeader,
  StatusBadge,
  fieldCls,
} from "../components/ui";
import type {
  Suggestion,
  SuggestionCategory,
  SuggestionStatus,
} from "../data/types";
import { fmtDate, newId, todayISO } from "../lib/format";
import { useStore } from "../store";

const CATEGORIES: SuggestionCategory[] = [
  "제도개선",
  "영업지원",
  "복지/환경",
  "교육",
  "기타",
];
const STATUSES: SuggestionStatus[] = ["접수", "검토중", "답변완료", "보류"];

function SuggestionForm({ onDone }: { onDone: () => void }) {
  const { addSuggestion } = useStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<SuggestionCategory>("제도개선");
  const [body, setBody] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [author, setAuthor] = useState("");

  const valid =
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    (anonymous || author.trim().length > 0);

  return (
    <Card className="mb-4">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addSuggestion({
            id: newId("s"),
            title: title.trim(),
            body: body.trim(),
            category,
            author: anonymous ? "익명" : author.trim(),
            anonymous,
            date: todayISO(),
            status: "접수",
            votes: 0,
          });
          onDone();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_150px]">
          <label>
            <FieldLabel>제목</FieldLabel>
            <input
              className={fieldCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="건의 제목"
            />
          </label>
          <label>
            <FieldLabel>분류</FieldLabel>
            <select
              className={fieldCls}
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as SuggestionCategory)
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <FieldLabel>내용</FieldLabel>
          <textarea
            className={`${fieldCls} min-h-24`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="건의 내용을 구체적으로 적어주세요"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="size-4 accent-(--accent)"
            />
            <span className="text-[13px] text-ink2">익명으로 제출</span>
          </label>
          {!anonymous && (
            <input
              className={`${fieldCls} max-w-40`}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작성자 이름"
            />
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" onClick={onDone}>
              취소
            </Button>
            <Button type="submit" disabled={!valid}>
              제출
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}

function AdminControls({ suggestion }: { suggestion: Suggestion }) {
  const { setSuggestionStatus, replySuggestion } = useStore();
  const [reply, setReply] = useState(suggestion.reply?.body ?? "");

  return (
    <div className="mt-3 space-y-2.5 rounded-xl border border-dashed border-axisline p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="text-[12px] font-semibold text-ink2">운영진</span>
        <label className="flex items-center gap-1.5 text-[12.5px] text-ink2">
          상태
          <select
            className="rounded-md border border-hairline bg-page px-2 py-1 text-[12.5px] text-ink focus:border-accent focus:outline-none"
            value={suggestion.status}
            onChange={(e) =>
              setSuggestionStatus(
                suggestion.id,
                e.target.value as SuggestionStatus,
              )
            }
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <textarea
        className={`${fieldCls} min-h-20`}
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="답변을 작성하면 상태가 '답변완료'로 변경됩니다"
      />
      <div className="flex justify-end">
        <Button
          disabled={reply.trim().length === 0}
          onClick={() => replySuggestion(suggestion.id, reply.trim())}
        >
          답변 등록
        </Button>
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const { admin, votedIds, voteSuggestion } = useStore();
  const [open, setOpen] = useState(false);
  const voted = votedIds.includes(suggestion.id);

  return (
    <Card padded={false}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-2.5 rounded-2xl px-5 py-4 text-left transition-colors hover:bg-page/60"
      >
        <StatusBadge status={suggestion.status} />
        <CategoryBadge label={suggestion.category} />
        <span className="min-w-0 flex-1 basis-52 truncate text-[14px] font-semibold text-ink">
          {suggestion.title}
        </span>
        <span className="shrink-0 text-[12px] text-mutedink">
          {suggestion.author} · {fmtDate(suggestion.date)} · 공감{" "}
          {suggestion.votes}
        </span>
      </button>

      {open && (
        <div className="border-t border-hairline/60 px-5 py-4">
          <p className="text-[13.5px] leading-relaxed text-ink2">
            {suggestion.body}
          </p>

          {suggestion.reply && (
            <div className="mt-3 rounded-r-xl border-l-2 border-accent bg-page px-4 py-3">
              <div className="mb-1 text-[12px] font-semibold text-accent-strong">
                {suggestion.reply.author} 답변 ·{" "}
                {fmtDate(suggestion.reply.date)}
              </div>
              <p className="text-[13.5px] leading-relaxed text-ink2">
                {suggestion.reply.body}
              </p>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <Button
              variant="ghost"
              disabled={voted}
              onClick={() => voteSuggestion(suggestion.id)}
            >
              <Icon name="heart" size={14} className={voted ? "text-critical" : ""} />
              {voted ? "공감함" : "공감"} {suggestion.votes}
            </Button>
          </div>

          {admin && <AdminControls suggestion={suggestion} />}
        </div>
      )}
    </Card>
  );
}

type Filter = "전체" | SuggestionStatus;

export function Suggestions() {
  const { state } = useStore();
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState<Filter>("전체");

  const sorted = [...state.suggestions].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const filtered =
    filter === "전체" ? sorted : sorted.filter((s) => s.status === filter);

  const countOf = (f: Filter) =>
    f === "전체"
      ? state.suggestions.length
      : state.suggestions.filter((s) => s.status === f).length;

  return (
    <>
      <PageHeader
        title="건의함"
        description="현장의 의견을 남겨주세요. 운영진이 검토 후 답변드립니다."
        action={
          <Button onClick={() => setWriting((w) => !w)}>
            <Icon name="plus" size={14} />
            {writing ? "작성 닫기" : "건의 제출"}
          </Button>
        }
      />
      {writing && <SuggestionForm onDone={() => setWriting(false)} />}

      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["전체", ...STATUSES] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
              filter === f
                ? "bg-accent text-white"
                : "border border-hairline bg-surface text-ink2 hover:text-ink"
            }`}
          >
            {f} {countOf(f)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="해당 상태의 건의가 없습니다." />
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      )}
    </>
  );
}
