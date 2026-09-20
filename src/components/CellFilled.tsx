import {
  CATEGORY_BG,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatHours,
  hexToBg,
  type CellEntry,
  type TodoItem,
} from "@/lib/types";

type Props = {
  jobs: CellEntry[];
  selectedId?: string;
  onOpenJob?: (id: string) => void;
  onToggleTodo?: (entryId: string, todoId: string) => void;
  onAdd?: () => void;
  staticRender?: boolean;
};

export function CellJobs({
  jobs,
  selectedId,
  onOpenJob,
  onToggleTodo,
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
          onToggleTodo={onToggleTodo}
        />
      ))}
      {!staticRender ? (
        <button
          type="button"
          onClick={onAdd}
          className="ui-btn min-h-8 rounded-cell text-[12px] font-medium text-ink-faint hover:bg-line-soft hover:text-ink"
        >
          + thêm việc
        </button>
      ) : null}
    </div>
  );
}

function visibleTodos(todos?: TodoItem[]): TodoItem[] {
  return (todos ?? []).filter((todo) => todo.text.trim());
}

function JobRow({
  entry,
  selected,
  staticRender,
  onClick,
  onToggleTodo,
}: {
  entry: CellEntry;
  selected?: boolean;
  staticRender?: boolean;
  onClick?: () => void;
  onToggleTodo?: (entryId: string, todoId: string) => void;
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
      className={`relative rounded-cell px-2 py-1.5 text-left ${selected ? "shadow-selected" : ""}`}
      style={{
        background: bg,
        boxShadow: `inset 3px 0 0 ${accent}`,
      }}
    >
      {staticRender ? (
        <div>
          <JobMeta
            title={entry.title}
            sticker={entry.sticker}
            hours={hours}
            note={entry.note}
            category={entry.category}
            accent={accent}
            todoCount={todos.length}
            todoDone={done}
          />
        </div>
      ) : (
        <button type="button" onClick={onClick} className="block w-full text-left">
          <JobMeta
            title={entry.title}
            sticker={entry.sticker}
            hours={hours}
            note={entry.note}
            category={entry.category}
            accent={accent}
            todoCount={todos.length}
            todoDone={done}
          />
        </button>
      )}
      {todos.length > 0 ? (
        <ul className="mt-1 flex flex-col gap-0.5">
          {todos.map((todo) => (
            <li key={todo.id}>
              {staticRender ? (
                <span
                  className={`flex items-start gap-1 text-[11px] leading-snug ${
                    todo.done ? "text-ink-faint line-through" : "text-ink"
                  }`}
                >
                  <span className="w-3 shrink-0 font-mono">
                    {todo.done ? "☑" : "☐"}
                  </span>
                  <span className="min-w-0 break-words">{todo.text.trim()}</span>
                </span>
              ) : (
                <label
                  className={`flex min-h-9 cursor-pointer items-center gap-1.5 text-[11px] leading-snug md:min-h-0 md:items-start md:gap-1 ${
                    todo.done ? "text-ink-faint line-through" : "text-ink"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    className="h-4 w-4 shrink-0 accent-ink md:mt-0.5 md:h-3 md:w-3"
                    onChange={() => onToggleTodo?.(entry.id, todo.id)}
                  />
                  <span className="min-w-0 break-words">{todo.text.trim()}</span>
                </label>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function JobMeta({
  title,
  sticker,
  hours,
  note,
  category,
  accent,
  todoCount,
  todoDone,
}: {
  title: string;
  sticker?: string;
  hours: string;
  note?: string;
  category: CellEntry["category"];
  accent: string;
  todoCount?: number;
  todoDone?: number;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-1">
        <span className="type-cell line-clamp-2 text-ink">{title}</span>
        {sticker ? (
          <span className="shrink-0 text-sm leading-none">{sticker}</span>
        ) : null}
      </div>
      {hours ? (
        <div className="font-mono text-[10px] font-medium text-ink-soft">
          {hours}
        </div>
      ) : null}
      {note?.trim() ? (
        <p className="mt-0.5 line-clamp-2 whitespace-pre-wrap type-note text-ink-soft">
          {note.trim()}
        </p>
      ) : null}
      <div className="mt-0.5 flex items-center gap-1.5">
        <div className="type-tag" style={{ color: accent }}>
          {CATEGORY_LABELS[category]}
        </div>
        {todoCount ? (
          <span className="font-mono text-[10px] text-ink-faint">
            {todoDone}/{todoCount}
          </span>
        ) : null}
      </div>
    </>
  );
}
