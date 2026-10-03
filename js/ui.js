import { CONFIG, PRODUCTS, formatPrice } from './data.js';
import * as Cart from './cart.js';

// ========== SVG Icons ==========
export const FLOWER_SVG = `<svg class="flower-emblem" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="16" cy="10" r="7" fill="currentColor" opacity="0.8"/>
  <circle cx="16" cy="22" r="7" fill="currentColor" opacity="0.8"/>
  <circle cx="10" cy="16" r="7" fill="currentColor" opacity="0.8"/>
  <circle cx="22" cy="16" r="7" fill="currentColor" opacity="0.8"/>
  <circle cx="16" cy="16" r="3" fill="var(--ivory, #FFF9F2)"/>
</svg>`;

export const CART_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
  <line x1="3" y1="6" x2="21" y2="6"/>
  <path d="M16 10a4 4 0 01-8 0"/>
</svg>`;

const CLOSE_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="2" y1="2" x2="14" y2="14"/><line x1="14" y1="2" x2="2" y2="14"/></svg>`;

const ARROW_LEFT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>`;
const ARROW_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 6 15 12 9 18"/></svg>`;

const CHECK_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 8 7 12 13 4"/></svg>`;

// ========== Render Product Card ==========
export function renderProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card reveal';
  card.dataset.category = product.category;
  card.dataset.productId = product.id;

  const hasPrice = product.price !== null && product.price !== undefined;
  
  card.innerHTML = `
    <div class="product-card__image-wrap" role="button" tabindex="0" aria-label="View larger image of ${product.name}">
      <img src="${product.image}" alt="${product.name} — handcrafted dessert cup by Chera Patisserie" loading="lazy" width="280" height="280">
    </div>
    <div class="product-card__body">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <span class="flavor-dot" style="background:${product.accentColor}"></span>
        <h3 class="product-card__name">${product.name}</h3>
      </div>
      <p class="product-card__desc">${product.description}</p>
      <p class="product-card__price">${hasPrice ? formatPrice(product.price) : 'Price on request'}</p>
      <div class="product-card__actions">
        ${hasPrice ? `
          <div class="qty-stepper">
            <button type="button" class="qty-minus" aria-label="Decrease quantity" disabled>−</button>
            <span class="qty-stepper__value" aria-live="polite">1</span>
            <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
          </div>
          <button type="button" class="btn-primary btn-add-cart" data-product-id="${product.id}">
            Add to cart
          </button>
        ` : `
          <button type="button" class="btn-secondary btn-ask-store">
            Ask in store
          </button>
        `}
      </div>
    </div>
  `;

  // Quantity stepper logic
  if (hasPrice) {
    const qtyValue = card.querySelector('.qty-stepper__value');
    const minusBtn = card.querySelector('.qty-minus');
    const plusBtn = card.querySelector('.qty-plus');
    let qty = 1;

    minusBtn.addEventListener('click', () => {
      if (qty > 1) { qty--; qtyValue.textContent = qty; }
      minusBtn.disabled = qty <= 1;
    });
    plusBtn.addEventListener('click', () => {
      if (qty < 20) { qty++; qtyValue.textContent = qty; }
      minusBtn.disabled = qty <= 1;
    });

    // Add to cart
    const addBtn = card.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', () => {
      Cart.addToCart(product, null, qty);
      // Visual feedback
      addBtn.classList.remove('btn-primary');
      addBtn.classList.add('btn-added');
      addBtn.innerHTML = `${CHECK_SVG} Added`;
      setTimeout(() => {
        addBtn.classList.remove('btn-added');
        addBtn.classList.add('btn-primary');
        addBtn.textContent = 'Add to cart';
        qty = 1;
        qtyValue.textContent = '1';
        minusBtn.disabled = true;
      }, 1800);
    });
  }

  // Quick-view on image click
  const imageWrap = card.querySelector('.product-card__image-wrap');
  imageWrap.addEventListener('click', () => openQuickView(product));
  imageWrap.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openQuickView(product); }
  });

  return card;
}

// ========== Quick View Modal ==========
function openQuickView(product) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('quick-view-modal');
  const hasPrice = product.price !== null;
  
  modal.innerHTML = `
    <button class="modal__close" aria-label="Close">${CLOSE_SVG}</button>
    <img src="${product.image}" alt="${product.name}" style="width:100%;border-radius:var(--radius-md);margin-bottom:20px">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span class="flavor-dot" style="background:${product.accentColor}"></span>
      <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--burgundy)">${product.name}</h3>
    </div>
    <p style="color:var(--chocolate);line-height:1.6;margin-bottom:12px">${product.description}</p>
    <p style="font-family:var(--font-display);font-size:1.25rem;color:var(--raspberry);margin-bottom:20px">
      ${hasPrice ? formatPrice(product.price) : 'Price on request'}
    </p>
    ${hasPrice ? `<button class="btn-primary btn-add-cart-modal" style="width:100%">Add to cart</button>` 
               : `<button class="btn-secondary" style="width:100%">Ask in store</button>`}
  `;

  overlay.classList.add('is-active');
  modal.classList.add('is-active');
  document.body.classList.add('body-scroll-lock');

  // Close handlers
  const closeBtn = modal.querySelector('.modal__close');
  const closeModal = () => {
    overlay.classList.remove('is-active');
    modal.classList.remove('is-active');
    document.body.classList.remove('body-scroll-lock');
  };
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal, { once: true });

  // Escape key
  const escHandler = (e) => { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); } };
  document.addEventListener('keydown', escHandler);

  // Add to cart from modal
  if (hasPrice) {
    modal.querySelector('.btn-add-cart-modal').addEventListener('click', () => {
      Cart.addToCart(product, null, 1);
      closeModal();
    });
  }
}

// ========== Cart Drawer ==========
export function renderCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const items = Cart.getCart();
  const isEmpty = items.length === 0;

  const bodyHTML = isEmpty ? `
    <div style="text-align:center;padding:40px 0">
      <div style="color:var(--blush);margin-bottom:16px">${FLOWER_SVG.replace('width="32" height="32"', 'width="48" height="48"').replace('class="flower-emblem"', 'class="flower-emblem" style="width:48px;height:48px;color:var(--blush)"')}</div>
      <p style="font-family:var(--font-display);font-size:1.25rem;color:var(--burgundy);margin-bottom:8px">Your box is empty.</p>
      <p style="color:var(--chocolate);margin-bottom:20px">Let's fix that.</p>
      <a href="#menu" class="btn-primary" onclick="document.getElementById('cart-drawer').classList.remove('is-open');document.getElementById('cart-overlay').classList.remove('is-active');document.body.classList.remove('body-scroll-lock');">Explore the menu</a>
    </div>
  ` : `
    <div class="cart-items">
      ${items.map(item => `
        <div class="cart-item" data-cart-key="${item.productId}${item.flavor ? '__' + item.flavor : ''}">
          <img class="cart-item__thumb" src="${item.image}" alt="${item.name}" width="64" height="64">
          <div>
            <p class="cart-item__name">${item.name}</p>
            ${item.flavor ? `<p class="cart-item__flavor">${item.flavor}</p>` : ''}
            <div class="qty-stepper" style="margin-top:8px">
              <button type="button" class="cart-qty-minus" data-id="${item.productId}" data-flavor="${item.flavor || ''}" aria-label="Decrease">−</button>
              <span class="qty-stepper__value">${item.quantity}</span>
              <button type="button" class="cart-qty-plus" data-id="${item.productId}" data-flavor="${item.flavor || ''}" aria-label="Increase">+</button>
            </div>
            <button type="button" class="cart-item__remove" data-id="${item.productId}" data-flavor="${item.flavor || ''}">Remove</button>
          </div>
          <span class="cart-item__price">${formatPrice((item.price || 0) * item.quantity)}</span>
        </div>
      `).join('')}
    </div>

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--blush)">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:0.9375rem;color:var(--chocolate)">
        <input type="checkbox" id="gift-toggle" ${Cart.isGiftPackaging() ? 'checked' : ''} style="accent-color:var(--raspberry);width:18px;height:18px">
        Gift packaging ${CONFIG.GIFT_BOX_PRICE === 0 ? '(Complimentary)' : formatPrice(CONFIG.GIFT_BOX_PRICE)}
      </label>
      <div id="gift-message-wrap" style="${Cart.isGiftPackaging() ? '' : 'display:none;'}margin-top:12px">
        <textarea class="form-input" id="gift-message-input" placeholder="Add a gift message (optional)" rows="2">${Cart.getGiftMessage()}</textarea>
      </div>
      <div style="margin-top:12px">
        <textarea class="form-input" id="order-notes-input" placeholder="Order notes (optional)" rows="2">${Cart.getOrderNotes()}</textarea>
      </div>
    </div>
  `;

  const subtotal = Cart.getSubtotal();
  const giftCost = Cart.getGiftPackagingCost();
  const total = Cart.getTotal();

  const footerHTML = isEmpty ? '' : `
    <div class="checkout-summary-row">
      <span>Subtotal</span>
      <span>${formatPrice(subtotal)}</span>
    </div>
    ${Cart.isGiftPackaging() ? `
      <div class="checkout-summary-row">
        <span>Gift packaging</span>
        <span>${CONFIG.GIFT_BOX_PRICE === 0 ? 'Complimentary' : formatPrice(giftCost)}</span>
      </div>
    ` : ''}
    <div style="font-size:0.8125rem;color:var(--chocolate);opacity:0.6;padding:4px 0">Delivery & pickup confirmed at checkout</div>
    <div class="checkout-summary-row checkout-summary-row--total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
    <button type="button" class="btn-primary" id="btn-checkout" style="width:100%;margin-top:16px">Proceed to checkout</button>
  `;

  drawer.querySelector('.cart-drawer__body').innerHTML = bodyHTML;
  drawer.querySelector('.cart-drawer__footer').innerHTML = footerHTML;

  // Bind events
  bindCartDrawerEvents();
}

function bindCartDrawerEvents() {
  // Quantity steppers
  document.querySelectorAll('.cart-qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const flavor = btn.dataset.flavor || null;
      const item = Cart.getCart().find(i => i.productId === id && (i.flavor || '') === (flavor || ''));
      if (item) Cart.updateQuantity(id, flavor, item.quantity - 1);
    });
  });
  document.querySelectorAll('.cart-qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const flavor = btn.dataset.flavor || null;
      const item = Cart.getCart().find(i => i.productId === id && (i.flavor || '') === (flavor || ''));
      if (item) Cart.updateQuantity(id, flavor, item.quantity + 1);
    });
  });
  // Remove
  document.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      Cart.removeFromCart(btn.dataset.id, btn.dataset.flavor || null);
    });
  });
  // Gift toggle
  const giftToggle = document.getElementById('gift-toggle');
  if (giftToggle) {
    giftToggle.addEventListener('change', () => {
      Cart.setGiftPackaging(giftToggle.checked);
      const wrap = document.getElementById('gift-message-wrap');
      if (wrap) wrap.style.display = giftToggle.checked ? '' : 'none';
    });
  }
  // Gift message
  const giftMsg = document.getElementById('gift-message-input');
  if (giftMsg) {
    giftMsg.addEventListener('input', () => Cart.setGiftMessage(giftMsg.value));
  }
  // Order notes
  const notes = document.getElementById('order-notes-input');
  if (notes) {
    notes.addEventListener('input', () => Cart.setOrderNotes(notes.value));
  }
  // Checkout button
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', showCheckoutForm);
  }
}

// ========== Checkout Form ==========
function showCheckoutForm() {
  const body = document.querySelector('.cart-drawer__body');
  body.innerHTML = `
    <div style="margin-bottom:20px">
      <button type="button" class="btn-text" id="btn-back-to-cart">← Back to cart</button>
    </div>
    <h3 style="font-family:var(--font-display);font-size:1.5rem;color:var(--burgundy);margin-bottom:20px">Checkout</h3>
    <form id="checkout-form" novalidate>
      <div class="form-group">
        <label for="checkout-name">Name</label>
        <input type="text" class="form-input" id="checkout-name" required autocomplete="name">
        <div class="form-error" id="error-name"></div>
      </div>
      <div class="form-group">
        <label for="checkout-phone">Phone</label>
        <input type="tel" class="form-input" id="checkout-phone" required autocomplete="tel">
        <div class="form-error" id="error-phone"></div>
      </div>
      <div class="form-group">
        <label>Fulfillment</label>
        <div style="display:flex;gap:12px;margin-top:4px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="fulfillment" value="pickup" style="accent-color:var(--raspberry)"> Pickup
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
            <input type="radio" name="fulfillment" value="delivery" style="accent-color:var(--raspberry)"> Delivery
          </label>
        </div>
        <div class="form-error" id="error-fulfillment"></div>
      </div>
      <div class="form-group" id="address-group" style="display:none">
        <label for="checkout-address">Delivery address</label>
        <input type="text" class="form-input" id="checkout-address" autocomplete="street-address">
        <div class="form-error" id="error-address"></div>
      </div>
      <div class="form-group">
        <label for="checkout-datetime">Preferred date & time</label>
        <input type="text" class="form-input" id="checkout-datetime" placeholder="e.g. Oct 15, 3:00 PM">
        <div class="form-error" id="error-dateTime"></div>
      </div>
      <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">Place order</button>
    </form>
  `;

  // Hide the footer totals during checkout
  document.querySelector('.cart-drawer__footer').innerHTML = '';

  // Back button
  document.getElementById('btn-back-to-cart').addEventListener('click', () => {
    renderCartDrawer();
  });

  // Show/hide address field
  document.querySelectorAll('input[name="fulfillment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('address-group').style.display =
        document.querySelector('input[name="fulfillment"]:checked')?.value === 'delivery' ? '' : 'none';
    });
  });

  // Submit
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      name: document.getElementById('checkout-name').value,
      phone: document.getElementById('checkout-phone').value,
      fulfillment: document.querySelector('input[name="fulfillment"]:checked')?.value || '',
      address: document.getElementById('checkout-address').value,
      dateTime: document.getElementById('checkout-datetime').value,
    };

    // Clear errors
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input--error').forEach(el => el.classList.remove('form-input--error'));

    const { valid, errors } = Cart.validateCheckout(formData);
    if (!valid) {
      Object.entries(errors).forEach(([field, msg]) => {
        const errorEl = document.getElementById(`error-${field}`);
        if (errorEl) errorEl.textContent = msg;
        const inputEl = document.getElementById(`checkout-${field}`);
        if (inputEl) inputEl.classList.add('form-input--error');
      });
      return;
    }

    showConfirmation(formData);
  });
}

// ========== Order Confirmation ==========
function showConfirmation(formData) {
  const orderNum = Cart.generateOrderNumber();
  const items = Cart.getCart();
  const total = Cart.getTotal();

  const body = document.querySelector('.cart-drawer__body');
  body.innerHTML = `
    <div class="confirmation">
      <div class="confirmation__icon" style="color:var(--raspberry)">${FLOWER_SVG.replace('class="flower-emblem"', 'class="flower-emblem" style="width:56px;height:56px;color:var(--raspberry)"')}</div>
      <h3 class="confirmation__title">Thank you.</h3>
      <p style="font-family:var(--font-display);font-size:1.125rem;font-style:italic;color:var(--burgundy);margin-bottom:20px">
        Your little joy is on its way.
      </p>
      <p style="font-size:0.875rem;color:var(--chocolate);margin-bottom:16px">
        Order <strong>${orderNum}</strong>
      </p>
      <div style="text-align:left;font-size:0.875rem;color:var(--chocolate)">
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>${formData.fulfillment === 'delivery' ? 'Delivery' : 'Pickup'}</strong></p>
        ${formData.fulfillment === 'delivery' ? `<p>${formData.address}</p>` : ''}
        <p><strong>When:</strong> ${formData.dateTime}</p>
        <hr style="border:none;border-top:1px solid var(--blush);margin:12px 0">
        ${items.map(i => `<p>${i.name}${i.flavor ? ' (' + i.flavor + ')' : ''} × ${i.quantity} — ${formatPrice((i.price||0)*i.quantity)}</p>`).join('')}
        ${Cart.isGiftPackaging() ? `<p>Gift packaging — ${CONFIG.GIFT_BOX_PRICE === 0 ? 'Complimentary' : formatPrice(CONFIG.GIFT_BOX_PRICE)}</p>` : ''}
        <p style="font-weight:600;margin-top:8px">Total: ${formatPrice(total)}</p>
        ${Cart.getGiftMessage() ? `<p style="margin-top:8px;font-style:italic">Gift message: "${Cart.getGiftMessage()}"</p>` : ''}
        ${Cart.getOrderNotes() ? `<p style="margin-top:4px">Notes: ${Cart.getOrderNotes()}</p>` : ''}
      </div>
      <div class="confirmation__demo-banner" style="margin-top:20px">
        Demo: no payment or order was actually sent.
      </div>
      <button type="button" class="btn-primary" id="btn-done" style="width:100%;margin-top:20px">Done</button>
    </div>
  `;
  document.querySelector('.cart-drawer__footer').innerHTML = '';

  Cart.clearCart();

  document.getElementById('btn-done').addEventListener('click', () => {
    closeCartDrawer();
    renderCartDrawer();
  });
}

// ========== Cart Drawer Open/Close ==========
export function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cart-drawer').classList.add('is-open');
  document.getElementById('cart-overlay').classList.add('is-active');
  document.body.classList.add('body-scroll-lock');
  // Focus trap: focus the close button
  const closeBtn = document.querySelector('.cart-drawer__close');
  if (closeBtn) closeBtn.focus();
}

export function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('is-open');
  document.getElementById('cart-overlay').classList.remove('is-active');
  document.body.classList.remove('body-scroll-lock');
}

// ========== Badge Update ==========
export function updateCartBadge(count) {
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add('is-visible');
      badge.classList.add('pulse');
      setTimeout(() => badge.classList.remove('pulse'), 400);
    } else {
      badge.classList.remove('is-visible');
    }
  });
}

// ========== Signature Scroll Arrows ==========
export function initScrollArrows(containerId, leftBtnId, rightBtnId) {
  const container = document.getElementById(containerId);
  const leftBtn = document.getElementById(leftBtnId);
  const rightBtn = document.getElementById(rightBtnId);
  if (!container || !leftBtn || !rightBtn) return;
  
  const scrollAmount = 304; // card width + gap
  leftBtn.addEventListener('click', () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  rightBtn.addEventListener('click', () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
}
