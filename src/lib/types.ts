export type Category = "hoc" | "lam" | "nha" | "khac";

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Period {
  id: string;
  name: string;
  order: number;
  startTime?: string;
  endTime?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CellEntry {
  id: string;
  periodId: string;
  day: DayIndex;
  title: string;
  category: Category;
  color?: string;
  note?: string;
  todos?: TodoItem[];
  startTime?: string;
  endTime?: string;
  sticker?: string;
}

export interface BoardSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

export interface Theme {
  id: string;
  paper: string;
  paperCard: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  line: string;
  lineSoft: string;
}

export type PhoneLayout = "doc" | "ngang";

export interface AppState {
  periods: Period[];
  entries: CellEntry[];
  theme: Theme;
  boardStickers: BoardSticker[];
  phoneLayout: PhoneLayout;
}

export const DAYS: { day: DayIndex; label: string; short: string }[] = [
  { day: 0, label: "Thứ 2", short: "T2" },
  { day: 1, label: "Thứ 3", short: "T3" },
  { day: 2, label: "Thứ 4", short: "T4" },
  { day: 3, label: "Thứ 5", short: "T5" },
  { day: 4, label: "Thứ 6", short: "T6" },
  { day: 5, label: "Thứ 7", short: "T7" },
  { day: 6, label: "CN", short: "CN" },
];

export const CATEGORIES: Category[] = ["hoc", "lam", "nha", "khac"];

export const CATEGORY_LABELS: Record<Category, string> = {
  hoc: "Học",
  lam: "Làm",
  nha: "Nhà",
  khac: "Khác",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  hoc: "#3B82F6",
  lam: "#F59E0B",
  nha: "#10B981",
  khac: "#64748B",
};

export const CATEGORY_BG: Record<Category, string> = {
  hoc: "rgba(59,130,246,.09)",
  lam: "rgba(245,158,11,.10)",
  nha: "rgba(16,185,129,.09)",
  khac: "rgba(100,116,139,.09)",
};

export const COLOR_SWATCHES = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#64748B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

export const CELL_STICKERS = [
  "⭐",
  "🔥",
  "📌",
  "💡",
  "📚",
  "✏️",
  "☕",
  "💪",
  "🎵",
  "🌸",
  "🍀",
  "✅",
];

export const BOARD_STICKERS = [
  "🌸",
  "🌿",
  "⭐",
  "☁️",
  "🎀",
  "🐱",
  "🐻",
  "🍋",
  "🧋",
  "🌙",
  "☀️",
  "🧸",
];

export const THEME_PRESETS: Theme[] = [
  {
    id: "kem",
    paper: "#FBF9F4",
    paperCard: "#FFFFFF",
    ink: "#232A26",
    inkSoft: "#6B7570",
    inkFaint: "#A7ADA8",
    line: "#E7E2D6",
    lineSoft: "#F0ECE1",
  },
  {
    id: "sage",
    paper: "#F3F6F2",
    paperCard: "#FFFFFF",
    ink: "#24312A",
    inkSoft: "#5E6E64",
    inkFaint: "#97A399",
    line: "#D7E0D6",
    lineSoft: "#E8EEE6",
  },
  {
    id: "navy",
    paper: "#EEF2F6",
    paperCard: "#FFFFFF",
    ink: "#1E2A3A",
    inkSoft: "#5B6B7C",
    inkFaint: "#93A0AE",
    line: "#D5DDE6",
    lineSoft: "#E8EEF3",
  },
  {
    id: "rose",
    paper: "#FBF4F4",
    paperCard: "#FFFFFF",
    ink: "#3A2428",
    inkSoft: "#7A5A60",
    inkFaint: "#B39499",
    line: "#E8D6D6",
    lineSoft: "#F3E8E8",
  },
];

export function todayIndex(): DayIndex {
  return ((new Date().getDay() + 6) % 7) as DayIndex;
}

export function hexToBg(hex: string): string {
  const n = hex.replace("#", "");
  const r = Number.parseInt(n.slice(0, 2), 16);
  const g = Number.parseInt(n.slice(2, 4), 16);
  const b = Number.parseInt(n.slice(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) {
    return CATEGORY_BG.khac;
  }
  return `rgba(${r},${g},${b},0.09)`;
}

export function formatHours(start?: string, end?: string): string {
  if (start && end) return `${start}–${end}`;
  return start || end || "";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--paper", theme.paper);
  root.style.setProperty("--paper-card", theme.paperCard);
  root.style.setProperty("--ink", theme.ink);
  root.style.setProperty("--ink-soft", theme.inkSoft);
  root.style.setProperty("--ink-faint", theme.inkFaint);
  root.style.setProperty("--line", theme.line);
  root.style.setProperty("--line-soft", theme.lineSoft);
}

export function defaultPeriods(): Period[] {
  return [
    { id: "period-sang", name: "Sáng", order: 0, startTime: "07:00", endTime: "11:30" },
    { id: "period-chieu", name: "Chiều", order: 1, startTime: "13:00", endTime: "17:30" },
    { id: "period-toi", name: "Tối", order: 2, startTime: "18:00", endTime: "21:00" },
  ];
}

export function defaultTheme(): Theme {
  return THEME_PRESETS[0]!;
}
