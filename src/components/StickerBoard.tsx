"use client";

import { useRef, type ReactNode } from "react";
import { BOARD_STICKERS, type BoardSticker } from "@/lib/types";

type Props = {
  stickers: BoardSticker[];
  decorate: boolean;
  onAdd: (emoji: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onRemove: (id: string) => void;
  children: ReactNode;
};

export function StickerBoard({
  stickers,
  decorate,
  onAdd,
  onMove,
  onRemove,
  children,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={boxRef} className="relative">
        {children}
        {stickers.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-grab select-none touch-none active:cursor-grabbing"
            style={{
              left: `${sticker.x}%`,
              top: `${sticker.y}%`,
              fontSize: sticker.size,
              lineHeight: 1,
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const box = boxRef.current;
              if (!box) return;
              const move = (ev: PointerEvent) => {
                const rect = box.getBoundingClientRect();
                onMove(
                  sticker.id,
                  ((ev.clientX - rect.left) / rect.width) * 100,
                  ((ev.clientY - rect.top) / rect.height) * 100,
                );
              };
              const up = () => {
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", up);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", up);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              onRemove(sticker.id);
            }}
            aria-label="Sticker trang trí"
          >
            {sticker.emoji}
          </button>
        ))}
      </div>
      {decorate ? (
        <div className="mt-3 rounded-card border border-line bg-paper-card p-3">
          <p className="mb-2 type-note text-ink-soft">
            Bấm emoji để dán lên tờ TKB. Kéo để đặt vị trí. Double-click để gỡ.
          </p>
          <div className="flex flex-wrap gap-2">
            {BOARD_STICKERS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="h-10 w-10 rounded-cell border border-line text-xl hover:bg-line-soft"
                onClick={() => onAdd(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
