"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultPeriods,
  defaultTheme,
  type AppState,
  type BoardSticker,
  type Category,
  type CellEntry,
  type DayIndex,
  type Period,
  type PhoneLayout,
  type Theme,
} from "./types";

type EntryPatch = Partial<Omit<CellEntry, "id" | "periodId" | "day">>;

type TkbStore = AppState & {
  upsertEntry: (entry: Omit<CellEntry, "id"> & { id?: string }) => void;
  patchEntry: (id: string, patch: EntryPatch) => void;
  toggleTodo: (entryId: string, todoId: string) => void;
  deleteEntry: (id: string) => void;
  addPeriod: (name?: string) => void;
  renamePeriod: (id: string, name: string) => void;
  updatePeriodTime: (id: string, startTime: string, endTime: string) => void;
  movePeriod: (id: string, direction: -1 | 1) => void;
  deletePeriod: (id: string) => void;
  setTheme: (theme: Theme) => void;
  setPhoneLayout: (layout: PhoneLayout) => void;
  addBoardSticker: (emoji: string) => void;
  moveBoardSticker: (id: string, x: number, y: number) => void;
  removeBoardSticker: (id: string) => void;
};

function sorted(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => a.order - b.order);
}

export const useTkbStore = create<TkbStore>()(
  persist(
    (set, get) => ({
      periods: defaultPeriods(),
      entries: [],
      theme: defaultTheme(),
      boardStickers: [],
      phoneLayout: "doc",
      upsertEntry: (entry) => {
        const id = entry.id ?? crypto.randomUUID();
        const next: CellEntry = {
          id,
          periodId: entry.periodId,
          day: entry.day,
          title: entry.title,
          category: entry.category as Category,
          color: entry.color,
          note: entry.note,
          todos: entry.todos ?? [],
          startTime: entry.startTime,
          endTime: entry.endTime,
          sticker: entry.sticker,
        };
        set((state) => {
          const without = state.entries.filter((item) => item.id !== id);
          return { entries: [...without, next] };
        });
      },
      patchEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),
      toggleTodo: (entryId, todoId) =>
        set((state) => ({
          entries: state.entries.map((item) =>
            item.id !== entryId
              ? item
              : {
                  ...item,
                  todos: (item.todos ?? []).map((todo) =>
                    todo.id === todoId ? { ...todo, done: !todo.done } : todo,
                  ),
                },
          ),
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((item) => item.id !== id),
        })),
      addPeriod: (name = "Buổi mới") =>
        set((state) => {
          const order =
            state.periods.reduce((max, p) => Math.max(max, p.order), -1) + 1;
          return {
            periods: [
              ...state.periods,
              { id: crypto.randomUUID(), name, order },
            ],
          };
        }),
      renamePeriod: (id, name) =>
        set((state) => ({
          periods: state.periods.map((p) =>
            p.id === id ? { ...p, name } : p,
          ),
        })),
      updatePeriodTime: (id, startTime, endTime) =>
        set((state) => ({
          periods: state.periods.map((p) =>
            p.id === id
              ? {
                  ...p,
                  startTime: startTime || undefined,
                  endTime: endTime || undefined,
                }
              : p,
          ),
        })),
      movePeriod: (id, direction) => {
        const periods = sorted(get().periods);
        const index = periods.findIndex((p) => p.id === id);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= periods.length) return;
        const swapped = [...periods];
        const a = swapped[index];
        const b = swapped[target];
        if (!a || !b) return;
        swapped[index] = b;
        swapped[target] = a;
        set({
          periods: swapped.map((p, order) => ({ ...p, order })),
        });
      },
      deletePeriod: (id) =>
        set((state) => ({
          periods: state.periods.filter((p) => p.id !== id),
          entries: state.entries.filter((e) => e.periodId !== id),
        })),
      setTheme: (theme) => set({ theme }),
      setPhoneLayout: (phoneLayout) => set({ phoneLayout }),
      addBoardSticker: (emoji) =>
        set((state) => ({
          boardStickers: [
            ...state.boardStickers,
            {
              id: crypto.randomUUID(),
              emoji,
              x: 12 + (state.boardStickers.length % 6) * 12,
              y: 18 + Math.floor(state.boardStickers.length / 6) * 14,
              size: 28,
            },
          ],
        })),
      moveBoardSticker: (id, x, y) =>
        set((state) => ({
          boardStickers: state.boardStickers.map((s) =>
            s.id === id
              ? {
                  ...s,
                  x: Math.min(96, Math.max(2, x)),
                  y: Math.min(94, Math.max(2, y)),
                }
              : s,
          ),
        })),
      removeBoardSticker: (id) =>
        set((state) => ({
          boardStickers: state.boardStickers.filter((s) => s.id !== id),
        })),
    }),
    {
      name: "daily.tkb.v2",
      skipHydration: true,
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...p,
          theme: p.theme ?? current.theme,
          boardStickers: p.boardStickers ?? [],
          phoneLayout: p.phoneLayout === "ngang" ? "ngang" : "doc",
          periods: p.periods ?? current.periods,
          entries: (p.entries ?? current.entries).map((item) => ({
            ...item,
            todos: item.todos ?? [],
          })),
        };
      },
    },
  ),
);

export function findEntries(
  entries: CellEntry[],
  periodId: string,
  day: DayIndex,
): CellEntry[] {
  return entries
    .filter((e) => e.periodId === periodId && e.day === day)
    .sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
}
