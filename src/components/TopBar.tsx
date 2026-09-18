"use client";

type Props = {
  onExport: () => void;
  onTheme: () => void;
  onStickers: () => void;
  onManage: () => void;
  decorating?: boolean;
};

export function TopBar({
  onExport,
  onTheme,
  onStickers,
  onManage,
  decorating,
}: Props) {
  return (
    <>
      <header className="sticky top-0 z-40 -mx-4 mb-3 border-b border-line bg-paper px-4 pb-3 pt-[calc(env(safe-area-inset-top)+10px)] landscape:mb-1 landscape:pb-1 landscape:pt-[max(6px,env(safe-area-inset-top))] md:static md:mx-0 md:mb-0 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="type-wordmark text-ink">Daily</span>
            <span className="type-label font-medium text-ink-soft">TKB</span>
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
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-paper-card pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] landscape:pb-[max(4px,env(safe-area-inset-bottom))] md:hidden">
        <NavBtn label="Xuất" onClick={onExport} />
        <NavBtn label="Giao diện" onClick={onTheme} />
        <NavBtn label="Dán" onClick={onStickers} active={decorating} />
        <NavBtn label="Tiết" onClick={onManage} strong />
      </nav>
    </>
  );
}

function NavBtn({
  label,
  onClick,
  active,
  strong,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  strong?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 type-btn landscape:min-h-10 ${
        strong
          ? "bg-ink text-paper-card"
          : active
            ? "text-hoc"
            : "text-ink"
      }`}
    >
      {label}
    </button>
  );
}
