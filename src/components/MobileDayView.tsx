"use client";

import { useRef } from "react";
import { findEntries } from "@/lib/store";
import {
  CATEGORY_BG,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  DAYS,
  dayNumber,
  formatHours,
  hexToBg,
  todayIndex,
  type CellEntry,
  type DayIndex,
  type Period,
  type TodoItem,
} from "@/lib/types";

type Props = {
  periods: Period[];
  entries: CellEntry[];
  day: DayIndex;
  onDayChange: (day: DayIndex) => void;
  onOpenJob: (periodId: string, day: DayIndex, entryId?: string) => void;
  onToggleTodo: (entryId: string, todoId: string) => void;
};

function visibleTodos(todos?: TodoItem[]): TodoItem[] {
  return (todos ?? []).filter((todo) => todo.text.trim());
}

export function DayStrip({
  day,
  onChange,
}: {
  day: DayIndex;
  onChange: (day: DayIndex) => void;
}) {
  const today = todayIndex();
  return (
    <div className="grid grid-cols-7 gap-1">
      {DAYS.map((item) => {
        const active = item.day === day;
        const isToday = item.day === today;
        return (
          <button
            key={item.day}
            type="button"
            onClick={() => onChange(item.day)}
            className={`ui-btn flex min-h-11 flex-col items-center justify-center rounded-cell text-[11px] font-semibold leading-none ${
              active
                ? "bg-ink text-paper-card"
                : isToday
                  ? "bg-hoc-bg text-hoc"
                  : "bg-paper-card text-ink-soft"
            }`}
          >
            <span>{item.short}</span>
            <span className={`mt-0.5 font-mono text-[10px] font-medium ${active ? "text-paper-card/75" : "text-ink-faint"}`}>
              {dayNumber(item.day)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function MobileDayView({
  periods,
  entries,
  day,
  onDayChange,
  onOpenJob,
  onToggleTodo,
}: Props) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const rows = [...periods].sort((a, b) => a.order - b.order);

  return (
    <div
      onTouchStart={(e) => {
        const t = e.changedTouches[0];
        if (!t) return;
        start.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const t = e.changedTouches[0];
        if (!t || !start.current) return;
        const dx = t.clientX - start.current.x;
        const dy = t.clientY - start.current.y;
        start.current = null;
        if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
        const next = (day + (dx < 0 ? 1 : -1) + 7) % 7;
        onDayChange(next as DayIndex);
      }}
    >
      <div className="flex flex-col gap-3">
        {rows.map((period) => {
          const jobs = findEntries(entries, period.id, day);
          const hours = formatHours(period.startTime, period.endTime);
          return (
            <section
              key={period.id}
              className="rounded-card border border-line/70 bg-paper-card p-3.5 shadow-card"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h3 className="type-label text-ink">{period.name}</h3>
                {hours ? (
                  <span className="font-mono text-[11px] font-medium text-ink-soft">
                    {hours}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-2">
                {jobs.map((entry) => (
                  <MobileJobCard
                    key={entry.id}
                    entry={entry}
                    onOpen={() => onOpenJob(period.id, day, entry.id)}
                    onToggleTodo={onToggleTodo}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => onOpenJob(period.id, day)}
                  className="ui-btn min-h-12 rounded-cell border border-dashed border-line text-[14px] font-medium text-ink-soft"
                >
                  + Thêm việc {period.name.toLowerCase()}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MobileJobCard({
  entry,
  onOpen,
  onToggleTodo,
}: {
  entry: CellEntry;
  onOpen: () => void;
  onToggleTodo: (entryId: string, todoId: string) => void;
}) {
  const accent = entry.color ?? CATEGORY_COLORS[entry.category];
  const bg =
    entry.color && entry.color !== CATEGORY_COLORS[entry.category]
      ? hexToBg(entry.color)
      : CATEGORY_BG[entry.category];
  const hours = formatHours(entry.startTime, entry.endTime);
  const todos = visibleTodos(entry.todos);
  const done = todos.filter((todo) => todo.done).length;

  return (
    <div
      className="rounded-cell px-3 py-3"
      style={{
        background: bg,
        boxShadow: `inset 4px 0 0 ${accent}`,
      }}
    >
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[16px] font-semibold leading-snug text-ink">
            {entry.title}
          </span>
          {entry.sticker ? (
            <span className="shrink-0 text-lg leading-none">{entry.sticker}</span>
          ) : null}
        </div>
        {hours ? (
          <div className="mt-0.5 font-mono text-[12px] font-medium text-ink-soft">
            {hours}
          </div>
        ) : null}
        {entry.note?.trim() ? (
          <p className="mt-1 whitespace-pre-wrap text-[14px] leading-snug text-ink-soft">
            {entry.note.trim()}
          </p>
        ) : null}
        <div className="mt-2 flex items-center gap-2">
          <div className="type-tag" style={{ color: accent }}>
            {CATEGORY_LABELS[entry.category]}
          </div>
          {todos.length > 0 ? (
            <span className="rounded-chip bg-paper-card/80 px-2 py-0.5 font-mono text-[11px] font-medium text-ink-soft">
              {done}/{todos.length}
            </span>
          ) : null}
        </div>
      </button>
      {todos.length > 0 ? (
        <ul className="mt-1.5 flex flex-col">
          {todos.map((todo) => (
            <li key={todo.id}>
              <label
                className={`flex min-h-11 items-center gap-3 text-[15px] leading-snug ${
                  todo.done ? "text-ink-faint line-through" : "text-ink"
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  className="h-5 w-5 shrink-0 accent-ink"
                  onChange={() => onToggleTodo(entry.id, todo.id)}
                />
                <span className="min-w-0 break-words">{todo.text.trim()}</span>
              </label>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
