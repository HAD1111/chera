import { CONFIG, PRODUCTS, CATEGORIES, CATEGORY_TILES, SIGNATURE_ITEMS, INSTAGRAM_IMAGES } from './data.js';
import * as Cart from './cart.js';
import { renderProductCard, renderCartDrawer, openCartDrawer, closeCartDrawer, updateCartBadge, initScrollArrows, FLOWER_SVG, CART_SVG } from './ui.js';

// ========== DOM Ready ==========
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCartDrawerControls();
  renderCategoryTiles();
  renderSignatureFlavors();
  renderMenuSection();
  renderInstagramGrid();
  initScrollReveal();
  initFilterPills();
  initGiftingCTA();
  
  // Subscribe to cart updates
  Cart.onCartUpdate(({ count }) => {
    updateCartBadge(count);
    renderCartDrawer();
  });

  // Initial badge
  updateCartBadge(Cart.getCartCount());
  renderCartDrawer();

  // Flower dividers
  document.querySelectorAll('.flower-divider').forEach(el => {
    el.innerHTML = `<span style="color:var(--blush)">${FLOWER_SVG}</span>`;
  });
});

// ========== Header Scroll Effect ==========
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ========== Mobile Menu ==========
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-active');
    document.body.classList.toggle('body-scroll-lock', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      hamburger.classList.remove('is-active');
      document.body.classList.remove('body-scroll-lock');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ========== Cart Drawer Controls ==========
function initCartDrawerControls() {
  // Open
  document.querySelectorAll('.cart-trigger').forEach(btn => {
    btn.addEventListener('click', openCartDrawer);
  });

  // Close
  const closeBtn = document.querySelector('.cart-drawer__close');
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && drawer.classList.contains('is-open')) closeCartDrawer();
    }
  });
}

// ========== Category Tiles (Section 03) ==========
function renderCategoryTiles() {
  const grid = document.getElementById('desserts-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORY_TILES.map(tile => `
    <div class="dessert-tile reveal">
      <a href="#menu" class="dessert-tile__link-wrap" data-filter="${tile.id}" style="text-decoration:none;color:inherit">
        <div class="dessert-tile__image">
          <img src="${tile.image}" alt="${tile.title} — handcrafted by Chera" loading="lazy" width="400" height="533">
        </div>
        <h3 class="dessert-tile__title">${tile.title}</h3>
        <span class="dessert-tile__link">Discover</span>
      </a>
    </div>
  `).join('');

  // Click to filter menu
  grid.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Scroll will happen via href="#menu"
      // Activate the corresponding filter pill
      setTimeout(() => {
        const filterPill = document.querySelector(`.filter-pill[data-category="${link.dataset.filter}"]`);
        if (filterPill) filterPill.click();
      }, 500);
    });
  });
}

// ========== Signature Flavors (Section 04) ==========
function renderSignatureFlavors() {
  const container = document.getElementById('signatures-scroll');
  if (!container) return;

  const signatureProducts = SIGNATURE_ITEMS
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean);

  container.innerHTML = signatureProducts.map(product => {
    const hasPrice = product.price !== null;
    return `
      <div class="signature-card">
        <div class="signature-card__image">
          <img src="${product.image}" alt="${product.name} — a signature Chera flavour" loading="lazy" width="280" height="280">
        </div>
        <div class="signature-card__body">
          <div class="signature-card__dot-name">
            <span class="flavor-dot" style="background:${product.accentColor}"></span>
            <span class="signature-card__name">${product.name}</span>
          </div>
          <p class="signature-card__desc">${product.description}</p>
          ${hasPrice 
            ? `<button class="btn-primary btn-add-signature" data-product-id="${product.id}" style="width:100%;font-size:0.8125rem;padding:10px 20px">Add to cart</button>`
            : `<button class="btn-secondary" style="width:100%;font-size:0.8125rem;padding:10px 20px">Ask in store</button>`
          }
        </div>
      </div>
    `;
  }).join('');

  // Add to cart from signature cards
  container.querySelectorAll('.btn-add-signature').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = PRODUCTS.find(p => p.id === btn.dataset.productId);
      if (product) {
        Cart.addToCart(product, null, 1);
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-added');
        const CHECK = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 8 7 12 13 4"/></svg>`;
        btn.innerHTML = `${CHECK} Added`;
        setTimeout(() => {
          btn.classList.remove('btn-added');
          btn.classList.add('btn-primary');
          btn.textContent = 'Add to cart';
        }, 1800);
      }
    });
  });

  initScrollArrows('signatures-scroll', 'sig-arrow-left', 'sig-arrow-right');
}

// ========== Menu Section (Section 05) ==========
function renderMenuSection() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  PRODUCTS.forEach(product => {
    grid.appendChild(renderProductCard(product));
  });
}

// ========== Filter Pills ==========
function initFilterPills() {
  const pills = document.querySelectorAll('.filter-pill');
  const grid = document.getElementById('menu-grid');
  if (!pills.length || !grid) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.setAttribute('aria-pressed', 'false'));
      pill.setAttribute('aria-pressed', 'true');

      const category = pill.dataset.category;
      const cards = grid.querySelectorAll('.product-card');
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ========== Instagram Grid (Section 09) ==========
function renderInstagramGrid() {
  const grid = document.getElementById('instagram-grid');
  if (!grid) return;

  grid.innerHTML = INSTAGRAM_IMAGES.map(img => `
    <a href="${CONFIG.instagram.url}" target="_blank" rel="noopener noreferrer" class="instagram__tile">
      <img src="${img.src}" alt="${img.alt}" loading="lazy" width="200" height="200">
    </a>
  `).join('');
}

// ========== Gifting CTA ==========
function initGiftingCTA() {
  const btn = document.getElementById('btn-add-gift');
  if (!btn) return;
  btn.addEventListener('click', () => {
    Cart.setGiftPackaging(true);
    openCartDrawer();
  });
}

// ========== Scroll Reveal (IntersectionObserver) ==========
function initScrollReveal() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
