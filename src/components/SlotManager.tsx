"use client";

import { useState } from "react";
import type { CellEntry, Period } from "@/lib/types";

type Props = {
  periods: Period[];
  entries: CellEntry[];
  onClose: () => void;
  onAdd: () => void;
  onRename: (id: string, name: string) => void;
  onTime: (id: string, startTime: string, endTime: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onDelete: (id: string) => void;
};

export function SlotManager({
  periods,
  entries,
  onClose,
  onAdd,
  onRename,
  onTime,
  onMove,
  onDelete,
}: Props) {
  const rows = [...periods].sort((a, b) => a.order - b.order);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 max-md:landscape:items-stretch max-md:landscape:justify-end md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="slots-title"
        className="h-[min(92vh,720px)] w-full max-w-[480px] overflow-auto rounded-t-card bg-paper-card p-5 shadow-sheet max-md:landscape:h-full max-md:landscape:max-h-none max-md:landscape:w-[min(420px,85vw)] max-md:landscape:rounded-none md:h-auto md:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="slots-title" className="type-panel mb-4">
          Quản lý tiết
        </h2>
        <ul className="flex flex-col gap-2">
          {rows.map((period, index) => {
            const value = drafts[period.id] ?? period.name;
            return (
              <li
                key={period.id}
                className="flex flex-col gap-2 rounded-cell border border-line-soft px-2 py-2"
              >
                <div className="flex items-center gap-2">
                <span className="w-6 font-mono text-[12px] font-medium text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <input
                  value={value}
                  aria-label="Tên tiết"
                  onChange={(e) =>
                    setDrafts((d) => ({ ...d, [period.id]: e.target.value }))
                  }
                  onBlur={() => {
                    const name = value.trim();
                    if (name) onRename(period.id, name);
                  }}
                  className="min-w-0 flex-1 rounded-cell border border-transparent px-2 py-1.5 type-label outline-none focus:border-line"
                />
                <button
                  type="button"
                  disabled={index === 0}
                  className="type-btn h-8 w-8 rounded-cell border border-line disabled:opacity-30"
                  onClick={() => onMove(period.id, -1)}
                  aria-label="Lên"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === rows.length - 1}
                  className="type-btn h-8 w-8 rounded-cell border border-line disabled:opacity-30"
                  onClick={() => onMove(period.id, 1)}
                  aria-label="Xuống"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="type-btn h-8 w-8 rounded-cell text-danger"
                  aria-label="Xóa"
                  onClick={() => {
                    const used = entries.some((e) => e.periodId === period.id);
                    if (
                      window.confirm(
                        used
                          ? `Xóa “${period.name}”? Các ô thuộc buổi này cũng sẽ mất.`
                          : `Xóa “${period.name}”?`,
                      )
                    ) {
                      onDelete(period.id);
                    }
                  }}
                >
                  ✕
                </button>
                </div>
                <div className="flex items-center gap-2 pl-8">
                  <input
                    type="time"
                    aria-label="Giờ bắt đầu"
                    value={period.startTime ?? ""}
                    onChange={(e) =>
                      onTime(period.id, e.target.value, period.endTime ?? "")
                    }
                    className="rounded-cell border border-line px-2 py-1 font-mono text-[12px]"
                  />
                  <span className="text-ink-faint">–</span>
                  <input
                    type="time"
                    aria-label="Giờ kết thúc"
                    value={period.endTime ?? ""}
                    onChange={(e) =>
                      onTime(period.id, period.startTime ?? "", e.target.value)
                    }
                    className="rounded-cell border border-line px-2 py-1 font-mono text-[12px]"
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={onAdd}
          className="mt-4 w-full rounded-cell border border-dashed border-line py-3 type-btn text-ink-soft hover:bg-[#F7F5EF]"
        >
          + Thêm buổi mới
        </button>
        <div className="mt-4 flex justify-end">
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
