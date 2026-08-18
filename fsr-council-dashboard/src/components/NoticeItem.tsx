import { Link } from "react-router-dom";
import type { Notice } from "../data/types";
import { fmtDate } from "../lib/format";
import { CategoryBadge, PinBadge } from "./ui";

export function NoticeItem({ notice }: { notice: Notice }) {
  return (
    <Link
      to={`/notices/${notice.id}`}
      className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-page"
    >
      {notice.pinned && <PinBadge />}
      <CategoryBadge label={notice.category} />
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
        {notice.title}
      </span>
      <span className="shrink-0 text-[12px] tabular-nums text-mutedink">
        {fmtDate(notice.date)}
      </span>
    </Link>
  );
}
