# 📝 Multi-User Note App

Đây là một ứng dụng ghi chú chạy trực tiếp trên trình duyệt (Single Page Application). Ứng dụng mô phỏng một hệ thống đa người dùng, lưu trữ ghi chú bằng HTML5, CSS3 và Vanilla JavaScript (ES6+), không phụ thuộc vào bất kỳ thư viện hay framework bên ngoài nào (ngoại trừ FontAwesome cho icon).

Toàn bộ dữ liệu được quản lý cục bộ (Local) trên máy tính người dùng thông qua `localStorage` và `sessionStorage`.

---

## ✨ Tính Năng Nổi Bật (Features)

- **Đa Tài Khoản (Multi-users)**: Hệ thống Đăng nhập / Đăng ký cơ bản. Bạn có thể tạo nhiều tài khoản trên cùng một trình duyệt, mỗi tài khoản sẽ có một không gian lưu trữ ghi chú riêng biệt.
- **Thao tác Ghi Chú (CRUD)**: Tạo, Đọc, Cập nhật, và đưa vào Thùng rác (Xóa mềm hoặc Xóa cứng).
- **Ghim Lên Đầu (Pin)**: Đánh dấu các ghi chú quan trọng và đính lên đầu danh sách.
- **Phân Loại Bằng Màu Sắc**: Bảng màu pastel giúp phân loại các ghi chú một cách trực quan, giúp tăng cường trải nghiệm (UX).
- **Tìm Kiếm Thời Gian Thực (Real-time Search)**: Lọc nội dung ở thanh tìm kiếm ngay khi đang gõ phím.
- **Hiệu Ứng Lưới Masonry**: Dàn trang các thẻ (card) ghi chú theo dạng lưới so le chuyên nghiệp mà không bị vỡ bố cục bằng CSS Columns.
- **Giao Diện Phản Hồi (Responsive)**: Tương thích hoàn toàn trên Desktop, Tablet và Mobile.
- **Theme Dark/Light tuỳ biến**: Các thẻ UI và Input có thể hấp thụ trong suốt (transparent) để giữ lại tông màu chủ đạo người viết chọn.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

- **Frontend**: HTML5, Vanilla JavaScript.
- **Styling**: CSS3 thuần (áp dụng CSS Variables, Flexbox, CSS Layout Columns).
- **Storage**: Cặp hàm `localStorage` (lưu trữ JSON lâu dài) và `sessionStorage` (quản lý ID đăng nhập tạm thời).
- **Font & Icons**: Google Fonts (Inter) và FontAwesome 6 (dùng CDN).

---

## 📂 Cấu Trúc Dự Án (Project Structure)

```text
note-app/
├── index.html       # Tệp điểm khởi chạy giao diện chính (chuyển đổi SPA giữa Login form & Dashboard)
├── css/
│   └── style.css    # Tất cả CSS Variables, dàn Layout, hiệu ứng Modal, Responsive
└── js/
    ├── store.js     # Lớp Dữ liệu (Data Layer). Chứa logic CRUD localStorage và Auth.
    └── app.js       # Lớp Giao diện (UI Layer). Xử lý DOM Events (click form, render grid lưới).
```

### 💡 Kiến trúc tách biệt trong JS:
- `store.js` đóng vai trò giống như Backend xử lý Logic. Cho ra/Lưu vào dữ liệu (`Array/Object`).
- `app.js` chịu trách nhiệm giao tiếp tương tác với người dùng ở màn hình. 

---

## 🚀 Hướng Dẫn Cài Đặt và Sử Dụng

Vì đây là ứng dụng 100% Vanilla JS, bạn không cần cài đặt Node.js hay Build tools nào cả. 

### Bước 1: Mở ứng dụng
- Cách đơn giản nhất: Click đúp vào file `index.html` để chạy trực tiếp trên trình duyệt (Chrome, Safari, Edge...).
- **Nên dùng:** Sử dụng tiện ích mở rộng như **Live Server** trên VSCode để mở trực tiếp trên cổng http localhost (ví dụ `http://127.0.0.1:5500/index.html`). 

### Bước 2: Tạo tài khoản & Sử dụng
1. Tại màn hình Welcome, nhấp vào **Đăng ký ngay**, nhập tên đăng nhập và mật khẩu mà bạn mong muốn (trên 3 ký tự).
2. Khi thành công, biểu mẫu sẽ tự động Đăng nhập vào bên trong.
3. Ở Sidebar, bạn có thể xem các Lọc (Tất cả, Đã ghim, Thùng rác).
4. Nhấp nút **Tạo ghi chú** màu xanh, điền tiêu đề (tùy chọn), nội dung và chọn 1 mã màu tùy thích tại thanh tròn ở dưới. Nhấp **Lưu Ghi chú**
5. Ghi chú sẽ ngay lập tức được hiển thị ngoài giao diện Masonry Grid. Bấm đúp vào thân thẻ để sửa lại.
6. Bấm vào icon Ghim (Pin) trên thẻ để đẩy ưu tiên thẻ lên đầu. Bấm icon rác để dọn nó vào mục lưới Trash.

### Bước 3: Xem cơ sở dữ liệu ảo
- Trên giao diện đang mở, nhấn phím `F12` để mở DevTools.
- Mở qua thẻ **Application** -> Mở tab con **Local Storage**. Tại đó, toàn bộ dữ liệu bạn nhập sẽ tồn tại dưới dạng chuỗi (String) dạng Khóa - Giá trị (`users_db` và `notes_db`).

---

## 🤝 Lời Cảm Ơn
Mã nguồn ứng dụng mẫu được thiết kế chuẩn Clean Code, chú thích rành mạch và dễ dàng tinh chỉnh (bạn chỉ cần đổi thông số màu sắc ở biến root `:root` trong thẻ đầu `style.css` là thay đổi toàn bộ tông màu dự án). Chúc bạn sử dụng hiệu quả!