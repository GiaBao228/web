document.addEventListener('DOMContentLoaded', function () {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('login_btn');
    const closeBtns = document.querySelectorAll('.auth-close');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    // Modal Toggling
    if (loginBtn) {
        loginBtn.onclick = () => loginModal.style.display = 'block';
    }

    closeBtns.forEach(btn => {
        btn.onclick = () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        };
    });

    if (switchToRegister) {
        switchToRegister.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'block';
        };
    }

    if (switchToLogin) {
        switchToLogin.onclick = (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'block';
        };
    }

    window.onclick = (event) => {
        if (event.target == loginModal) loginModal.style.display = 'none';
        if (event.target == registerModal) registerModal.style.display = 'none';
    };

    // Registration Logic
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.onsubmit = async function (e) {
            e.preventDefault();
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const formData = new FormData(registerForm);
            const email = formData.get('email');

            submitBtn.disabled = true;
            submitBtn.innerText = 'Đang kiểm tra...';

            try {
                // 1. Kiểm tra email tồn tại trước
                const checkRes = await fetch(`${scriptURL}?type=check_email&email=${encodeURIComponent(email)}`);
                const checkData = await checkRes.json();

                if (checkData.exists) {
                    showToast('Email này đã được đăng ký!', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Đăng ký';
                    return;
                }

                // 2. Nếu chưa tồn tại thì tiến hành đăng ký
                formData.append('type', 'register');
                formData.append('role', 'user');

                if (typeof submitToGoogleSheets === 'function') {
                    submitToGoogleSheets(
                        formData,
                        submitBtn,
                        'Đăng ký tài khoản thành công!',
                        () => {
                            registerModal.style.display = 'none';
                            loginModal.style.display = 'block';
                            registerForm.reset();
                        }
                    );
                }
            } catch (error) {
                console.error('Lỗi đăng ký:', error);
                showToast('Có lỗi xảy ra, vui lòng thử lại!', 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng ký';
            }
        };
    }

    // Login Logic (Real check with Google Sheets)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async function (e) {
            e.preventDefault();
            const email = document.getElementById('login_email').value;
            const pass = document.getElementById('login_password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            submitBtn.disabled = true;
            submitBtn.innerText = 'Đang xác thực...';

            try {
                const response = await fetch(`${scriptURL}?type=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`);
                const data = await response.json();

                if (data.result === 'success') {
                    localStorage.setItem('userRole', data.role || 'user');
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', data.name || email.split('@')[0]);

                    showToast(`Chào mừng ${data.name || 'bạn'} quay trở lại!`, 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    showToast(data.message || 'Tài khoản hoặc mật khẩu không đúng!', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerText = 'Đăng nhập';
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                showToast('Không thể kết nối máy chủ!', 'error');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Đăng nhập';
            }
        };
    }

    // Check Login Status
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail && loginBtn) {
        const userName = localStorage.getItem('userName') || userEmail.split('@')[0];
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
        loginBtn.onclick = () => {
            if (confirm('Bạn có muốn đăng xuất?')) {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                window.location.reload();
            }
        };
    }
});
