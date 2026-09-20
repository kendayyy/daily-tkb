"use client";

import { applyTheme, THEME_LABELS, THEME_PRESETS, type Theme } from "@/lib/types";

type Props = {
  theme: Theme;
  onChange: (theme: Theme) => void;
  onClose: () => void;
};

export function ThemePanel({ theme, onChange, onClose }: Props) {
  return (
    <div
      className="sheet-overlay fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        className="w-full max-w-[480px] rounded-t-card border border-line/60 bg-paper-card p-5 shadow-sheet md:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="type-panel mb-4">Giao diện</h2>
        <p className="mb-3 type-note text-ink-soft">Theme có sẵn</p>
        <div className="mb-5 grid grid-cols-2 gap-2">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onChange(preset);
                applyTheme(preset);
              }}
              className={`ui-btn rounded-cell border px-3 py-3 text-left type-btn ${
                theme.id === preset.id ? "border-ink shadow-float" : "border-line"
              }`}
              style={{ background: preset.paper, color: preset.ink }}
            >
              {THEME_LABELS[preset.id] ?? preset.id}
            </button>
          ))}
        </div>
        <p className="mb-3 type-note text-ink-soft">Tùy chỉnh màu</p>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["paper", "Nền trang", "paper"],
              ["paperCard", "Nền thẻ", "paperCard"],
              ["ink", "Chữ", "ink"],
              ["line", "Viền", "line"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 type-note">
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => {
                  const next = {
                    ...theme,
                    id: "custom",
                    [key]: e.target.value,
                  };
                  onChange(next);
                  applyTheme(next);
                }}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="type-btn rounded-chip border border-line px-3 py-2"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
