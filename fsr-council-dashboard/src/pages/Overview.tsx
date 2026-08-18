import { Link } from "react-router-dom";
import { CategoryMeters } from "../components/CategoryMeters";
import { MonthlySpendCard } from "../components/MonthlySpendCard";
import { NoticeItem } from "../components/NoticeItem";
import { MeterBar, StatTile } from "../components/Stat";
import {
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "../components/ui";
import {
  dday,
  fmtDate,
  fmtDateK,
  fmtWonCompact,
  pct,
  todayISO,
} from "../lib/format";
import {
  latestSpendYear,
  monthlySpent,
  pendingSuggestions,
  spentByCategory,
  totalIncome,
  totalSpent,
} from "../lib/selectors";
import { useStore } from "../store";

function MoreLink({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="text-[12.5px] font-medium text-accent hover:text-accent-strong"
    >
      전체보기 →
    </Link>
  );
}

export function Overview() {
  const { state } = useStore();
  const { transactions, suggestions, notices, meetings, budgetCategories } =
    state;

  const income = totalIncome(transactions);
  const spent = totalSpent(transactions);
  const rate = pct(spent, income);
  const pending = pendingSuggestions(suggestions);
  const year = latestSpendYear(transactions);
  const monthly = monthlySpent(transactions, year);
  const catSpent = spentByCategory(transactions);

  const upcoming = meetings
    .filter((m) => m.status === "예정" && dday(m.date) !== null)
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming[0];

  const recentNotices = [...notices]
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date),
    )
    .slice(0, 5);

  const recentSuggestions = [...suggestions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="대시보드"
        description={`${fmtDate(todayISO())} 기준 협의회 운영 현황입니다.`}
      />

      {/* KPI 타일 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile
          label="예산 집행률"
          value={`${rate}%`}
          sub={`집행 ${fmtWonCompact(spent)} / 재원 ${fmtWonCompact(income)}`}
        >
          <MeterBar fraction={rate / 100} className="mt-1.5" />
        </StatTile>
        <StatTile
          label="잔여 예산"
          value={fmtWonCompact(income - spent)}
          sub={`총 재원 ${fmtWonCompact(income)}`}
        />
        <StatTile
          label="처리 대기 건의"
          value={`${pending}건`}
          sub={`전체 ${suggestions.length}건 중 접수·검토중`}
        />
        <StatTile
          label="다음 일정"
          value={next ? (dday(next.date) ?? "-") : "없음"}
          sub={
            next
              ? `${next.title} · ${fmtDateK(next.date)}`
              : "예정된 일정이 없습니다"
          }
        />
      </div>

      {/* 월별 집행 + 최근 공지 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <MonthlySpendCard
          year={year}
          values={monthly}
          className="lg:col-span-2"
        />
        <Card>
          <CardHeader title="최근 공지" action={<MoreLink to="/notices" />} />
          {recentNotices.length === 0 ? (
            <EmptyState message="등록된 공지가 없습니다." />
          ) : (
            <div className="divide-y divide-hairline/60">
              {recentNotices.map((n) => (
                <NoticeItem key={n.id} notice={n} />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 최근 건의 + 예산 항목 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="최근 건의"
            action={<MoreLink to="/suggestions" />}
          />
          {recentSuggestions.length === 0 ? (
            <EmptyState message="등록된 건의가 없습니다." />
          ) : (
            <div className="divide-y divide-hairline/60">
              {recentSuggestions.map((s) => (
                <Link
                  key={s.id}
                  to="/suggestions"
                  className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-page"
                >
                  <StatusBadge status={s.status} />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">
                    {s.title}
                  </span>
                  <span className="hidden shrink-0 text-[12px] text-mutedink sm:inline">
                    공감 {s.votes}
                  </span>
                  <span className="shrink-0 text-[12px] tabular-nums text-mutedink">
                    {fmtDate(s.date)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader
            title="항목별 예산 집행"
            action={<MoreLink to="/budget" />}
          />
          <CategoryMeters categories={budgetCategories} spent={catSpent} />
        </Card>
      </div>

      {/* 다가오는 일정 + 협의회 구성 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="다가오는 일정"
            action={<MoreLink to="/meetings" />}
          />
          {upcoming.length === 0 ? (
            <EmptyState message="예정된 일정이 없습니다." />
          ) : (
            <div className="space-y-3">
              {upcoming.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl bg-page px-4 py-3"
                >
                  <span className="inline-flex shrink-0 items-center rounded-lg bg-accent-soft/60 px-2.5 py-1 text-[12.5px] font-bold tabular-nums text-accent-strong">
                    {dday(m.date)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-semibold text-ink">
                      {m.title}
                    </div>
                    <div className="truncate text-[12px] text-ink2">
                      {fmtDateK(m.date)}
                      {m.time ? ` ${m.time}` : ""} · {m.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader title="협의회 구성" />
          <div className="grid grid-cols-2 gap-2.5">
            {state.members.map((m) => (
              <div
                key={`${m.role}-${m.name}`}
                className="rounded-xl bg-page px-3 py-2.5"
              >
                <div className="text-[11px] text-mutedink">
                  {m.role} · {m.branch}
                </div>
                <div className="text-[13.5px] font-medium text-ink">
                  {m.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
