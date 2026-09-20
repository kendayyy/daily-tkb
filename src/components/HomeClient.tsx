"use client";

import { useEffect, useState } from "react";
import { EditorSheet } from "@/components/EditorSheet";
import { ExportPreview } from "@/components/ExportPreview";
import { DayStrip, MobileDayView } from "@/components/MobileDayView";
import { SlotManager } from "@/components/SlotManager";
import { StickerBoard } from "@/components/StickerBoard";
import { ThemePanel } from "@/components/ThemePanel";
import { TopBar } from "@/components/TopBar";
import { WeekGrid } from "@/components/WeekGrid";
import { useTkbStore } from "@/lib/store";
import { applyTheme, todayIndex, type DayIndex } from "@/lib/types";

export function HomeClient() {
  const periods = useTkbStore((s) => s.periods);
  const entries = useTkbStore((s) => s.entries);
  const theme = useTkbStore((s) => s.theme);
  const boardStickers = useTkbStore((s) => s.boardStickers);
  const upsertEntry = useTkbStore((s) => s.upsertEntry);
  const patchEntry = useTkbStore((s) => s.patchEntry);
  const toggleTodo = useTkbStore((s) => s.toggleTodo);
  const deleteEntry = useTkbStore((s) => s.deleteEntry);
  const addPeriod = useTkbStore((s) => s.addPeriod);
  const renamePeriod = useTkbStore((s) => s.renamePeriod);
  const updatePeriodTime = useTkbStore((s) => s.updatePeriodTime);
  const movePeriod = useTkbStore((s) => s.movePeriod);
  const deletePeriod = useTkbStore((s) => s.deletePeriod);
  const setTheme = useTkbStore((s) => s.setTheme);
  const phoneLayout = useTkbStore((s) => s.phoneLayout);
  const setPhoneLayout = useTkbStore((s) => s.setPhoneLayout);
  const addBoardSticker = useTkbStore((s) => s.addBoardSticker);
  const moveBoardSticker = useTkbStore((s) => s.moveBoardSticker);
  const removeBoardSticker = useTkbStore((s) => s.removeBoardSticker);

  const [ready, setReady] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [decorate, setDecorate] = useState(false);
  const [viewDay, setViewDay] = useState<DayIndex>(todayIndex);
  const [selected, setSelected] = useState<{
    periodId: string;
    day: DayIndex;
    entryId?: string;
  } | null>(null);

  useEffect(() => {
    const finish = () => {
      applyTheme(useTkbStore.getState().theme);
      setReady(true);
    };
    const unsub = useTkbStore.persist.onFinishHydration(finish);
    void useTkbStore.persist.rehydrate();
    if (useTkbStore.persist.hasHydrated()) finish();
    return unsub;
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-8">
        <div className="h-16" />
        <div className="h-64 animate-pulse rounded-card bg-paper-card" />
      </div>
    );
  }

  const existing = selected?.entryId
    ? entries.find((e) => e.id === selected.entryId)
    : undefined;

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-0 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] landscape:pb-[calc(3.25rem+env(safe-area-inset-bottom))] md:px-8 md:pb-7 md:pt-7">
      <TopBar
        decorating={decorate}
        phoneLayout={phoneLayout}
        onExport={() => setExportOpen(true)}
        onTheme={() => setThemeOpen(true)}
        onStickers={() => setDecorate((v) => !v)}
        onPhoneLayout={setPhoneLayout}
        onManage={() => setSlotsOpen(true)}
        dayStrip={
          phoneLayout === "ngang" ? null : (
            <DayStrip day={viewDay} onChange={setViewDay} />
          )
        }
      />

      {entries.length === 0 ? (
        <div className="mb-4 mt-2">
          <p className="type-panel">Thời khóa biểu của bạn còn trống</p>
          <p className="mt-1 type-note text-ink-soft">
            Bấm Thêm việc để thêm buổi học, ca làm hoặc việc nhà.
          </p>
        </div>
      ) : (
        <div className="h-3 md:h-4" />
      )}

      <div className={phoneLayout === "ngang" ? "hidden" : "md:hidden"}>
        <MobileDayView
          periods={periods}
          entries={entries}
          day={viewDay}
          onDayChange={setViewDay}
          onOpenJob={(periodId, day, entryId) =>
            setSelected({ periodId, day, entryId })
          }
          onToggleTodo={toggleTodo}
        />
      </div>

      <div className={phoneLayout === "ngang" ? "block" : "hidden md:block"}>
        {phoneLayout === "ngang" ? (
          <p className="mb-2 type-note text-ink-soft md:hidden">
            Vuốt ngang để xem đủ Thứ 2–CN.
          </p>
        ) : null}
        <StickerBoard
          stickers={boardStickers}
          decorate={decorate}
          onAdd={addBoardSticker}
          onMove={moveBoardSticker}
          onRemove={removeBoardSticker}
        >
          <WeekGrid
            periods={periods}
            entries={entries}
            selected={selected}
            compact={phoneLayout === "ngang"}
            onOpenJob={(periodId, day, entryId) => {
              setViewDay(day);
              setSelected({ periodId, day, entryId });
            }}
            onToggleTodo={toggleTodo}
          />
        </StickerBoard>
      </div>

      {selected ? (
        <EditorSheet
          key={`${selected.periodId}-${selected.day}-${existing?.id ?? "new"}`}
          periodId={selected.periodId}
          day={selected.day}
          existing={existing}
          onClose={() => setSelected(null)}
          onSave={(data) => {
            upsertEntry({
              id: existing?.id,
              periodId: selected.periodId,
              day: selected.day,
              ...data,
            });
            setSelected(null);
          }}
          onLiveUpdate={
            existing
              ? (patch) => {
                  const next: {
                    note?: string;
                    todos?: typeof existing.todos;
                  } = {};
                  if (patch.note !== undefined) {
                    next.note = patch.note.trim() ? patch.note : undefined;
                  }
                  if (patch.todos !== undefined) next.todos = patch.todos;
                  patchEntry(existing.id, next);
                }
              : undefined
          }
          onDelete={
            existing
              ? () => {
                  deleteEntry(existing.id);
                  setSelected(null);
                }
              : undefined
          }
        />
      ) : null}

      {slotsOpen ? (
        <SlotManager
          periods={periods}
          entries={entries}
          onClose={() => setSlotsOpen(false)}
          onAdd={() => addPeriod()}
          onRename={renamePeriod}
          onTime={updatePeriodTime}
          onMove={movePeriod}
          onDelete={deletePeriod}
        />
      ) : null}

      {themeOpen ? (
        <ThemePanel
          theme={theme}
          onChange={setTheme}
          onClose={() => setThemeOpen(false)}
        />
      ) : null}

      {exportOpen ? (
        <ExportPreview
          periods={periods}
          entries={entries}
          stickers={boardStickers}
          paperCard={theme.paperCard}
          onClose={() => setExportOpen(false)}
        />
      ) : null}
    </div>
  );
}
