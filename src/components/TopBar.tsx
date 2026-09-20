"use client";

import type { ReactNode } from "react";
import { weekRangeLabel, type PhoneLayout } from "@/lib/types";

type Props = {
  onExport: () => void;
  onTheme: () => void;
  onStickers: () => void;
  onManage: () => void;
  decorating?: boolean;
  phoneLayout: PhoneLayout;
  onPhoneLayout: (layout: PhoneLayout) => void;
  dayStrip?: ReactNode;
};

export function TopBar({
  onExport,
  onTheme,
  onStickers,
  onManage,
  decorating,
  phoneLayout,
  onPhoneLayout,
  dayStrip,
}: Props) {
  return (
    <>
      <header className="sticky top-0 z-40 -mx-4 mb-2 border-b border-line/80 bg-paper px-4 pb-2.5 pt-[calc(env(safe-area-inset-top)+8px)] landscape:mb-1 landscape:pb-1.5 landscape:pt-[max(6px,env(safe-area-inset-top))] md:static md:mx-0 md:mb-5 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-[11px] font-extrabold tracking-tight text-paper-card md:h-8 md:w-8 md:rounded-[10px] md:text-[12px]">
              D
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="type-wordmark text-ink">Daily</span>
                <span className="type-label font-medium text-ink-soft">TKB</span>
              </div>
              <p className="hidden font-mono text-[11px] text-ink-faint md:block">
                {weekRangeLabel()}
              </p>
            </div>
          </div>
          <div
            className="flex shrink-0 rounded-chip border border-line bg-paper-card p-0.5 md:hidden"
            role="group"
            aria-label="Kiểu xem"
          >
            <LayoutBtn
              label="Dọc"
              active={phoneLayout === "doc"}
              onClick={() => onPhoneLayout("doc")}
            />
            <LayoutBtn
              label="Ngang"
              active={phoneLayout === "ngang"}
              onClick={() => onPhoneLayout("ngang")}
            />
          </div>
          <div className="hidden flex-wrap items-center justify-end gap-2 md:flex">
            <GhostBtn onClick={onExport}>Xuất ảnh</GhostBtn>
            <GhostBtn onClick={onTheme}>Giao diện</GhostBtn>
            <GhostBtn onClick={onStickers} active={decorating}>
              Dán
            </GhostBtn>
            <button
              type="button"
              onClick={onManage}
              className="ui-btn type-btn rounded-chip bg-ink px-3.5 py-2 text-paper-card shadow-float"
            >
              Quản lý tiết
            </button>
          </div>
        </div>
        {dayStrip ? <div className="mt-2 md:hidden">{dayStrip}</div> : null}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-paper-card pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] landscape:pb-[max(4px,env(safe-area-inset-bottom))] md:hidden">
        <NavBtn label="Xuất" onClick={onExport} icon="export" />
        <NavBtn label="Giao diện" onClick={onTheme} icon="theme" />
        <NavBtn label="Tiết" onClick={onManage} icon="slots" strong />
      </nav>
    </>
  );
}

function GhostBtn({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ui-btn type-btn rounded-chip border px-3.5 py-2 ${
        active
          ? "border-ink bg-ink text-paper-card"
          : "border-line bg-paper-card text-ink hover:bg-line-soft"
      }`}
    >
      {children}
    </button>
  );
}

function LayoutBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`ui-btn min-h-8 min-w-[3.75rem] rounded-chip px-2.5 text-[12px] font-semibold ${
        active ? "bg-ink text-paper-card shadow-float" : "text-ink-soft"
      }`}
    >
      {label}
    </button>
  );
}

function NavBtn({
  label,
  onClick,
  strong,
  icon,
}: {
  label: string;
  onClick?: () => void;
  strong?: boolean;
  icon: "export" | "theme" | "slots";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ui-btn flex min-h-12 flex-col items-center justify-center gap-0.5 landscape:min-h-9 ${
        strong ? "text-ink" : "text-ink-soft"
      }`}
    >
      <NavIcon name={icon} />
      <span className="text-[11px] font-semibold">{label}</span>
    </button>
  );
}

function NavIcon({ name }: { name: "export" | "theme" | "slots" }) {
  const common = "h-[18px] w-[18px]";
  if (name === "export") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v12M8 7l4-4 4 4M5 21h14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "theme") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3a9 9 0 1 0 9 9c0-1.2-.9-1.6-1.6-.7A4.2 4.2 0 0 1 12 8.5V3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
