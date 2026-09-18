# Plan: Thời khóa biểu cá nhân (lưới)

Bản làm việc trong repo (không import vào `src/`). Spec đầy đủ: [`../spec/specs.md`](../spec/specs.md).

## Thứ tự gói

0. Vite + React + TypeScript; thư mục `src/domain`, `src/storage`, `src/state`, `src/ui`, `src/export`
1. Types Slot/Cell/Timetable + default + rules
2. StorageAdapter + LocalStorageAdapter + fallback
3. UI lưới, form ô, quản lý tiết, responsive
4. Xuất PNG (`html-to-image`)
5. README deploy tĩnh
6. Test domain (Vitest) + build

## Ghi chú build

`spec/` và `plans/` chỉ chứa markdown. Vite chỉ bundle `src/` + `index.html`.
