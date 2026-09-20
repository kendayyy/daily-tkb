type Props = {
  selected?: boolean;
  label: string;
  onClick: () => void;
};

export function CellEmpty({ selected, label, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`group ui-btn flex min-h-[88px] w-full items-center justify-center rounded-cell landscape:min-h-[64px] ${
        selected ? "shadow-selected" : ""
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-cell border border-dashed border-line text-[18px] leading-none text-ink-faint group-hover:border-ink-soft group-hover:bg-paper-card group-hover:text-ink">
        +
      </span>
    </button>
  );
}
