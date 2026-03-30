/**
 * =======================================================
 * LỚP GIAO DIỆN CỦA ỨNG DỤNG (UI LAYER)
 * Chịu trách nhiệm render DOM và xử lý sự kiện
 * =======================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==================================================
    // 1. BIẾN TOÀN CỤC & DOM ELEMENTS
    // ==================================================
    
    let isRegisterMode = false; // Trạng thái màn hình đăng nhập / đăng ký
    let currentFilter = 'all';  // Lọc sidebar: all, pinned, trash
    let selectedColor = '#ffffff'; 

    // Màn hình
    const authView = document.getElementById('auth-view');
    const dashboardView = document.getElementById('dashboard-view');
    
    // DOM Form Auth
    const authTitle = document.getElementById('auth-title');
    const authForm = document.getElementById('auth-form');
    const authBtn = document.getElementById('auth-btn');
    const authSwitchText = document.getElementById('auth-switch-text');
    const authSwitchLink = document.getElementById('auth-switch-link');
    const authError = document.getElementById('auth-error');
    
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // DOM Dashboard
    const sidebar = document.getElementById('sidebar');
    const currentUsernameDisplay = document.getElementById('current-username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const notesGrid = document.getElementById('notes-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const currentFilterTitle = document.getElementById('current-filter-title');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');

    // DOM Sidebar Nav
    const navItems = document.querySelectorAll('.nav-item');

    // DOM Modal
    const modal = document.getElementById('note-modal');
    const newNoteBtn = document.getElementById('new-note-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const pinModalBtn = document.getElementById('pin-modal-btn');
    const colorDots = document.querySelectorAll('.color-dot');
    
    const inputNoteId = document.getElementById('note-id-input');
    const inputNoteTitle = document.getElementById('note-title-input');
    const inputNoteContent = document.getElementById('note-content-input');
    const noteUpdatedTime = document.getElementById('note-updated-time');


    // ==================================================
    // 2. KHỞI TẠO ỨNG DỤNG LÚC LOAD TRANG
    // ==================================================
    
    function initApp() {
        if (Store.isLoggedIn()) {
            showDashboard();
            renderNotes();
        } else {
            showAuth();
        }
    }

    // ==================================================
    // 3. XỬ LÝ GIAO DIỆN (UI MANIPULATION)
    // ==================================================

    // Chuyển màn hình Auth vs Dashboard
    function showAuth() {
        authView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
        usernameInput.value = '';
        passwordInput.value = '';
        authError.textContent = '';
    }

    function showDashboard() {
        authView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        currentUsernameDisplay.textContent = Store.getCurrentUser();
    }

    // Hiển thị thông báo Toast nhỏ ở góc cmn
    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        
        // Tự xóa sau 3 giây
        setTimeout(() => {
            if(toast.parentElement) {
                toastContainer.removeChild(toast);
            }
        }, 3000);
    }

    // Đổi ngày tháng về định dạng VN
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
    }


    // ==================================================
    // 4. LOGIC TÀI KHOẢN (AUTH LOGIC)
    // ==================================================

    // Đổi form login -> register và ngược lại
    authSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;
        
        authError.textContent = ''; // Clear error msg

        if (isRegisterMode) {
            authTitle.textContent = "Đăng Ký";
            authBtn.textContent = "Đăng Ký";
            authSwitchText.textContent = "Đã có tài khoản?";
            authSwitchLink.textContent = "Đăng nhập ngay";
        } else {
            authTitle.textContent = "Đăng Nhập";
            authBtn.textContent = "Đăng Nhập";
            authSwitchText.textContent = "Chưa có tài khoản?";
            authSwitchLink.textContent = "Đăng ký ngay";
        }
    });

    // Submit form đăng nhập/đăng ký
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = usernameInput.value.trim();
        const pass = passwordInput.value.trim();

        if (user.length < 3 || pass.length < 3) {
            authError.textContent = "User/Pass phải trên 3 ký tự!";
            return;
        }

        if (isRegisterMode) {
            const result = Store.register(user, pass);
            if (result.success) {
                // Đăng ký xong, tự động đăng nhập luon
                Store.login(user, pass);
                initApp();
                showToast("Đăng ký thành công!");
            } else {
                authError.textContent = result.message;
            }
        } else {
            const result = Store.login(user, pass);
            if (result.success) {
                initApp();
                showToast("Chào mừng quay trở lại!");
            } else {
                authError.textContent = result.message;
            }
        }
    });

    // Nút Đăng xuất
    logoutBtn.addEventListener('click', () => {
        Store.logout();
        initApp();
    });


    // ==================================================
    // 5. RENDER VÀ THAO TÁC GHI CHÚ
    // ==================================================

    // Render danh sách Note ra file HTML
    function renderNotes() {
        const query = searchInput.value.toLowerCase().trim();
        let notes = Store.getNotes();

        // 1. Phân loại theo bộ lọc sidebar (all, pinned, trash)
        if (currentFilter === 'trash') {
            notes = notes.filter(n => n.isArchived);
        } else {
            notes = notes.filter(n => !n.isArchived); // Không bị xóa vào trash
            
            if (currentFilter === 'pinned') {
                notes = notes.filter(n => n.isPinned);
            }
        }

        // 2. Tìm kiếm realtime (Real-time search)
        if (query) {
            notes = notes.filter(n => 
                (n.title && n.title.toLowerCase().includes(query)) || 
                (n.content && n.content.toLowerCase().includes(query))
            );
        }

        // Xóa nội dung html cũ
        notesGrid.innerHTML = '';
        
        if (notes.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            // Xếp ghi chú ghim lên đầu nếu đang xem tab Tất cả
            if (currentFilter === 'all') {
                const pinnedNotes = notes.filter(n => n.isPinned);
                const unpinnedNotes = notes.filter(n => !n.isPinned);
                notes = [...pinnedNotes, ...unpinnedNotes]; // Cấu trúc mảng gồm pinned trước
            }

            // Vẽ từng ghi chú (Note Card)
            notes.forEach(note => {
                const card = document.createElement('div');
                card.className = 'note-card';
                card.style.backgroundColor = note.color;
                
                // Múi giờ
                const timeText = formatDate(note.updatedAt);
                
                // Nút chức năng tùy thuộc ở trong thùng rác hay không
                let actionBtnsHTML = '';
                if (currentFilter === 'trash') {
                    actionBtnsHTML = `
                        <button class="note-btn restore-btn" onclick="appRestoreNote('${note.id}', event)" title="Khôi phục"><i class="fa-solid fa-clock-rotate-left"></i></button>
                        <button class="note-btn delete-permanent-btn" style="color:red;" onclick="appDeleteNote('${note.id}', true, event)" title="Xóa vĩnh viễn"><i class="fa-solid fa-trash-can"></i></button>
                    `;
                } else {
                    const pinColor = note.isPinned ? 'var(--primary-color)' : 'var(--text-muted)';
                    actionBtnsHTML = `
                        <button class="note-btn pin-btn" style="color:${pinColor};" onclick="appTogglePin('${note.id}', event)" title="Ghim"><i class="fa-solid fa-thumbtack"></i></button>
                        <button class="note-btn delete-btn" onclick="appDeleteNote('${note.id}', false, event)" title="Xóa"><i class="fa-solid fa-trash"></i></button>
                    `;
                }

                // Gắn icon pin ở góc
                const pinIndicator = (note.isPinned && currentFilter !== 'trash') ? `<div class="icon-pin-indicator"><i class="fa-solid fa-thumbtack"></i></div>` : '';

                // Bố cục HTML ghi chú
                card.innerHTML = `
                    ${pinIndicator}
                    <div class="note-card-header">
                        <div class="note-title">${note.title ? note.title : '<em>(Không có tiêu đề)</em>'}</div>
                    </div>
                    <div class="note-content-preview">${note.content}</div>
                    <div class="note-footer">
                        <span class="note-date">${timeText}</span>
                        <div class="note-actions">
                            ${actionBtnsHTML}
                        </div>
                    </div>
                `;

                // Nhấn vào card để mở cửa sổ chi tiết (Modal)
                card.addEventListener('click', () => openNoteModal(note));

                notesGrid.appendChild(card);
            });
        }
    }

    // Các hàm này được gọi từ giao diện qua attribute onclick="" trong string template
    // Vì vậy phải bộc lộ biến ra window global
    window.appTogglePin = function(id, event) {
        event.stopPropagation(); // Ngăn sự kiện bấm vào card mở modal
        Store.togglePinNote(id);
        renderNotes();
    }

    window.appDeleteNote = function(id, permanent, event) {
        event.stopPropagation();
        const actionText = permanent ? "xóa vĩnh viễn" : "chuyển vào thùng rác";
        if (confirm(`Bạn có chắc chắn muốn ${actionText} ghi chú này không?`)) {
            Store.deleteNote(id, permanent);
            renderNotes();
            showToast(permanent ? "Đã xóa vĩnh viễn!" : "Đã chuyển vào thùng rác");
        }
    }

    window.appRestoreNote = function(id, event) {
        event.stopPropagation();
        Store.restoreNote(id);
        renderNotes();
        showToast("Đã khôi phục ghi chú!");
    }


    // ==================================================
    // 6. XỬ LÝ SỰ KIỆN SIDEBAR & TÌM KIẾM
    // ==================================================

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Cập nhật giao diện menu
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Xử lý logic lọc
            currentFilter = item.getAttribute('data-filter');
            currentFilterTitle.textContent = item.textContent;
            
            // Nếu dùng di động (hamburger) thì đóng sidebar lại khi chọn xong
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }

            renderNotes();
        });
    });

    // Real-time Search
    searchInput.addEventListener('input', () => {
        // Việc renderNotes đã lọc bằng filter() ở đầu hàm nên gõ là nhận
        renderNotes(); 
    });

    // Nút Menu điện thoại
    menuToggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
    });

    // Nút Đóng Menu
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });


    // ==================================================
    // 7. XỬ LÝ MODAL (CỬA SỔ COMPOSER)
    // ==================================================

    // Mở editor modal
    function openNoteModal(note = null) {
        modal.classList.remove('hidden');
        
        // Ràng buộc chỉ xem, không được sửa trong Thùng rác
        const isEditingTrash = (currentFilter === 'trash');
        saveNoteBtn.style.display = isEditingTrash ? 'none' : 'block';
        inputNoteTitle.disabled = isEditingTrash;
        inputNoteContent.disabled = isEditingTrash;

        // Reset bộ chọn màu
        colorDots.forEach(d => d.classList.remove('selected'));

        if (note) {
            // Chế độ Edit
            inputNoteId.value = note.id;
            inputNoteTitle.value = note.title;
            inputNoteContent.value = note.content;
            selectedColor = note.color;
            noteUpdatedTime.textContent = "Cập nhật lần cuối: " + formatDate(note.updatedAt);
            
            // Icon Pin 
            const isPinned = note.isPinned;
            pinModalBtn.innerHTML = isPinned ? '<i class="fa-solid fa-thumbtack"></i> Bỏ ghim' : '<i class="fa-solid fa-thumbtack"></i> Ghim';
            pinModalBtn.style.color = isPinned ? 'var(--primary-color)' : '';

            // Bật màu tương ứng
            const activeColorDot = document.querySelector(`.color-dot[data-color="${selectedColor}"]`);
            if (activeColorDot) activeColorDot.classList.add('selected');
            modal.querySelector('.modal-content').style.backgroundColor = selectedColor;

        } else {
            // Chế độ Create New
            inputNoteId.value = '';
            inputNoteTitle.value = '';
            inputNoteContent.value = '';
            selectedColor = '#ffffff'; // Mặc định trắng
            noteUpdatedTime.textContent = '';
            
            pinModalBtn.innerHTML = '<i class="fa-solid fa-thumbtack"></i> Ghim';
            pinModalBtn.style.color = '';
            
            const whiteDot = document.querySelector(`.color-dot[data-color="#ffffff"]`);
            if (whiteDot) whiteDot.classList.add('selected');
            modal.querySelector('.modal-content').style.backgroundColor = '#ffffff';

            inputNoteContent.focus(); // Đặt trỏ chuột nhanh
        }
    }

    // Đóng editor
    function closeNoteModal() {
        modal.classList.add('hidden');
    }

    newNoteBtn.addEventListener('click', () => {
        openNoteModal();
    });

    closeModalBtn.addEventListener('click', closeNoteModal);

    // Gán chức năng chọn màu trong editor
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            if (currentFilter === 'trash') return; // Không cho đổi trong trash

            colorDots.forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            selectedColor = dot.getAttribute('data-color');
            modal.querySelector('.modal-content').style.backgroundColor = selectedColor;
        });
    });

    // Toggle pin trực tiếp trong modal editor
    let tempPinStatus = false; // Trạng thái pin tạm thời cho thẻ mới
    pinModalBtn.addEventListener('click', () => {
        if (currentFilter === 'trash') return;

        const currentId = inputNoteId.value;
        if (currentId) {
            // Edit the existing note real quick
            Store.togglePinNote(currentId);
            const refNote = Store.getNoteById(currentId);
            const isPinned = refNote ? refNote.isPinned : false;
            pinModalBtn.innerHTML = isPinned ? '<i class="fa-solid fa-thumbtack"></i> Bỏ ghim' : '<i class="fa-solid fa-thumbtack"></i> Ghim';
            pinModalBtn.style.color = isPinned ? 'var(--primary-color)' : '';
            renderNotes();
        } else {
            // For a brand new note that hasn't been saved yet
            tempPinStatus = !tempPinStatus;
            pinModalBtn.innerHTML = tempPinStatus ? '<i class="fa-solid fa-thumbtack"></i> Bỏ ghim' : '<i class="fa-solid fa-thumbtack"></i> Ghim';
            pinModalBtn.style.color = tempPinStatus ? 'var(--primary-color)' : '';
        }
    });

    // Nút Lưu Ghi chú
    saveNoteBtn.addEventListener('click', () => {
        const titleText = inputNoteTitle.value.trim();
        const contentText = inputNoteContent.value.trim();
        const idVal = inputNoteId.value;

        if (!contentText && !titleText) {
            alert("Nội dung không được để trống!");
            return;
        }

        const isPinnedVal = idVal ? Store.getNoteById(idVal).isPinned : tempPinStatus;

        Store.saveNote({
            id: idVal ? idVal : undefined,
            title: titleText,
            content: contentText,
            color: selectedColor,
            isPinned: isPinnedVal
        });

        tempPinStatus = false; // Reset temporary setting
        closeNoteModal();
        renderNotes();
        showToast("Đã lưu ghi chú!");
    });


    // ==================================================
    // KHỞI CHẠY APP
    // ==================================================
    initApp();

});
