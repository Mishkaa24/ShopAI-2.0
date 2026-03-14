// ==========================
// 🔔 TOAST NOTIFICATIONS
// ==========================
function showToast(title, message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            toast.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

// ==========================
// 📦 LOCAL STORAGE CART
// ==========================

function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
  localStorage.setItem("cart", JSON.stringify(cart));
}


// ==========================
// 🔄 UPDATE CART COUNTER
// ==========================
function updateCartCounter() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const cartLinks = document.querySelectorAll('.cart');
  cartLinks.forEach(link => {
    if (totalItems > 0) {
      link.innerHTML = `🛒 Кошик (${totalItems})`;
    } else {
      link.innerHTML = '🛒 Кошик';
    }
  });
}

// ==========================
// 🛒 ДОДАТИ В КОШИК
// ==========================
function addToCart(productTitle, buttonId){

  const product = products.find(p => p.title === productTitle);

  if (!product) {
    showToast('Помилка', 'Товар не знайдено!', 'error');
    return;
  }

  let cart = getCart();

  const existing = cart.find(item => item.title === productTitle);

  if(existing){
    existing.quantity++;
  }else{
    cart.push({
      title: product.title,
      price: product.price,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCounter();
  
  showAddToCartToast(productTitle);
  
  if (buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      const originalText = btn.textContent;
      const originalBg = btn.style.background;
      
      btn.textContent = '✓ Додано!';
      btn.style.background = '#4caf50';
      btn.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.style.transform = 'scale(1)';
      }, 2000);
    }
  }
}

// ==========================
// 📦 ADD TO CART TOAST WITH BUTTONS
// ==========================
function showAddToCartToast(productTitle) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast success';
  
  toast.innerHTML = `
    <div class="toast-icon">✓</div>
    <div class="toast-content">
      <div class="toast-title">Додано до кошика!</div>
      <div class="toast-message">${productTitle}</div>
      <div class="toast-actions">
        <button class="toast-btn toast-btn-confirm" onclick="window.location.href='cart.html'">Переглянути кошик</button>
      </div>
    </div>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
          container.remove();
        }
      }, 300);
    }
  }, 5000);
}


// ==========================
// 🧩 ВІДМАЛЬОВКА КОШИКА
// ==========================
function renderCart(){

  const container = document.getElementById("cartItems");
  const totalBlock = document.getElementById("totalPrice");
  const itemsCountBlock = document.getElementById("itemsCount");
  const deliveryBlock = document.getElementById("deliveryPrice");

  if(!container) return;

  let cart = getCart();

  container.innerHTML = "";

  if(cart.length === 0){
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Ваш кошик порожній</h3>
        <p>Додайте товари, щоб продовжити покупки</p>
        <a href="index.html" class="continue-shopping-btn">Продовжити покупки</a>
      </div>
    `;
    if(totalBlock) totalBlock.innerHTML = "0 грн";
    if(itemsCountBlock) itemsCountBlock.innerHTML = "0 шт.";
    if(deliveryBlock) deliveryBlock.innerHTML = "—";
    return;
  }

  let total = 0;
  let itemsCount = 0;

  cart.forEach((item, index) => {

    total += item.price * item.quantity;
    itemsCount += item.quantity;

    const product = products.find(p => p.title === item.title);
    const imageUrl = product ? product.image : '';
    const description = product ? product.description : '';

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${imageUrl}" alt="${item.title}">
      </div>
      
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.title}</h3>
        <p class="cart-item-description">${description}</p>
      </div>
      
      <div class="cart-item-actions">
        <div class="qty-controls">
          <button onclick="changeQty('${item.title}', -1)" aria-label="Зменшити кількість">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.title}', 1)" aria-label="Збільшити кількість">+</button>
        </div>
        
        <button class="remove-btn" onclick="removeItem('${item.title}')" title="Видалити">
          🗑
        </button>
      </div>
      
      <div class="cart-item-price-section">
        <p class="cart-item-price">${item.price * item.quantity} грн</p>
      </div>
    `;

    container.appendChild(cartItem);
  });

  if(totalBlock) totalBlock.innerHTML = `${total} грн`;
  if(itemsCountBlock) itemsCountBlock.innerHTML = `${itemsCount} шт.`;
  
  if(deliveryBlock) {
    if(total >= 500) {
      deliveryBlock.innerHTML = "Безкоштовно";
      deliveryBlock.style.color = "#4caf50";
    } else {
      deliveryBlock.innerHTML = `${500 - total} грн до безкоштовної доставки`;
      deliveryBlock.style.color = "#ff9800";
    }
  }
}


// ==========================
// 💳 CHECKOUT FUNCTION
// ==========================
function checkout(){
  const cart = getCart();
  
  if(cart.length === 0){
    showToast('Кошик порожній', 'Додайте товари перед оформленням замовлення', 'error');
    return;
  }
  
  window.location.href = 'success.html';
}


// ==========================
// ➕➖ ЗМІНА КІЛЬКОСТІ
// ==========================
function changeQty(title, amount){

  let cart = getCart();

  const item = cart.find(i => i.title === title);

  item.quantity += amount;

  if(item.quantity <= 0){
    cart = cart.filter(i => i.title !== title);
  }

  saveCart(cart);
  updateCartCounter();
  renderCart();
}


// ==========================
// ❌ ВИДАЛИТИ ОДИН ТОВАР
// ==========================
function removeItem(title){

  let cart = getCart();

  cart = cart.filter(item => item.title !== title);

  saveCart(cart);
  updateCartCounter();
  renderCart();
}


// ==========================
// 🧹 ОЧИСТИТИ КОШИК
// ==========================
function clearCart(){
  const cart = getCart();
  
  if(cart.length === 0){
    showToast('Кошик вже порожній', '', 'info');
    return;
  }
  
  const container = document.querySelector('.toast-container') || (() => {
    const c = document.createElement('div');
    c.className = 'toast-container';
    document.body.appendChild(c);
    return c;
  })();
  
  const toast = document.createElement('div');
  toast.className = 'toast info';
  
  toast.innerHTML = `
    <div class="toast-icon">⚠</div>
    <div class="toast-content">
      <div class="toast-title">Очистити кошик?</div>
      <div class="toast-message">Всі товари будуть видалені</div>
      <div class="toast-actions">
        <button class="toast-btn toast-btn-cancel" onclick="this.closest('.toast').remove()">Скасувати</button>
        <button class="toast-btn toast-btn-confirm" onclick="confirmClearCart(this)">Очистити</button>
      </div>
    </div>
  `;
  
  container.appendChild(toast);
}

function confirmClearCart(button){
  button.closest('.toast').remove();
  
  localStorage.removeItem("cart");
  updateCartCounter();
  renderCart();
  
  showToast('Кошик очищено', '', 'success');
}


// ==========================
// 📦 МАСИВ ТОВАРІВ
// ==========================
const products = [

  // ⭐ ПОПУЛЯРНІ ТОВАРИ
  {
    title: "Навушники AirPods Pro 3",
    price: 4500,
    description: "Високоякісні бездротові навушники.",
    image: "images/headphones.png",
    section: "tech",
    popular: true
  },
  {
    title: "Куртка зимова",
    price: 3200,
    description: "Тепла та стильна.",
    image: "images/jacket.png",
    section: "clothes",
    popular: true
  },

  // 🔌 ТЕХНІКА
  {
    title: "Apple Watch Series 10",
    price: 12000,
    description: "Смарт-годинник нового покоління.",
    image: "images/applewatch.png",
    section: "tech",
    popular: false
  },
  {
    title: "Razer Huntsman V3 Pro",
    price: 4500,
    description: "Ігрова механічна клавіатура з RGB.",
    image: "images/keyboard.png",
    section: "tech",
    popular: false
  },

  // 👕 ОДЯГ
  {
    title: "Футболка",
    price: 450,
    description: "Комфортна бавовняна футболка.",
    image: "images/t-shirt.png",
    section: "clothes",
    popular: false
  },
  {
    title: "Джинси",
    price: 1200,
    description: "Класичні джинси.",
    image: "images/jeans.png",
    section: "clothes",
    popular: false
  },

  // 🧸 ІГРАШКИ
  {
    title: "Машинка",
    price: 250,
    description: "Міні гоночна машинка.",
    image: "images/toycar.png",
    section: "toys",
    popular: false
  },
  {
    title: "Лялька",
    price: 450,
    description: "М'яка дитяча лялька.",
    image: "images/doll.png",
    section: "toys",
    popular: false
  },
  {
    title: "Конструктор LEGO",
    price: 1200,
    description: "Конструктор для розвитку уяви.",
    image: "images/lego.jpg",
    section: "toys",
    popular: false
  },

  // 📚 КНИГИ
  {
    title: "Таємниці Всесвіту",
    price: 250,
    description: "Книга про космос.",
    image: "images/book1.jpg",
    section: "books",
    popular: false
  },
  {
    title: "Мистецтво програмування",
    price: 320,
    description: "Гід по програмуванню.",
    image: "images/book2.jpg",
    section: "books",
    popular: false
  },
  {
    title: "Фантастичні пригоди",
    price: 280,
    description: "Захоплива фантастика.",
    image: "images/book3.jpg",
    section: "books",
    popular: false
  }
];


// ==========================
// 🧩 ФУНКЦІЯ РЕНДЕРУ КАРТОК
// ==========================
function renderProducts(productsArray, containerId, cardClass) {

    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    container.innerHTML = "";

    productsArray.forEach((product, index) => {

        const card = document.createElement("div");
        card.classList.add(cardClass);
        
        const buttonId = `btn-${containerId}-${index}`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p><strong>Ціна: ${product.price} грн</strong></p>
            <button id="${buttonId}" onclick="addToCart('${product.title}', '${buttonId}')">
                Додати до кошика
            </button>
        `;

        container.appendChild(card);
    });
}


// ==========================
// 📋 CHECKOUT & SUCCESS PAGE LOGIC
// ==========================

function displayCheckoutSummary() {
    const cart = getCart();
    const itemsContainer = document.getElementById('orderItems');
    const itemsCount = document.getElementById('summaryItemsCount');
    const totalElement = document.getElementById('summaryTotal');
    
    if (!itemsContainer) return;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    let total = 0;
    let count = 0;
    
    itemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        const product = products.find(p => p.title === item.title);
        const imageUrl = product ? product.image : '';
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-item-image">
                <img src="${imageUrl}" alt="${item.title}">
            </div>
            <div class="order-item-details">
                <p class="order-item-name">${item.title}</p>
                <p class="order-item-qty">${item.quantity} шт.</p>
            </div>
            <div class="order-item-price">${item.price * item.quantity} грн</div>
        `;
        itemsContainer.appendChild(orderItem);
    });
    
    if (itemsCount) itemsCount.textContent = `${count} шт.`;
    if (totalElement) totalElement.textContent = `${total} грн`;
}

function validateCheckoutForm(formData) {
    let isValid = true;
    const errors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
        errors.fullName = "Введіть ваше повне ім'я";
        isValid = false;
    }
    
    const phoneRegex = /^(\+?380|0)\d{9}$/;
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
        errors.phone = "Введіть коректний номер телефону (+380XXXXXXXXX)";
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.email = "Введіть коректну email адресу";
        isValid = false;
    }
    
    if (!formData.deliveryMethod) {
        errors.deliveryMethod = "Оберіть спосіб доставки";
        isValid = false;
    }
    
    if (!formData.city || formData.city.trim().length < 2) {
        errors.city = "Введіть назву міста";
        isValid = false;
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
        errors.address = "Введіть повну адресу доставки";
        isValid = false;
    }
    
    const postalRegex = /^\d{5}$/;
    if (!postalRegex.test(formData.postalCode)) {
        errors.postalCode = "Введіть коректний поштовий індекс (5 цифр)";
        isValid = false;
    }
    
    if (!formData.paymentMethod) {
        errors.paymentMethod = "Оберіть спосіб оплати";
        isValid = false;
    }
    
    return { isValid, errors };
}

function displayCheckoutErrors(errors) {
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    document.querySelectorAll('.form-group input, .form-group select').forEach(el => {
        el.classList.remove('error');
    });
    
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        const inputElement = document.getElementById(field);
        
        if (errorElement) {
            errorElement.textContent = errors[field];
            errorElement.classList.add('show');
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    });
}

function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        fullName: form.fullName.value,
        phone: form.phone.value,
        email: form.email.value,
        deliveryMethod: form.deliveryMethod.value,
        city: form.city.value,
        address: form.address.value,
        postalCode: form.postalCode.value,
        paymentMethod: form.paymentMethod.value,
        comments: form.comments.value
    };
    
    const validation = validateCheckoutForm(formData);
    
    if (!validation.isValid) {
        displayCheckoutErrors(validation.errors);
        const firstError = document.querySelector('.error-message.show');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    const cart = getCart();
    
    const order = {
        orderNumber: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: formData,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    displaySuccessView(order);
    
    localStorage.removeItem('cart');
}

function displaySuccessView(order) {
    document.getElementById('checkoutView').style.display = 'none';
    
    const successView = document.getElementById('successView');
    successView.style.display = 'block';
    
    const headerLink = document.getElementById('headerCartLink');
    if (headerLink) {
        headerLink.href = 'index.html';
        headerLink.innerHTML = '🏠 Головна';
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.getElementById('orderNumber').textContent = order.orderNumber;
    document.getElementById('customerName').textContent = order.customer.fullName;
    document.getElementById('customerPhone').textContent = order.customer.phone;
    document.getElementById('customerEmail').textContent = order.customer.email;
    
    const deliveryMethods = {
        'nova-poshta': 'Нова Пошта',
        'ukrposhta': 'Укрпошта',
        'courier': 'Кур\'єр'
    };
    document.getElementById('deliveryMethodDisplay').textContent = deliveryMethods[order.customer.deliveryMethod] || order.customer.deliveryMethod;
    
    const address = `${order.customer.address}, ${order.customer.city}, ${order.customer.postalCode}`;
    document.getElementById('deliveryAddress').textContent = address;
    
    const paymentMethods = {
        'cash': 'Готівкою при отриманні',
        'card': 'Картою онлайн',
        'bank-transfer': 'Банківський переказ'
    };
    document.getElementById('paymentMethodDisplay').textContent = paymentMethods[order.customer.paymentMethod] || order.customer.paymentMethod;
    
    const itemsContainer = document.getElementById('successOrderItems');
    itemsContainer.innerHTML = '';
    
    order.items.forEach(item => {
        const product = products.find(p => p.title === item.title);
        const imageUrl = product ? product.image : '';
        
        const orderItem = document.createElement('div');
        orderItem.className = 'success-order-item';
        orderItem.innerHTML = `
            <div class="success-item-image">
                <img src="${imageUrl}" alt="${item.title}">
            </div>
            <div class="success-item-details">
                <p class="success-item-name">${item.title}</p>
                <p class="success-item-qty">${item.quantity} × ${item.price} грн</p>
            </div>
            <div class="success-item-price">${item.price * item.quantity} грн</div>
        `;
        itemsContainer.appendChild(orderItem);
    });
    
    document.getElementById('orderTotal').textContent = `${order.total} грн`;
}


// ==========================
// 🔄 INITIALIZE ON PAGE LOAD
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    
    // Setup dropdown menu toggle
    const dropdown = document.querySelector('.dropdown');
    const dropbtn = document.querySelector('.dropbtn');
    
    if (dropdown && dropbtn) {
        dropbtn.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
        
        window.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // ✅ FIX: Render cart only when the cart container exists (cart.html)
    if (document.getElementById('cartItems')) {
        renderCart();
    }

    // ✅ FIX: Initialize checkout page by detecting the form, not the URL
    // This works reliably whether opened via file://, localhost, or a server
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        displayCheckoutSummary();
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);

        const inputs = document.querySelectorAll('.form-group input, .form-group select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                const errorElement = document.getElementById(`${input.name}Error`);
                if (errorElement) {
                    errorElement.classList.remove('show');
                    input.classList.remove('error');
                }
            });
        });
    }

    // ✅ FIX: Only render product grids when those containers exist (index.html)
    if (document.getElementById('popularProducts')) {
        renderProducts(
            products.filter(p => p.popular === true),
            "popularProducts",
            "popular-card"
        );
        renderProducts(
            products.filter(p => p.section === "tech"),
            "techProducts",
            "product-card"
        );
        renderProducts(
            products.filter(p => p.section === "clothes"),
            "clothesProducts",
            "product-card"
        );
        renderProducts(
            products.filter(p => p.section === "toys"),
            "toysProducts",
            "product-card"
        );
        renderProducts(
            products.filter(p => p.section === "books"),
            "booksProducts",
            "product-card"
        );
    }
});

// Update counter on storage change (multiple tabs)
window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCounter();
    }
});