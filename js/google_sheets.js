const scriptURL = 'https://script.google.com/macros/s/AKfycbzDbN3W23_iHxj7zrm25tpleyuIK6xX_b2jqXY3eN0_YC37ldA625wfKZXKn0CSKwy8/exec';

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastMessage = document.getElementById('toast-message');
    const overlay = document.getElementById('toast-overlay');

    if (!toast || !toastIcon || !toastMessage || !overlay) {
        console.error('Toast elements not found');
        alert(message);
        return;
    }

    toastMessage.innerText = message;

    if (type === 'success') {
        toast.style.borderLeft = '5px solid #2ecc71';
        toastIcon.className = 'fas fa-check-circle';
        toastIcon.style.color = '#2ecc71';
    } else {
        toast.style.borderLeft = '5px solid #e74c3c';
        toastIcon.className = 'fas fa-exclamation-circle';
        toastIcon.style.color = '#e74c3c';
    }

    overlay.classList.add('active');
    toast.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
        toast.classList.remove('active');
    }, 3000);
}

/**
 * Centralized function to submit form data to Google Sheets
 * @param {FormData} formData - The data to submit
 * @param {HTMLElement} submitBtn - The button to disable/enable
 * @param {string} successMsg - Message to show on success
 * @param {function} callback - Optional function to run on success
 */
function submitToGoogleSheets(formData, submitBtn, successMsg, callback) {
    if (submitBtn) {
        submitBtn.disabled = true;
        // Lưu lại text gốc nếu chưa có
        if (!submitBtn.getAttribute('data-original-text')) {
            submitBtn.setAttribute('data-original-text', submitBtn.innerText);
        }
        submitBtn.innerText = 'Đang xử lý...';
    }

    fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
        cache: 'no-cache'
    })
        .then(() => {
            // Với no-cors, nếu vào được .then nghĩa là yêu cầu đã được gửi đi thành công
            showToast(successMsg, 'success');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = submitBtn.getAttribute('data-original-text') || 'Gửi';
            }
            if (callback) callback();
        })
        .catch(error => {
            // Nếu vào .catch nghĩa là có lỗi mạng thực sự (mất kết nối, URL sai, hoặc bị chặn)
            console.error('Google Sheets Error:', error);
            showToast('Không thể gửi dữ liệu. Vui lòng kiểm tra kết nối mạng!', 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = submitBtn.getAttribute('data-original-text') || 'Gửi';
            }
        });
}