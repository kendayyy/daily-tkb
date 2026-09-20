"use client";

import type { ReactNode } from "react";
import type { PhoneLayout } from "@/lib/types";

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
      <header className="sticky top-0 z-40 -mx-4 mb-3 border-b border-line bg-paper px-4 pb-3 pt-[calc(env(safe-area-inset-top)+10px)] landscape:mb-1 landscape:pb-2 landscape:pt-[max(6px,env(safe-area-inset-top))] md:static md:mx-0 md:mb-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="type-wordmark text-ink">Daily</span>
            <span className="type-label font-medium text-ink-soft">TKB</span>
          </div>
          <div
            className="flex rounded-chip border border-line bg-paper-card p-0.5 md:hidden"
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
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={onExport}
              className="type-btn rounded-chip border border-line bg-paper-card px-3 py-2 text-ink"
            >
              Xuất ảnh
            </button>
            <button
              type="button"
              onClick={onTheme}
              className="type-btn rounded-chip border border-line bg-paper-card px-3 py-2 text-ink"
            >
              Giao diện
            </button>
            <button
              type="button"
              onClick={onStickers}
              className={`type-btn rounded-chip border px-3 py-2 ${
                decorating
                  ? "border-ink bg-ink text-paper-card"
                  : "border-line bg-paper-card text-ink"
              }`}
            >
              Dán
            </button>
            <button
              type="button"
              onClick={onManage}
              className="type-btn rounded-chip bg-ink px-3 py-2 text-paper-card"
            >
              Quản lý tiết
            </button>
          </div>
        </div>
        {dayStrip ? <div className="mt-3 md:hidden">{dayStrip}</div> : null}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-paper-card pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] landscape:pb-[max(4px,env(safe-area-inset-bottom))] md:hidden">
        <NavBtn label="Xuất" onClick={onExport} />
        <NavBtn label="Giao diện" onClick={onTheme} />
        <NavBtn label="Tiết" onClick={onManage} strong />
      </nav>
    </>
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
      className={`min-h-10 min-w-[4.5rem] rounded-chip px-3 type-btn ${
        active ? "bg-ink text-paper-card" : "text-ink-soft"
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
}: {
  label: string;
  onClick?: () => void;
  strong?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 touch-manipulation type-btn landscape:min-h-10 ${
        strong ? "bg-ink text-paper-card" : "text-ink"
      }`}
    >
      {label}
    </button>
  );
}
