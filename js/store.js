/**
 * =======================================================
 * LỚP DỮ LIỆU (DATA STORE)
 * File này chỉ xử lý đọc/ghi từ LocalStorage, SessionStorage
 * =======================================================
 */

const Store = {
    // ---- HỆ THỐNG TÀI KHOẢN (AUTH) ----
    
    // Lấy thông tin user hiện đang đăng nhập từ Session Storage
    getCurrentUser() {
        return sessionStorage.getItem('currentUser');
    },

    // Kiểm tra đã đăng nhập chưa
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    },

    // Xử lý Đăng ký
    register(username, password) {
        // Lấy db users, nếu chưa có thì mảng rỗng
        let users = JSON.parse(localStorage.getItem('users_db') || '[]');
        
        // Kiểm tra xem user đã tồn tại chưa
        const userExists = users.some(u => u.username === username);
        if (userExists) {
            return { success: false, message: 'Tên đăng nhập đã tồn tại.' };
        }

        // Tạo user mới
        const newUser = {
            username: username,
            password: password, // Chú ý: thực tế cần băm (hash), đây là text thuần
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users_db', JSON.stringify(users));
        
        return { success: true, message: 'Đăng ký thành công! Hãy đăng nhập.' };
    },

    // Xử lý Đăng nhập
    login(username, password) {
        let users = JSON.parse(localStorage.getItem('users_db') || '[]');
        
        // Tìm user khớp usename & mật khẩu
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Lưu trạng thái đăng nhập vào session
            sessionStorage.setItem('currentUser', username);
            return { success: true };
        } else {
            return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu.' };
        }
    },

    // Xử lý Đăng xuất
    logout() {
        sessionStorage.removeItem('currentUser');
    },


    // ---- QUẢN LÝ GHI CHÚ (NOTES CRUD) ----

    // Lấy tất cả Note từ DB (chưa lọc)
    _getAllNotesDB() {
        return JSON.parse(localStorage.getItem('notes_db') || '[]');
    },

    // Lấy danh sách ghi chú CỦA USER HIỆN TẠI đang đăng nhập
    getNotes() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return [];

        const allNotes = this._getAllNotesDB();
        // Dùng filter để lọc ra ghi chú có owner trùng với user đang đăng nhập
        return allNotes
                .filter(note => note.owner === currentUser)
                // Sắp xếp mới nhất lên đầu
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); 
    },

    // Lấy 1 ghi chú theo ID
    getNoteById(id) {
        const notes = this.getNotes(); // Chỉ lấy trong tập note của user này
        return notes.find(n => n.id === id);
    },

    // Lưu hoặc Cập nhật ghi chú
    saveNote(noteData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;

        let allNotes = this._getAllNotesDB();
        
        if (noteData.id) {
            // Chỉnh sửa nhánh đã có (Update)
            const index = allNotes.findIndex(n => n.id === noteData.id && n.owner === currentUser);
            if (index !== -1) {
                // Giữ lại các trường cũ, ghi đè trường mới, cập nhật updatedAt
                allNotes[index] = { 
                    ...allNotes[index], 
                    ...noteData, 
                    updatedAt: new Date().toISOString() 
                };
            }
        } else {
            // Tạo mới hoàn toàn (Create)
            const newNote = {
                id: 'note_' + Date.now().toString(),
                owner: currentUser,
                title: noteData.title || '',
                content: noteData.content || '',
                color: noteData.color || '#ffffff',
                tags: noteData.tags || [],
                isPinned: noteData.isPinned || false,
                isArchived: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            allNotes.push(newNote);
        }

        // Lưu lại DB
        localStorage.setItem('notes_db', JSON.stringify(allNotes));
        return true;
    },

    // Chuyển thùng rác / Xóa vĩnh viễn (Trash / Delete)
    deleteNote(id, permanent = false) {
        const currentUser = this.getCurrentUser();
        let allNotes = this._getAllNotesDB();
        
        const index = allNotes.findIndex(n => n.id === id && n.owner === currentUser);
        if (index === -1) return false;

        if (permanent) {
            // Xóa mất luôn
            allNotes.splice(index, 1);
        } else {
            // Đẩy vào thùng rác (isArchived = true)
            allNotes[index].isArchived = true;
            allNotes[index].updatedAt = new Date().toISOString();
        }

        localStorage.setItem('notes_db', JSON.stringify(allNotes));
        return true;
    },

    // Khôi phục từ thùng rác
    restoreNote(id) {
        const currentUser = this.getCurrentUser();
        let allNotes = this._getAllNotesDB();
        
        const index = allNotes.findIndex(n => n.id === id && n.owner === currentUser);
        if (index !== -1) {
            allNotes[index].isArchived = false;
            allNotes[index].updatedAt = new Date().toISOString();
            localStorage.setItem('notes_db', JSON.stringify(allNotes));
            return true;
        }
        return false;
    },

    // Ghim / Bỏ ghim (Toggle Pin)
    togglePinNote(id) {
        const currentUser = this.getCurrentUser();
        let allNotes = this._getAllNotesDB();
        
        const index = allNotes.findIndex(n => n.id === id && n.owner === currentUser);
        if (index !== -1) {
            allNotes[index].isPinned = !allNotes[index].isPinned;
            allNotes[index].updatedAt = new Date().toISOString();
            localStorage.setItem('notes_db', JSON.stringify(allNotes));
            return true;
        }
        return false;
    }
};
