"use client";

import { CellEmpty } from "@/components/CellEmpty";
import { CellJobs } from "@/components/CellFilled";
import { findEntries } from "@/lib/store";
import {
  DAYS,
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
  exportMode?: boolean;
};

export function WeekGrid({
  periods,
  entries,
  selected,
  onOpenJob,
  exportMode,
}: Props) {
  const rows = [...periods].sort((a, b) => a.order - b.order);
  const today = todayIndex();

  return (
    <div
      className={
        exportMode
          ? "overflow-visible rounded-card bg-paper-card p-5"
          : "overflow-x-auto overscroll-x-contain rounded-card bg-paper-card p-3 landscape:p-2 md:p-5"
      }
    >
      <table
        className={
          exportMode
            ? "w-full table-fixed border-separate border-spacing-1"
            : "w-full min-w-[920px] border-separate border-spacing-1 landscape:min-w-[840px]"
        }
      >
        <thead>
          <tr>
            <th
              className={`w-[96px] min-w-[96px] bg-[#F7F5EE] px-2 py-2 text-left type-label font-semibold text-ink-soft landscape:w-[84px] landscape:py-1.5 ${
                exportMode ? "" : "sticky left-0 z-10"
              }`}
            >
              Buổi
            </th>
            {DAYS.map((d) => (
              <th
                key={d.day}
                className={`px-2 py-2 text-center type-label font-semibold landscape:py-1.5 ${
                  d.day === today
                    ? "bg-hoc-bg text-hoc"
                    : "bg-[#F7F5EE] text-ink-soft"
                }`}
              >
                {d.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((period) => (
            <tr key={period.id}>
              <th
                className={`bg-paper-card px-2 py-2 text-left type-label font-semibold text-ink landscape:py-1 ${
                  exportMode ? "" : "sticky left-0 z-10"
                }`}
              >
                <div>{period.name}</div>
                {formatHours(period.startTime, period.endTime) ? (
                  <div className="mt-1 font-mono text-[10px] font-medium text-ink-soft">
                    {formatHours(period.startTime, period.endTime)}
                  </div>
                ) : null}
              </th>
              {DAYS.map((d) => {
                const jobs = findEntries(entries, period.id, d.day);
                const isSelected =
                  selected?.periodId === period.id && selected.day === d.day;
                return (
                  <td
                    key={`${period.id}-${d.day}`}
                    className="relative z-0 min-w-[118px] border border-line-soft bg-paper-card p-0 align-top"
                  >
                    {jobs.length > 0 ? (
                      <CellJobs
                        jobs={jobs}
                        selectedId={isSelected ? selected?.entryId : undefined}
                        staticRender={exportMode}
                        onOpenJob={(id) => onOpenJob?.(period.id, d.day, id)}
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
