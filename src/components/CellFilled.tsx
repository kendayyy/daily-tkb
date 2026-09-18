import {
  CATEGORY_BG,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatHours,
  hexToBg,
  type CellEntry,
} from "@/lib/types";

type Props = {
  jobs: CellEntry[];
  selectedId?: string;
  onOpenJob?: (id: string) => void;
  onAdd?: () => void;
  staticRender?: boolean;
};

export function CellJobs({
  jobs,
  selectedId,
  onOpenJob,
  onAdd,
  staticRender,
}: Props) {
  return (
    <div className="flex min-h-[88px] flex-col gap-1 p-1 landscape:min-h-[64px]">
      {jobs.map((entry) => (
        <JobRow
          key={entry.id}
          entry={entry}
          selected={selectedId === entry.id}
          staticRender={staticRender}
          onClick={() => onOpenJob?.(entry.id)}
        />
      ))}
      {!staticRender ? (
        <button
          type="button"
          onClick={onAdd}
          className="min-h-8 rounded-cell text-[12px] font-medium text-ink-faint hover:bg-[#F7F5EF] hover:text-ink"
        >
          + thêm việc
        </button>
      ) : null}
    </div>
  );
}

function JobRow({
  entry,
  selected,
  staticRender,
  onClick,
}: {
  entry: CellEntry;
  selected?: boolean;
  staticRender?: boolean;
  onClick?: () => void;
}) {
  const accent = entry.color ?? CATEGORY_COLORS[entry.category];
  const bg =
    entry.color && entry.color !== CATEGORY_COLORS[entry.category]
      ? hexToBg(entry.color)
      : CATEGORY_BG[entry.category];
  const hours = formatHours(entry.startTime, entry.endTime);

  const inner = (
    <div
      className={`relative rounded-cell px-2 py-1.5 text-left ${selected ? "shadow-selected" : ""}`}
      style={{
        background: bg,
        boxShadow: `inset 3px 0 0 ${accent}`,
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="type-cell line-clamp-2 text-ink">{entry.title}</span>
        {entry.sticker ? (
          <span className="shrink-0 text-sm leading-none">{entry.sticker}</span>
        ) : null}
      </div>
      {hours ? (
        <div className="font-mono text-[10px] font-medium text-ink-soft">
          {hours}
        </div>
      ) : null}
      <div className="type-tag" style={{ color: accent }}>
        {CATEGORY_LABELS[entry.category]}
      </div>
    </div>
  );

  if (staticRender) return inner;

  return (
    <button type="button" onClick={onClick} className="block w-full">
      {inner}
    </button>
  );
}
