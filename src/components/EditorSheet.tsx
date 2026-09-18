"use client";

import { useState } from "react";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CELL_STICKERS,
  COLOR_SWATCHES,
  type Category,
  type CellEntry,
  type DayIndex,
} from "@/lib/types";

type Props = {
  periodId: string;
  day: DayIndex;
  existing?: CellEntry;
  onClose: () => void;
  onSave: (data: {
    title: string;
    category: Category;
    color?: string;
    note?: string;
    startTime?: string;
    endTime?: string;
    sticker?: string;
  }) => void;
  onDelete?: () => void;
};

export function EditorSheet({
  existing,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState<Category>(existing?.category ?? "hoc");
  const [color, setColor] = useState(
    existing?.color ?? CATEGORY_COLORS[existing?.category ?? "hoc"],
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [startTime, setStartTime] = useState(existing?.startTime ?? "");
  const [endTime, setEndTime] = useState(existing?.endTime ?? "");
  const [sticker, setSticker] = useState(existing?.sticker ?? "");
  const [error, setError] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 p-0 max-md:landscape:items-stretch max-md:landscape:justify-end md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="editor-title"
        className="max-h-[90dvh] w-full max-w-[480px] overflow-y-auto rounded-t-card bg-paper-card p-5 shadow-sheet max-md:landscape:h-full max-md:landscape:max-h-none max-md:landscape:w-[min(420px,85vw)] max-md:landscape:rounded-none md:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="editor-title" className="type-panel mb-4">
          {existing ? "Sửa việc" : "Thêm việc"}
        </h2>
        <label className="mb-4 flex flex-col gap-1.5 type-note text-ink-soft">
          Tiêu đề
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Soli, DNC, Toán"
            className="type-cell rounded-cell border border-line px-3 py-2.5 text-ink outline-none focus:border-ink"
          />
          {error ? <span className="text-danger">{error}</span> : null}
        </label>

        <p className="mb-2 type-note text-ink-soft">Loại</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setColor(CATEGORY_COLORS[item]);
                }}
                className={`type-btn inline-flex items-center gap-1.5 rounded-chip border px-3 py-1.5 ${
                  active
                    ? "border-ink bg-ink text-paper-card"
                    : "border-line bg-paper-card text-ink"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: CATEGORY_COLORS[item] }}
                />
                {CATEGORY_LABELS[item]}
              </button>
            );
          })}
        </div>

        <p className="mb-2 type-note text-ink-soft">Màu</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={hex}
              onClick={() => setColor(hex)}
              className={`h-7 w-7 rounded-full border-2 ${
                color.toLowerCase() === hex.toLowerCase()
                  ? "border-ink"
                  : "border-transparent"
              }`}
              style={{ background: hex }}
            />
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 type-note text-ink-soft">
            Bắt đầu
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-cell border border-line px-3 py-2 text-ink"
            />
          </label>
          <label className="flex flex-col gap-1.5 type-note text-ink-soft">
            Kết thúc
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-cell border border-line px-3 py-2 text-ink"
            />
          </label>
        </div>

        <p className="mb-2 type-note text-ink-soft">Sticker ô</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSticker("")}
            className={`h-9 w-9 rounded-cell border type-note ${
              !sticker ? "border-ink" : "border-line"
            }`}
          >
            —
          </button>
          {CELL_STICKERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSticker(item)}
              className={`h-9 w-9 rounded-cell border text-lg ${
                sticker === item ? "border-ink" : "border-line"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="mb-5 flex flex-col gap-1.5 type-note text-ink-soft">
          Ghi chú
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Không bắt buộc"
            className="resize-none rounded-cell border border-line px-3 py-2.5 text-[13px] text-ink outline-none focus:border-ink"
          />
        </label>

        <div className="flex items-center gap-2">
          {existing && onDelete ? (
            <button
              type="button"
              className="type-btn rounded-chip border border-[#E8C4B8] px-3 py-2 text-danger"
              onClick={() => {
                if (window.confirm("Xóa ô này?")) onDelete();
              }}
            >
              Xóa
            </button>
          ) : (
            <span className="flex-1" />
          )}
          <span className="flex-1" />
          <button
            type="button"
            className="type-btn rounded-chip border border-line px-3 py-2"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="type-btn rounded-chip bg-ink px-3 py-2 text-paper-card"
            onClick={() => {
              if (!title.trim()) {
                setError("Nhập tiêu đề trước khi lưu.");
                return;
              }
              onSave({
                title: title.trim(),
                category,
                color:
                  color !== CATEGORY_COLORS[category] ? color : undefined,
                note: note.trim() || undefined,
                startTime: startTime || undefined,
                endTime: endTime || undefined,
                sticker: sticker || undefined,
              });
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
