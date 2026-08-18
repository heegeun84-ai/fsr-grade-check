import { useState } from "react";
import { CategoryMeters } from "../components/CategoryMeters";
import { Icon } from "../components/Icon";
import { MonthlySpendCard } from "../components/MonthlySpendCard";
import { MeterBar, StatTile } from "../components/Stat";
import {
  Button,
  Card,
  CardHeader,
  CategoryBadge,
  EmptyState,
  FieldLabel,
  PageHeader,
  fieldCls,
} from "../components/ui";
import { fmtDate, fmtWon, fmtWonCompact, newId, pct, todayISO } from "../lib/format";
import {
  latestSpendYear,
  monthlySpent,
  spentByCategory,
  totalIncome,
  totalSpent,
} from "../lib/selectors";
import { useStore } from "../store";

function ExpenseForm({ onDone }: { onDone: () => void }) {
  const { state, addTransaction } = useStore();
  const [date, setDate] = useState(todayISO());
  const [categoryId, setCategoryId] = useState(
    state.budgetCategories[0]?.id ?? "",
  );
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const amountNum = Number(amount);
  const valid =
    description.trim().length > 0 &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    categoryId !== "";

  return (
    <Card className="mb-4">
      <form
        className="grid gap-3 sm:grid-cols-[140px_150px_1fr_130px_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addTransaction({
            id: newId("t"),
            date,
            type: "지출",
            categoryId,
            description: description.trim(),
            amount: Math.round(amountNum),
          });
          onDone();
        }}
      >
        <label>
          <FieldLabel>일자</FieldLabel>
          <input
            type="date"
            className={fieldCls}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          <FieldLabel>항목</FieldLabel>
          <select
            className={fieldCls}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {state.budgetCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <FieldLabel>내용</FieldLabel>
          <input
            className={fieldCls}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="지출 내용"
          />
        </label>
        <label>
          <FieldLabel>금액 (원)</FieldLabel>
          <input
            type="number"
            min="1"
            step="1"
            className={fieldCls}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
          />
        </label>
        <div className="flex items-end gap-2 pb-0.5">
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

export function Budget() {
  const { state, admin } = useStore();
  const { transactions, budgetCategories } = state;
  const [adding, setAdding] = useState(false);
  const [catFilter, setCatFilter] = useState("전체");

  const income = totalIncome(transactions);
  const spent = totalSpent(transactions);
  const rate = pct(spent, income);
  const catSpent = spentByCategory(transactions);
  const year = latestSpendYear(transactions);
  const monthly = monthlySpent(transactions, year);

  const incomes = transactions
    .filter((t) => t.type === "수입")
    .sort((a, b) => a.date.localeCompare(b.date));
  const expenses = transactions
    .filter((t) => t.type === "지출")
    .sort((a, b) => b.date.localeCompare(a.date));
  const filteredExpenses =
    catFilter === "전체"
      ? expenses
      : expenses.filter((t) => t.categoryId === catFilter);

  const catName = (id?: string) =>
    budgetCategories.find((c) => c.id === id)?.name ?? "기타";

  const plannedTotal = budgetCategories.reduce((s, c) => s + c.planned, 0);
  const spentTotal = budgetCategories.reduce(
    (s, c) => s + (catSpent.get(c.id) ?? 0),
    0,
  );

  return (
    <>
      <PageHeader
        title="예산·결산"
        description={`${year}년 협의회 재원과 집행 내역입니다.`}
        action={
          admin && (
            <Button onClick={() => setAdding((a) => !a)}>
              <Icon name="plus" size={14} />
              {adding ? "등록 닫기" : "지출 등록"}
            </Button>
          )
        }
      />
      {admin && adding && <ExpenseForm onDone={() => setAdding(false)} />}

      {/* 요약 타일 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile
          label="총 재원"
          value={fmtWonCompact(income)}
          sub="본사 지원금 + 회비"
        />
        <StatTile
          label="총 집행액"
          value={fmtWonCompact(spent)}
          sub={`지출 ${expenses.length}건`}
        />
        <StatTile label="잔액" value={fmtWonCompact(income - spent)} />
        <StatTile label="집행률" value={`${rate}%`}>
          <MeterBar fraction={rate / 100} className="mt-1.5" />
        </StatTile>
      </div>

      {/* 월별 추이 + 재원 내역 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <MonthlySpendCard
          year={year}
          values={monthly}
          className="lg:col-span-2"
        />
        <Card>
          <CardHeader title="재원 내역" />
          {incomes.length === 0 ? (
            <EmptyState message="수입 내역이 없습니다." />
          ) : (
            <div className="space-y-2.5">
              {incomes.map((t) => (
                <div key={t.id} className="rounded-xl bg-page px-3.5 py-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium text-ink">
                      {t.source}
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-ink">
                      {fmtWon(t.amount)}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12px] text-mutedink">
                    {fmtDate(t.date)} · {t.description}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-hairline px-3.5 pt-2.5">
                <span className="text-[13px] font-semibold text-ink">합계</span>
                <span className="text-[13px] font-semibold tabular-nums text-ink">
                  {fmtWon(income)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* 항목별 미터 + 결산표 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader title="항목별 집행 현황" />
          <CategoryMeters categories={budgetCategories} spent={catSpent} />
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader title="결산표" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-[13px]">
              <thead>
                <tr className="border-b border-hairline text-left text-[12px] text-mutedink">
                  <th className="py-2 font-medium">항목</th>
                  <th className="py-2 text-right font-medium">배정액</th>
                  <th className="py-2 text-right font-medium">집행액</th>
                  <th className="py-2 text-right font-medium">잔액</th>
                  <th className="py-2 text-right font-medium">집행률</th>
                </tr>
              </thead>
              <tbody>
                {budgetCategories.map((c) => {
                  const used = catSpent.get(c.id) ?? 0;
                  return (
                    <tr key={c.id} className="border-b border-hairline/60">
                      <td className="py-2 text-ink">
                        {c.name}
                        {c.note && (
                          <span className="ml-1.5 hidden text-[11.5px] text-mutedink xl:inline">
                            {c.note}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink2">
                        {c.planned.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink">
                        {used.toLocaleString("ko-KR")}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink2">
                        {(c.planned - used).toLocaleString("ko-KR")}
                      </td>
                      <td className="py-2 text-right tabular-nums text-ink">
                        {pct(used, c.planned)}%
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2.5 font-semibold text-ink">합계</td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-ink">
                    {plannedTotal.toLocaleString("ko-KR")}
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-ink">
                    {spentTotal.toLocaleString("ko-KR")}
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-ink">
                    {(plannedTotal - spentTotal).toLocaleString("ko-KR")}
                  </td>
                  <td className="py-2.5 text-right font-semibold tabular-nums text-ink">
                    {pct(spentTotal, plannedTotal)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11.5px] text-mutedink">단위: 원</p>
        </Card>
      </div>

      {/* 지출 내역 */}
      <Card className="mt-4">
        <CardHeader
          title="지출 내역"
          action={
            <select
              aria-label="항목 필터"
              className="rounded-lg border border-hairline bg-page px-2.5 py-1.5 text-[12.5px] text-ink focus:border-accent focus:outline-none"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="전체">전체 항목</option>
              {budgetCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          }
        />
        {filteredExpenses.length === 0 ? (
          <EmptyState message="지출 내역이 없습니다." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[13px]">
              <thead>
                <tr className="border-b border-hairline text-left text-[12px] text-mutedink">
                  <th className="py-2 font-medium">일자</th>
                  <th className="py-2 font-medium">항목</th>
                  <th className="py-2 font-medium">내용</th>
                  <th className="py-2 text-right font-medium">금액</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((t) => (
                  <tr key={t.id} className="border-b border-hairline/60">
                    <td className="py-2 tabular-nums text-ink2">
                      {fmtDate(t.date)}
                    </td>
                    <td className="py-2">
                      <CategoryBadge label={catName(t.categoryId)} />
                    </td>
                    <td className="py-2 text-ink">{t.description}</td>
                    <td className="py-2 text-right tabular-nums text-ink">
                      {fmtWon(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
