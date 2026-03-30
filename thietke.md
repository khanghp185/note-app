# 📝 Project Specification: Multi-User Note App (HTML/CSS/JS)

## 1. Tổng quan dự án

Xây dựng một ứng dụng ghi chú (Note-taking App) chạy trên trình duyệt, sử dụng LocalStorage để lưu trữ dữ liệu. Ứng dụng hỗ trợ nhiều tài khoản người dùng trên cùng một thiết bị thông qua hệ thống Đăng nhập/Đăng ký giả lập.

## 2. Công nghệ yêu cầu

- **Frontend**: HTML5, CSS3 (ưu tiên Flexbox/Grid, Responsive), JavaScript ES6+.
- **Storage**: localStorage (lưu trữ lâu dài) và sessionStorage (quản lý phiên đăng nhập).
- **Icon**: Sử dụng FontAwesome hoặc Lucide Icons.

## 3. Cấu trúc dữ liệu (Data Schema)

### User Object:
```javascript
{
  username: "string", // Unique ID
  password: "string", // Simple text or hashed
  createdAt: "timestamp"
}
```

### Note Object:
```javascript
{
  id: "timestamp_uid",
  owner: "username", // Liên kết với tài khoản đang đăng nhập
  title: "string",
  content: "string",
  color: "hex_code",
  tags: ["array"],
  isPinned: boolean,
  isArchived: boolean,
  updatedAt: "datetime"
}
```

## 4. Các tính năng chính (Core Features)

### A. Hệ thống Tài khoản (Authentication)
- **Đăng ký**: Kiểm tra trùng lặp `username`, lưu thông tin vào khóa `users_db` trong LocalStorage.
- **Đăng nhập**: Xác thực `username`/`password`. Nếu đúng, lưu `username` vào sessionStorage (ví dụ: `currentUser`).
- **Đăng xuất**: Xóa `currentUser` khỏi session và quay về màn hình Login.

### B. Quản lý Ghi chú (Notes Management)
- **CRUD**: Thêm, Sửa, Xóa ghi chú. *(Lưu ý: Chỉ hiển thị ghi chú có owner trùng với `currentUser`)*.
- **Ghim (Pin)**: Đưa các ghi chú quan trọng lên đầu danh sách.
- **Tìm kiếm**: Lọc ghi chú theo Tiêu đề hoặc Nội dung theo thời gian thực (Real-time search).
- **Phân loại**: Cho phép chọn màu nền cho từng ghi chú (Ví dụ: Vàng, Xanh lá, Đỏ, Tím).

### C. Giao diện (UI/UX)
- **Màn hình Auth**: Form tối giản, chuyển đổi linh hoạt giữa Login và Register.
- **Dashboard**:
  - **Sidebar**: Thông tin user, nút Đăng xuất, bộ lọc (Tất cả, Đã ghim, Thùng rác).
  - **Main Content**: Thanh tìm kiếm và danh sách ghi chú dạng Masonry hoặc Grid.
  - **Editor Modal**: Cửa sổ nổi (Pop-up) để soạn thảo ghi chú chi tiết.
- **Responsive**: Hiển thị tốt trên Mobile (Sidebar ẩn/hiện bằng Hamburger menu).

## 5. Logic xử lý dữ liệu (Technical Logic)

- Khi khởi tạo app, kiểm tra sessionStorage. Nếu chưa đăng nhập, bắt buộc hiển thị màn hình Login.
- Mọi thao tác lưu dữ liệu (Save/Update/Delete) phải cập nhật ngay vào localStorage dưới khóa `notes_db`.
- Sử dụng hàm `filter()` để tách biệt ghi chú của từng User trước khi Render ra màn hình.

### Yêu cầu đối với Anti Gravity:
- Hãy viết mã nguồn sạch (Clean Code), chia tách rõ ràng giữa Logic xử lý dữ liệu và Logic hiển thị giao diện.
- Sử dụng CSS biến (Variables) để dễ dàng tùy chỉnh màu sắc.
- Viết kèm chú thích tiếng Việt trong code.