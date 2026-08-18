import { Card, EmptyState, PageHeader } from "../components/ui";
import type { Meeting } from "../data/types";
import { dday, fmtDateK } from "../lib/format";
import { useStore } from "../store";

function UpcomingMeetingCard({ meeting }: { meeting: Meeting }) {
  const d = dday(meeting.date);
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2.5">
        {d && (
          <span className="inline-flex items-center rounded-lg bg-accent px-2.5 py-1 text-[12.5px] font-bold tabular-nums text-white">
            {d}
          </span>
        )}
        <h2 className="text-[15px] font-bold text-ink">{meeting.title}</h2>
        <span className="text-[12.5px] text-ink2">
          {fmtDateK(meeting.date)}
          {meeting.time ? ` ${meeting.time}` : ""} · {meeting.location}
        </span>
      </div>
      {meeting.agenda.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {meeting.agenda.map((a, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13.5px] text-ink2"
            >
              <span className="mt-0.5 shrink-0 rounded bg-accent-soft/60 px-1.5 text-[11px] font-semibold tabular-nums text-accent-strong">
                {i + 1}
              </span>
              {a}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function PastMeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center rounded-full border border-hairline bg-page px-2 py-0.5 text-[11px] font-medium text-ink2">
          <span aria-hidden className="mr-1 text-goodtext">
            ✓
          </span>
          완료
        </span>
        <h2 className="text-[14.5px] font-semibold text-ink">
          {meeting.title}
        </h2>
        <span className="text-[12.5px] text-mutedink">
          {fmtDateK(meeting.date)} · {meeting.location}
        </span>
      </div>
      <div className="mt-2.5 text-[12.5px] text-mutedink">
        안건: {meeting.agenda.join(" · ")}
      </div>
      {meeting.summary && (
        <div className="mt-2.5 rounded-r-xl border-l-2 border-axisline bg-page px-4 py-3">
          <div className="mb-1 text-[12px] font-semibold text-ink2">
            회의록 요약
          </div>
          <p className="text-[13px] leading-relaxed text-ink2">
            {meeting.summary}
          </p>
        </div>
      )}
    </Card>
  );
}

export function Meetings() {
  const { state } = useStore();

  const upcoming = state.meetings
    .filter((m) => m.status === "예정")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = state.meetings
    .filter((m) => m.status === "완료")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader
        title="회의·일정"
        description="정기회의와 협의회 행사 일정, 지난 회의록 요약입니다."
      />

      <h2 className="mb-3 text-[13px] font-semibold text-mutedink">
        다가오는 일정
      </h2>
      {upcoming.length === 0 ? (
        <EmptyState message="예정된 일정이 없습니다." />
      ) : (
        <div className="space-y-3">
          {upcoming.map((m) => (
            <UpcomingMeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-7 text-[13px] font-semibold text-mutedink">
        지난 회의
      </h2>
      {past.length === 0 ? (
        <EmptyState message="지난 회의가 없습니다." />
      ) : (
        <div className="space-y-3">
          {past.map((m) => (
            <PastMeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
    </>
  );
}
