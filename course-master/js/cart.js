/* Cart Logic */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('#cart_count');
    cartCountElements.forEach(el => {
        el.innerText = cart.length;
    });
}

function addToCartById(id, title, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists
    const exists = cart.find(item => item.id === id);
    if (exists) {
        alert('Khóa học "' + title + '" đã có trong giỏ hàng!');
        return;
    }

    cart.push({ id: id, title: title, price: price, img: img });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Custom event to notify other parts of the app if needed
    window.dispatchEvent(new Event('cartUpdated'));

    alert('Đã thêm "' + title + '" vào giỏ hàng!');
}

// Generic handler for buttons with data attributes
function handleAddToCart(btn) {
    const id = btn.getAttribute('data-id');
    const title = btn.getAttribute('data-title');
    const price = btn.getAttribute('data-price');
    const img = btn.getAttribute('data-img');

    if (id && title && price) {
        addToCartById(id, title, price, img);
    }
}

// Sync cart count across tabs
window.addEventListener('storage', function (e) {
    if (e.key === 'cart') {
        updateCartCount();
    }
});

$(document).ready(function () {
    updateCartCount();
});

