"use client";

import { CellEmpty } from "@/components/CellEmpty";
import { CellJobs } from "@/components/CellFilled";
import { findEntries } from "@/lib/store";
import {
  DAYS,
  dayNumber,
  formatHours,
  todayIndex,
  type CellEntry,
  type DayIndex,
  type Period,
} from "@/lib/types";

type Selection = { periodId: string; day: DayIndex; entryId?: string } | null;

type Props = {
  periods: Period[];
  entries: CellEntry[];
  selected?: Selection;
  onOpenJob?: (periodId: string, day: DayIndex, entryId?: string) => void;
  onToggleTodo?: (entryId: string, todoId: string) => void;
  exportMode?: boolean;
  compact?: boolean;
};

export function WeekGrid({
  periods,
  entries,
  selected,
  onOpenJob,
  onToggleTodo,
  exportMode,
  compact,
}: Props) {
  const rows = [...periods].sort((a, b) => a.order - b.order);
  const today = todayIndex();

  return (
    <div
      className={
        exportMode
          ? "overflow-visible rounded-card border border-line bg-paper-card p-5"
          : compact
            ? "overflow-x-auto overscroll-x-contain rounded-card border border-line/80 bg-paper-card p-3 shadow-card [-webkit-overflow-scrolling:touch]"
            : "overflow-visible rounded-card border border-line/80 bg-paper-card p-3 shadow-card md:p-5"
      }
    >
      <table
        className={
          exportMode
            ? "w-full table-fixed border-separate border-spacing-1.5"
            : compact
              ? "w-full min-w-[640px] table-fixed border-separate border-spacing-1 md:min-w-0"
              : "w-full table-fixed border-separate border-spacing-1.5"
        }
      >
        <thead>
          <tr>
            <th
              className={`w-[72px] min-w-[72px] rounded-cell bg-line-soft px-2 py-2 text-left text-[12px] font-semibold text-ink-soft md:w-[104px] md:min-w-[104px] md:px-2.5 md:py-2.5 md:text-[13px] ${
                exportMode || !compact ? "" : "sticky left-0 z-10"
              }`}
            >
              Buổi
            </th>
            {DAYS.map((d) => (
              <th
                key={d.day}
                className={`rounded-cell px-1 py-2 text-center font-semibold md:px-2 md:py-2.5 ${
                  d.day === today
                    ? "bg-hoc-bg text-hoc"
                    : "bg-line-soft text-ink-soft"
                }`}
              >
                <div className="text-[11px] md:text-[13px]">
                  {compact ? d.short : d.label}
                </div>
                <div className="mt-0.5 font-mono text-[10px] font-medium opacity-80">
                  {dayNumber(d.day)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((period) => (
            <tr key={period.id}>
              <th
                className={`rounded-cell bg-paper-card px-2 py-2 text-left type-label font-semibold text-ink md:px-2.5 md:py-2.5 ${
                  exportMode || !compact ? "" : "sticky left-0 z-10"
                }`}
              >
                <div>{period.name}</div>
                {formatHours(period.startTime, period.endTime) ? (
                  <div className="mt-1 font-mono text-[10px] font-medium leading-tight text-ink-soft">
                    {formatHours(period.startTime, period.endTime)}
                  </div>
                ) : null}
              </th>
              {DAYS.map((d) => {
                const jobs = findEntries(entries, period.id, d.day);
                const isSelected =
                  selected?.periodId === period.id && selected.day === d.day;
                const isToday = d.day === today;
                return (
                  <td
                    key={`${period.id}-${d.day}`}
                    className={`relative z-0 rounded-cell border p-0 align-top ${
                      isToday
                        ? "border-hoc/25 bg-hoc-bg/40"
                        : "border-line-soft bg-paper-card"
                    }`}
                  >
                    {jobs.length > 0 ? (
                      <CellJobs
                        jobs={jobs}
                        selectedId={isSelected ? selected?.entryId : undefined}
                        staticRender={exportMode}
                        onOpenJob={(id) => onOpenJob?.(period.id, d.day, id)}
                        onToggleTodo={onToggleTodo}
                        onAdd={() => onOpenJob?.(period.id, d.day)}
                      />
                    ) : exportMode ? (
                      <div className="min-h-[72px]" />
                    ) : (
                      <CellEmpty
                        selected={isSelected && !selected?.entryId}
                        label={`Thêm việc ${period.name} ${d.label}`}
                        onClick={() => onOpenJob?.(period.id, d.day)}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
