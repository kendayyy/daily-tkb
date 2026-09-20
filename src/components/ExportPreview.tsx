"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { WeekGrid } from "@/components/WeekGrid";
import type { BoardSticker, CellEntry, Period } from "@/lib/types";

const EXPORT_WIDTH = 1180;

type Props = {
  periods: Period[];
  entries: CellEntry[];
  stickers: BoardSticker[];
  paperCard: string;
  onClose: () => void;
};

function TimetableCapture({
  periods,
  entries,
  stickers,
}: {
  periods: Period[];
  entries: CellEntry[];
  stickers: BoardSticker[];
}) {
  return (
    <div className="relative" style={{ width: EXPORT_WIDTH }}>
      <WeekGrid periods={periods} entries={entries} exportMode />
      {stickers.map((sticker) => (
        <span
          key={sticker.id}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            left: `${sticker.x}%`,
            top: `${sticker.y}%`,
            fontSize: sticker.size,
            lineHeight: 1,
          }}
        >
          {sticker.emoji}
        </span>
      ))}
    </div>
  );
}

async function scaleTable(
  dataUrl: string,
  orientation: "landscape" | "portrait",
  paperCard: string,
): Promise<string> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  const targetW = orientation === "portrait" ? 1080 : 1920;
  const scale = targetW / img.width;
  const targetH = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Không tạo được ảnh");
  ctx.fillStyle = paperCard;
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(img, 0, 0, targetW, targetH);
  return canvas.toDataURL("image/png");
}

async function savePng(dataUrl: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const file = new File([blob], "tkb.png", { type: "image/png" });
  const canShare =
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] });
  if (canShare) {
    try {
      await navigator.share({ files: [file], title: "Thời khóa biểu" });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      throw err;
    }
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "tkb.png";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function ExportPreview({
  periods,
  entries,
  stickers,
  paperCard,
  onClose,
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"landscape" | "portrait">(
    "portrait",
  );

  return (
    <div
      className="sheet-overlay fixed inset-0 z-[60] flex items-end justify-center p-0 md:items-center md:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[1100px] flex-col rounded-t-card border border-line/60 bg-paper p-4 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-sheet md:rounded-card md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
          <p className="type-panel">Xuất ảnh</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="type-btn min-h-11 rounded-chip border border-line px-3 py-2"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              disabled={busy}
              className="type-btn min-h-11 rounded-chip bg-ink px-3 py-2 text-paper-card disabled:opacity-50"
              onClick={async () => {
                const node = nodeRef.current;
                if (!node) return;
                setBusy(true);
                setError(null);
                try {
                  await document.fonts.ready.catch(() => undefined);
                  await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                  );
                  const width = Math.max(node.scrollWidth, EXPORT_WIDTH);
                  const height = Math.max(node.scrollHeight, 1);
                  const area = width * height;
                  const pixelRatio =
                    area > 4_000_000 ? 1 : Math.min(2, window.devicePixelRatio || 1);
                  const dataUrl = await toPng(node, {
                    cacheBust: true,
                    pixelRatio,
                    backgroundColor: paperCard,
                    width,
                    height,
                    style: {
                      transform: "none",
                      left: "0",
                      top: "0",
                      overflow: "visible",
                    },
                  });
                  if (!dataUrl || dataUrl.length < 100) {
                    throw new Error("Ảnh trống");
                  }
                  const framed = await scaleTable(
                    dataUrl,
                    orientation,
                    paperCard,
                  );
                  await savePng(framed);
                } catch (err) {
                  const message =
                    err instanceof Error ? err.message : "Không xuất được ảnh";
                  setError(
                    `${message}. Trên iPhone: giữ ảnh trong hộp chia sẻ, hoặc chụp màn hình lưới.`,
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Đang xuất…" : "Tải PNG"}
            </button>
          </div>
        </div>
        {error ? <p className="mb-3 type-note text-danger">{error}</p> : null}
        <div className="mb-3 flex shrink-0 gap-2">
          <button
            type="button"
            className={`type-btn min-h-11 flex-1 rounded-chip border px-3 py-2 ${
              orientation === "portrait"
                ? "border-ink bg-ink text-paper-card"
                : "border-line bg-paper-card text-ink"
            }`}
            onClick={() => setOrientation("portrait")}
          >
            Ảnh dọc
          </button>
          <button
            type="button"
            className={`type-btn min-h-11 flex-1 rounded-chip border px-3 py-2 ${
              orientation === "landscape"
                ? "border-ink bg-ink text-paper-card"
                : "border-line bg-paper-card text-ink"
            }`}
            onClick={() => setOrientation("landscape")}
          >
            Ảnh ngang
          </button>
        </div>
        <p className="mb-2 shrink-0 type-note text-ink-soft">
          Chỉ xuất cái bảng TKB (đủ 7 ngày). Vuốt xem trước, rồi Tải PNG.
        </p>
        <div className="min-h-[220px] overflow-auto rounded-card border border-line bg-paper-card">
          <div ref={nodeRef}>
            <TimetableCapture
              periods={periods}
              entries={entries}
              stickers={stickers}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
