import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { NoticeItem } from "../components/NoticeItem";
import {
  Button,
  Card,
  CategoryBadge,
  EmptyState,
  FieldLabel,
  PageHeader,
  PinBadge,
  fieldCls,
} from "../components/ui";
import type { NoticeCategory } from "../data/types";
import { fmtDate, newId, todayISO } from "../lib/format";
import { useStore } from "../store";

const CATEGORIES: NoticeCategory[] = ["공지", "행사", "규정", "일반"];

function NoticeForm({ onDone }: { onDone: () => void }) {
  const { addNotice } = useStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<NoticeCategory>("공지");
  const [pinned, setPinned] = useState(false);
  const [body, setBody] = useState("");

  const valid = title.trim().length > 0 && body.trim().length > 0;

  return (
    <Card className="mb-4">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addNotice({
            id: newId("n"),
            title: title.trim(),
            body: body.trim(),
            category,
            pinned,
            author: "협의회 운영진",
            date: todayISO(),
          });
          onDone();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto]">
          <label>
            <FieldLabel>제목</FieldLabel>
            <input
              className={fieldCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지 제목"
            />
          </label>
          <label>
            <FieldLabel>분류</FieldLabel>
            <select
              className={fieldCls}
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="size-4 accent-(--accent)"
            />
            <span className="text-[13px] text-ink2">상단 고정</span>
          </label>
        </div>
        <label className="block">
          <FieldLabel>내용</FieldLabel>
          <textarea
            className={`${fieldCls} min-h-28`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="공지 내용 (줄바꿈으로 문단 구분)"
          />
        </label>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onDone}>
            취소
          </Button>
          <Button type="submit" disabled={!valid}>
            등록
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function Notices() {
  const { state, admin } = useStore();
  const [writing, setWriting] = useState(false);

  const sorted = [...state.notices].sort(
    (a, b) =>
      Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date),
  );

  return (
    <>
      <PageHeader
        title="공지사항"
        description="협의회 공지·행사·규정 안내를 확인하세요."
        action={
          admin && (
            <Button onClick={() => setWriting((w) => !w)}>
              {writing ? "작성 닫기" : "공지 작성"}
            </Button>
          )
        }
      />
      {admin && writing && <NoticeForm onDone={() => setWriting(false)} />}
      <Card>
        {sorted.length === 0 ? (
          <EmptyState message="등록된 공지가 없습니다." />
        ) : (
          <div className="divide-y divide-hairline/60">
            {sorted.map((n) => (
              <NoticeItem key={n.id} notice={n} />
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

export function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const notice = state.notices.find((n) => n.id === id);

  return (
    <>
      <Link
        to="/notices"
        className="mb-4 inline-block text-[13px] font-medium text-accent hover:text-accent-strong"
      >
        ← 공지사항 목록
      </Link>
      {!notice ? (
        <EmptyState message="공지를 찾을 수 없습니다." />
      ) : (
        <Card>
          <div className="flex items-center gap-2">
            {notice.pinned && <PinBadge />}
            <CategoryBadge label={notice.category} />
          </div>
          <h1 className="mt-2.5 text-lg font-bold text-ink">{notice.title}</h1>
          <p className="mt-1 text-[12.5px] text-mutedink">
            {notice.author} · {fmtDate(notice.date)}
          </p>
          <hr className="my-4 border-hairline" />
          <div className="space-y-2.5">
            {notice.body.split("\n").map((para, i) => (
              <p key={i} className="text-[14px] leading-relaxed text-ink2">
                {para}
              </p>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
