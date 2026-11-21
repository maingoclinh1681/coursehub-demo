# Buổi 6 - Docker, Testing, CI

## Môi trường
- OS: Windows (PowerShell)
- Docker version: Docker Desktop (x86_64)
- Python / Node version: Python 3.13 / Node 22

## Kết quả local
- `python -m pytest backend/tests -q`: PASS
- `npm test`: PASS
- `npm run build`: PASS
- `docker compose up --build`: PASS (`backend` healthy trên cổng 8000, `frontend` chạy Nginx trên cổng 8080, kết nối thành công PostgreSQL host qua `host.docker.internal`)

## Một luồng tích hợp đã kiểm tra
- Request: `POST http://127.0.0.1:8080/api/enrollments` với `student_id: "22000004"` và `class_section_id: "WEB-01"` (sau đó thực hiện hủy đăng ký để trả về dữ liệu ban đầu)
- HTTP status: `201 Created` (đăng ký) và `204 No Content` (hủy đăng ký); DevTools Network xác nhận request đi qua cổng `8080/api/...` tới Nginx rồi chuyển tiếp sang `backend:8000`
- SQL xác nhận: Bảng `enrollments` và view `v_section_summary` cập nhật đúng số lượng chỗ đã đăng ký và ghi nhận log `CREATED` / `CANCELLED`

## Debug / AI
- Lỗi gặp phải: Chạy `pytest backend/tests -q` báo `ModuleNotFoundError: No module named 'backend'` và chạy `docker compose ps` trống do chưa khởi chạy container.
- Bằng chứng đã xem: Traceback của pytest khi import `backend.app.main` và output rỗng của `docker compose ps` sau khi mới chỉ chạy `docker compose config`.
- Nếu dùng AI: AI gợi ý đổi lệnh test thành `python -m pytest backend/tests -q` để thêm thư mục gốc vào `sys.path` và chạy `docker compose up -d --build`. Đã tự kiểm chứng lại trên terminal local thấy test pass và container lên trạng thái `healthy`.
