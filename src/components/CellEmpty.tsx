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
      className={`group flex min-h-[88px] w-full items-center justify-center rounded-cell transition-colors hover:bg-[#F7F5EF] landscape:min-h-[64px] ${
        selected ? "shadow-selected" : ""
      }`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-cell text-[18px] leading-none text-ink-faint opacity-[0.85] group-hover:border group-hover:border-line group-hover:bg-paper-card group-hover:text-ink-soft group-hover:opacity-100">
        +
      </span>
    </button>
  );
}
