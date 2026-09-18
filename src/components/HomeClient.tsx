"use client";

import { useEffect, useState } from "react";
import { EditorSheet } from "@/components/EditorSheet";
import { ExportPreview } from "@/components/ExportPreview";
import { SlotManager } from "@/components/SlotManager";
import { StickerBoard } from "@/components/StickerBoard";
import { ThemePanel } from "@/components/ThemePanel";
import { TopBar } from "@/components/TopBar";
import { WeekGrid } from "@/components/WeekGrid";
import { useTkbStore } from "@/lib/store";
import { applyTheme, type DayIndex } from "@/lib/types";

export function HomeClient() {
  const periods = useTkbStore((s) => s.periods);
  const entries = useTkbStore((s) => s.entries);
  const theme = useTkbStore((s) => s.theme);
  const boardStickers = useTkbStore((s) => s.boardStickers);
  const upsertEntry = useTkbStore((s) => s.upsertEntry);
  const deleteEntry = useTkbStore((s) => s.deleteEntry);
  const addPeriod = useTkbStore((s) => s.addPeriod);
  const renamePeriod = useTkbStore((s) => s.renamePeriod);
  const updatePeriodTime = useTkbStore((s) => s.updatePeriodTime);
  const movePeriod = useTkbStore((s) => s.movePeriod);
  const deletePeriod = useTkbStore((s) => s.deletePeriod);
  const setTheme = useTkbStore((s) => s.setTheme);
  const addBoardSticker = useTkbStore((s) => s.addBoardSticker);
  const moveBoardSticker = useTkbStore((s) => s.moveBoardSticker);
  const removeBoardSticker = useTkbStore((s) => s.removeBoardSticker);

  const [ready, setReady] = useState(false);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [decorate, setDecorate] = useState(false);
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
        onExport={() => setExportOpen(true)}
        onTheme={() => setThemeOpen(true)}
        onStickers={() => setDecorate((v) => !v)}
        onManage={() => setSlotsOpen(true)}
      />

      {entries.length === 0 ? (
        <div className="mb-4 mt-2">
          <p className="type-panel">Thời khóa biểu của bạn còn trống</p>
          <p className="mt-1 type-note text-ink-soft">
            Bấm dấu + trên lưới để thêm buổi học, ca làm hoặc việc nhà.
          </p>
        </div>
      ) : (
        <div className="h-3 md:h-4" />
      )}

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
          onOpenJob={(periodId, day, entryId) =>
            setSelected({ periodId, day, entryId })
          }
        />
      </StickerBoard>

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
          paper={theme.paper}
          onClose={() => setExportOpen(false)}
        />
      ) : null}
    </div>
  );
}
