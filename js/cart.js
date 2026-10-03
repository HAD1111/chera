import { CONFIG, formatPrice } from './data.js';

// ---------- Cart State ----------
let cart = [];
let giftPackaging = false;
let giftMessage = '';
let orderNotes = '';

// ---------- LocalStorage Persistence ----------
const STORAGE_KEY = 'chera_cart';

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cart,
      giftPackaging,
      giftMessage,
      orderNotes,
    }));
  } catch (e) {
    console.warn('Cart: localStorage unavailable', e);
  }
}

function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data) {
      cart = data.cart || [];
      giftPackaging = data.giftPackaging || false;
      giftMessage = data.giftMessage || '';
      orderNotes = data.orderNotes || '';
    }
  } catch (e) {
    console.warn('Cart: could not load from localStorage', e);
  }
}

// ---------- Cart Operations ----------
// Each cart item: { productId, name, flavor (optional string), price, quantity, image }

function getCartKey(productId, flavor) {
  return flavor ? `${productId}__${flavor}` : productId;
}

export function addToCart(product, flavor = null, qty = 1) {
  const key = getCartKey(product.id, flavor);
  const existing = cart.find(item => getCartKey(item.productId, item.flavor) === key);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      flavor: flavor || null,
      price: product.price,
      quantity: qty,
      image: product.image,
    });
  }
  saveCart();
  notifyCartUpdate();
}

export function updateQuantity(productId, flavor, newQty) {
  const key = getCartKey(productId, flavor);
  const idx = cart.findIndex(item => getCartKey(item.productId, item.flavor) === key);
  if (idx === -1) return;
  if (newQty <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = newQty;
  }
  saveCart();
  notifyCartUpdate();
}

export function removeFromCart(productId, flavor) {
  const key = getCartKey(productId, flavor);
  cart = cart.filter(item => getCartKey(item.productId, item.flavor) !== key);
  saveCart();
  notifyCartUpdate();
}

export function clearCart() {
  cart = [];
  giftPackaging = false;
  giftMessage = '';
  orderNotes = '';
  saveCart();
  notifyCartUpdate();
}

export function getCart() {
  return [...cart];
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function getSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
}

export function getGiftPackagingCost() {
  return giftPackaging ? CONFIG.GIFT_BOX_PRICE : 0;
}

export function getTotal() {
  return getSubtotal() + getGiftPackagingCost();
}

export function setGiftPackaging(enabled) {
  giftPackaging = enabled;
  saveCart();
  notifyCartUpdate();
}

export function isGiftPackaging() {
  return giftPackaging;
}

export function setGiftMessage(msg) {
  giftMessage = msg;
  saveCart();
}

export function getGiftMessage() {
  return giftMessage;
}

export function setOrderNotes(notes) {
  orderNotes = notes;
  saveCart();
}

export function getOrderNotes() {
  return orderNotes;
}

export function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'CH-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ---------- Event System ----------
const listeners = new Set();

export function onCartUpdate(fn) {
  listeners.add(fn);
}

function notifyCartUpdate() {
  listeners.forEach(fn => fn({
    cart: getCart(),
    count: getCartCount(),
    subtotal: getSubtotal(),
    total: getTotal(),
    giftPackaging,
    giftMessage,
  }));
}

// ---------- Initialize ----------
loadCart();

// Export for checkout validation
export function validateCheckout(formData) {
  const errors = {};
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Please enter your name';
  }
  if (!formData.phone || !/^[\d\s\+\-()]{7,20}$/.test(formData.phone.trim())) {
    errors.phone = 'Please enter a valid phone number';
  }
  if (!formData.fulfillment) {
    errors.fulfillment = 'Please select pickup or delivery';
  }
  if (formData.fulfillment === 'delivery' && (!formData.address || formData.address.trim().length < 5)) {
    errors.address = 'Please enter a delivery address';
  }
  if (!formData.dateTime || formData.dateTime.trim().length < 3) {
    errors.dateTime = 'Please enter a preferred date & time';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
