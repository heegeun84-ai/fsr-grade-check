import { useEffect } from "react";
import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useStore } from "../store";
import { Icon } from "./Icon";
import type { IconName } from "./Icon";

const NAV: { to: string; label: string; icon: IconName; end?: boolean }[] = [
  { to: "/", label: "대시보드", icon: "grid", end: true },
  { to: "/notices", label: "공지사항", icon: "bell" },
  { to: "/suggestions", label: "건의함", icon: "chat" },
  { to: "/budget", label: "예산·결산", icon: "banknote" },
  { to: "/meetings", label: "회의·일정", icon: "calendar" },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-accent">
        메트라이프
      </div>
      <div
        className={`font-bold leading-tight text-ink ${compact ? "text-[15px]" : "text-[17px]"}`}
      >
        대표FSR협의회
      </div>
      {!compact && (
        <div className="mt-0.5 text-[12px] text-mutedink">운영 대시보드</div>
      )}
    </div>
  );
}

function AdminToggle() {
  const { admin, setAdmin } = useStore();
  return (
    <label className="flex cursor-pointer select-none items-center gap-2">
      <input
        type="checkbox"
        className="sr-only"
        checked={admin}
        onChange={(e) => setAdmin(e.target.checked)}
      />
      <span className="switch" aria-hidden />
      <span className="text-[12px] font-medium text-ink2">운영진 모드</span>
    </label>
  );
}

function ResetButton() {
  const { reset } = useStore();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("모든 데이터를 초기(데모) 상태로 되돌릴까요?")) {
          reset();
        }
      }}
      className="text-[12px] text-mutedink underline-offset-2 hover:text-ink2 hover:underline"
    >
      데이터 초기화
    </button>
  );
}

const linkBase =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors";

function navClass({ isActive }: { isActive: boolean }): string {
  return `${linkBase} ${
    isActive
      ? "bg-accent-soft/50 text-accent-strong"
      : "text-ink2 hover:bg-page hover:text-ink"
  }`;
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      {/* 데스크톱 사이드바 */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-hairline bg-surface lg:flex">
        <div className="px-5 pb-5 pt-6">
          <Brand />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navClass}
            >
              <Icon name={item.icon} className="shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="space-y-2.5 border-t border-hairline px-5 py-4">
          <AdminToggle />
          <ResetButton />
          <p className="text-[11px] leading-relaxed text-mutedink">
            데모 데이터 · 변경사항은 이 브라우저에만 저장됩니다
          </p>
        </div>
      </aside>

      {/* 모바일 헤더 + 탭 */}
      <header className="sticky top-0 z-20 border-b border-hairline bg-surface lg:hidden">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <Brand compact />
          <AdminToggle />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-ink2 hover:bg-page hover:text-ink"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
