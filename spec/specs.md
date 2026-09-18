# Spec: Thời khóa biểu cá nhân (lưới)

Ngày: 2026-09-18  
Stack: Vite + React + TypeScript, không backend.

## 1. Mục tiêu sản phẩm

Một web tĩnh để người dùng cá nhân xếp **lịch tuần dạng thời khóa biểu**: cột Thứ 2–Chủ nhật, hàng là **tiết/ca tự định nghĩa** (không phải timeline giờ liên tục). Dùng cho học + việc + việc nhà trên máy tính và điện thoại ngang nhau.

**Thành công v1:** mở app, thấy lưới, thêm/sửa/xóa ô, thêm/sửa/xóa tiết, F5 không mất dữ liệu, xuất PNG, mở được trên điện thoại sau khi deploy tĩnh.

**Ngoài phạm vi v1:** kéo-thả, ghi đè theo tuần, nhiều TKB, tài khoản, sync cloud, thông báo, PWA, dark mode riêng.

## 2. Kiến trúc

- `src/domain` — types, default timetable, thao tác thuần (upsert cell, xóa slot cascade). Không đụng DOM.
- `src/storage` — `StorageAdapter { load(): Timetable | null; save(t: Timetable): void }`. v1 chỉ `LocalStorageAdapter`.
- `src/state` — store: load lúc mount, mọi mutation gọi domain rồi `save`.
- `src/ui` — lưới, form ô, quản lý tiết, toolbar.
- `src/export` — chụp node lưới, tải `tkb.png`.

`spec/` và `plans/` nằm ở root, **không import vào `src/`**, để `vite build` không đụng markdown.

## 3. Dữ liệu

`dayOfWeek`: `1` = Thứ 2 … `7` = Chủ nhật.

- `Category`: `hoc` | `lam` | `nha` | `khac`
- `Slot`: `id`, `name`, `order`
- `Cell`: `slotId`, `dayOfWeek`, `title`, `category`, `color` (hex), `note`
- `Timetable`: `schemaVersion: 1`, `slots`, `cells`

Quy tắc:

- Một cell tối đa cho mỗi cặp `(slotId, dayOfWeek)`.
- Ô trống = không có phần tử trong `cells`.
- Lần đầu `load()` = null → default 3 slot **Sáng / Chiều / Tối**, `cells` rỗng.
- Màu mặc định: học `#3B82F6`, làm `#F59E0B`, nhà `#10B981`, khác `#64748B`.
- Key localStorage: `daily.tkb.v1`.
- JSON hỏng / `schemaVersion` khác 1 → dùng default, không crash; không xóa key cũ ngay.

**Xóa tiết:** xóa slot + mọi cell có `slotId` đó, sau khi xác nhận. Đổi thứ tự = đổi `order`.

## 4. Giao diện

- Desktop (≥900px): header Daily + Xuất ảnh + Quản lý tiết; lưới 8 cột, cột tiết sticky.
- Mobile (<900px): cuộn ngang, cột tiết sticky; form ô = bottom sheet.
- Form: title bắt buộc, 4 loại, màu, ghi chú; Lưu / Hủy / Xóa (khi sửa).
- Quản lý tiết: thêm, sửa tên, lên/xuống, xóa + confirm.
- Xuất PNG: chụp lưới đủ 7 ngày, file `tkb.png`.
- Copy UI: tiếng Việt.

## 5. Lỗi

- Title trống → không lưu.
- Export fail → thông báo, dữ liệu không đổi.
- Save storage fail → thông báo, giữ state RAM.

## 6. Kiểm thử

- Domain: upsert ghi đè; xóa slot cascade; default 3 slot; parse JSON hỏng → default.
- Tay: CRUD ô/tiết, reload, PNG, viewport ~390px.

## Prompt Claude Design

```
You are a product UI designer. Design a high-fidelity UI (not a marketing landing page) for a personal weekly TIMETABLE GRID web app.

Product
- Name: Daily TKB (Vietnamese UI copy)
- User: one person planning study + work + home chores
- Differentiator: school-style grid, NOT a Google Calendar timeline
- Columns: Mon–Sun labeled Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7, CN
- Rows: user-defined periods. Default 3 rows: Sáng, Chiều, Tối
- One week template only. No accounts.

Screens to deliver (separate frames, light theme)
1) Desktop 1440×900 — main week grid filled with realistic Vietnamese sample cells
2) Desktop — empty grid (first-run), empty cells show a faint +
3) Mobile 390×844 — same grid: horizontal scroll, sticky first column
4) Mobile — cell editor as bottom sheet
5) “Quản lý tiết” panel
6) Export preview: clean grid only

Visual direction
- Calm, paper/notebook + modern product. Not neon, not glassmorphism, not purple-gradient SaaS.
- Category colors: Học #3B82F6, Làm #F59E0B, Nhà #10B981, Khác #64748B
- Top bar: wordmark “Daily”, “Xuất ảnh”, “Quản lý tiết”
```
