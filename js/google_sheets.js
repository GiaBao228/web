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
