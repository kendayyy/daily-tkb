"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CELL_STICKERS,
  COLOR_SWATCHES,
  type Category,
  type CellEntry,
  type DayIndex,
  type TodoItem,
} from "@/lib/types";

type SaveData = {
  title: string;
  category: Category;
  color?: string;
  note?: string;
  todos: TodoItem[];
  startTime?: string;
  endTime?: string;
  sticker?: string;
};

type LivePatch = Partial<Pick<SaveData, "note" | "todos">>;

type Props = {
  periodId: string;
  day: DayIndex;
  existing?: CellEntry;
  onClose: () => void;
  onSave: (data: SaveData) => void;
  onLiveUpdate?: (patch: LivePatch) => void;
  onDelete?: () => void;
};

const fieldClass =
  "min-h-12 w-full rounded-cell border border-line px-3 text-[16px] text-ink outline-none focus:border-ink md:min-h-0 md:py-2.5 md:text-[13.5px]";

export function EditorSheet({
  existing,
  onClose,
  onSave,
  onLiveUpdate,
  onDelete,
}: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [category, setCategory] = useState<Category>(existing?.category ?? "hoc");
  const [color, setColor] = useState(
    existing?.color ?? CATEGORY_COLORS[existing?.category ?? "hoc"],
  );
  const [note, setNote] = useState(existing?.note ?? "");
  const [todos, setTodos] = useState<TodoItem[]>(existing?.todos ?? []);
  const [draftTodo, setDraftTodo] = useState("");
  const [startTime, setStartTime] = useState(existing?.startTime ?? "");
  const [endTime, setEndTime] = useState(existing?.endTime ?? "");
  const [sticker, setSticker] = useState(existing?.sticker ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      titleRef.current?.focus();
    }
  }, []);

  const live = (patch: LivePatch) => onLiveUpdate?.(patch);

  const setNoteLive = (value: string) => {
    setNote(value);
    live({ note: value });
  };

  const setTodosLive = (next: TodoItem[]) => {
    setTodos(next);
    live({ todos: next });
  };

  const addTodo = () => {
    const text = draftTodo.trim();
    if (!text) return;
    setDraftTodo("");
    setTodosLive([
      ...todos,
      { id: crypto.randomUUID(), text, done: false },
    ]);
  };

  const save = () => {
    if (!title.trim()) {
      setError("Nhập tiêu đề trước khi lưu.");
      return;
    }
    onSave({
      title: title.trim(),
      category,
      color: color !== CATEGORY_COLORS[category] ? color : undefined,
      note: note.trim() || undefined,
      todos: todos
        .map((item) => ({ ...item, text: item.text.trim() }))
        .filter((item) => item.text),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      sticker: sticker || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 p-0 max-md:landscape:items-stretch max-md:landscape:justify-end md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="editor-title"
        className="flex max-h-[92dvh] w-full max-w-[480px] flex-col rounded-t-card bg-paper-card shadow-sheet max-md:landscape:h-full max-md:landscape:max-h-none max-md:landscape:w-[min(420px,85vw)] max-md:landscape:rounded-none md:max-h-[90dvh] md:rounded-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-5 pt-3 md:pt-5">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line md:hidden" />
          <h2 id="editor-title" className="type-panel">
            {existing ? "Sửa việc" : "Thêm việc"}
          </h2>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          <label className="mb-4 flex flex-col gap-1.5 type-note text-ink-soft">
            Tiêu đề
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Soli, DNC, Toán"
              enterKeyHint="done"
              className={`${fieldClass} type-cell`}
            />
            {error ? <span className="text-danger">{error}</span> : null}
          </label>

          <p className="mb-2 type-note text-ink-soft">Loại</p>
          <div className="mb-4 grid grid-cols-4 gap-2">
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
                  className={`type-btn inline-flex min-h-11 items-center justify-center gap-1.5 rounded-chip border px-2 ${
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
                className={`h-10 w-10 rounded-full border-2 md:h-7 md:w-7 ${
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
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 type-note text-ink-soft">
              Kết thúc
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          <p className="mb-2 type-note text-ink-soft">Sticker ô</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSticker("")}
              className={`h-11 w-11 rounded-cell border type-note md:h-9 md:w-9 ${
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
                className={`h-11 w-11 rounded-cell border text-lg md:h-9 md:w-9 ${
                  sticker === item ? "border-ink" : "border-line"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="mb-4 flex flex-col gap-1.5 type-note text-ink-soft">
            Ghi chú
            <textarea
              value={note}
              onChange={(e) => setNoteLive(e.target.value)}
              rows={3}
              placeholder="Hiện ngay trên thẻ việc"
              className="resize-none rounded-cell border border-line px-3 py-3 text-[16px] text-ink outline-none focus:border-ink md:py-2.5 md:text-[13px]"
            />
          </label>

          <div>
            <p className="mb-2 type-note text-ink-soft">Việc cần làm</p>
            <ul className="mb-2 flex flex-col gap-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex min-h-12 items-center gap-2 rounded-cell border border-line px-2"
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    aria-label={todo.text}
                    className="h-5 w-5 shrink-0 accent-ink"
                    onChange={() =>
                      setTodosLive(
                        todos.map((item) =>
                          item.id === todo.id
                            ? { ...item, done: !item.done }
                            : item,
                        ),
                      )
                    }
                  />
                  <input
                    value={todo.text}
                    onChange={(e) =>
                      setTodosLive(
                        todos.map((item) =>
                          item.id === todo.id
                            ? { ...item, text: e.target.value }
                            : item,
                        ),
                      )
                    }
                    className={`min-h-11 min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none md:text-[13px] ${
                      todo.done ? "text-ink-faint line-through" : ""
                    }`}
                  />
                  <button
                    type="button"
                    aria-label="Xóa việc nhỏ"
                    className="flex h-11 w-11 shrink-0 items-center justify-center type-note text-ink-faint"
                    onClick={() =>
                      setTodosLive(todos.filter((item) => item.id !== todo.id))
                    }
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input
                value={draftTodo}
                onChange={(e) => setDraftTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTodo();
                  }
                }}
                placeholder="Thêm việc nhỏ"
                enterKeyHint="done"
                className={fieldClass}
              />
              <button
                type="button"
                className="type-btn min-h-12 shrink-0 rounded-chip border border-line px-4"
                onClick={addTodo}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-line bg-paper-card px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          {existing && onDelete ? (
            <button
              type="button"
              className="type-btn min-h-11 rounded-chip border border-[#E8C4B8] px-3 text-danger"
              onClick={() => {
                if (window.confirm("Xóa ô này?")) onDelete();
              }}
            >
              Xóa
            </button>
          ) : null}
          <span className="flex-1" />
          <button
            type="button"
            className="type-btn min-h-11 rounded-chip border border-line px-4"
            onClick={onClose}
          >
            {existing ? "Đóng" : "Hủy"}
          </button>
          <button
            type="button"
            className="type-btn min-h-11 rounded-chip bg-ink px-5 text-paper-card"
            onClick={save}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
