// ============================================================
// CHERA PATISSERIE — Centralized Data & Configuration
// Edit this file to update menu, prices, business info, etc.
// ============================================================

// ---------- Business Config ----------
export const CONFIG = {
  brandName: 'CHERA PATISSERIE',
  tagline: 'Born from Joy, crafted in cream.',
  taglineSecondary: 'A LITTLE JOY, ALWAYS CHERA',
  currency: 'USD',
  currencySymbol: '$',
  // TODO: Gift box price not provided — set to 0 (shown as "Complimentary")
  GIFT_BOX_PRICE: 0,
  instagram: {
    handle: '@CHERA_PATISSERIE',
    // TODO: Verify this URL is the correct Instagram profile
    url: 'https://instagram.com/chera_patisserie',
  },
  // TODO: All business details below need confirmation
  business: {
    address: 'Address coming soon',
    hours: 'Opening hours coming soon',
    phone: 'Phone coming soon',
    email: 'Email coming soon',
    orderingInfo: 'Ordering details coming soon',
  },
  // TODO: Owner/chef name not provided
  chef: {
    name: '[Chef Name]',
    title: 'Founder & Head Pâtissier',
  },
};

// ---------- Currency Helper ----------
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return 'Price on request';
  return `${CONFIG.currencySymbol}${amount.toFixed(2)}`;
}

// ---------- Menu Categories ----------
export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'tiramisu', label: 'Tiramisu' },
  { id: 'cheesecake', label: 'Cheesecake' },
  { id: 'cake', label: 'Cakes' },
];

// ---------- Products ----------
// Source of truth: menu image (Cups Menu 1-2 PRS)
// All items $6.00 per the menu image.
// Bueno Chocolate Cake is NOT on the menu image → price null.
export const PRODUCTS = [
  {
    id: 'tiramisu-classic',
    name: 'Classic Tiramisu',
    category: 'tiramisu',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/classic-tiramisu.jpg',
    description: 'Silky mascarpone layered over espresso-soaked sponge, dusted with cocoa.',
    available: true,
    accentColor: 'var(--classic-brown)',
  },
  {
    id: 'tiramisu-strawberry',
    name: 'Strawberry Tiramisu',
    category: 'tiramisu',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/straw-tiramisu.jpg',
    description: 'Lush strawberry compote meets airy cream on a bed of tender sponge.',
    available: true,
    accentColor: 'var(--strawberry-red)',
  },
  {
    id: 'tiramisu-mango',
    name: 'Mango Tiramisu',
    category: 'tiramisu',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/mango-tiramisu.jpg',
    description: 'Tropical mango chunks folded into velvety cream, bright and sun-kissed.',
    available: true,
    accentColor: 'var(--mango-yellow)',
  },
  {
    id: 'cheesecake-strawberry',
    name: 'Strawberry Cheesecake',
    category: 'cheesecake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/straw-cheesecake.jpg',
    description: 'Creamy cheesecake on a buttery biscuit base, crowned with fresh strawberry glaze.',
    available: true,
    accentColor: 'var(--strawberry-red)',
  },
  {
    id: 'cheesecake-mango',
    name: 'Mango Cheesecake',
    category: 'cheesecake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/mango-cheesecake.jpg',
    description: 'Smooth cheesecake with a golden mango layer — like sunshine in a cup.',
    available: true,
    accentColor: 'var(--mango-yellow)',
  },
  {
    id: 'dream-cake',
    name: 'Dream Cake',
    category: 'cake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/dream-cake.jpg',
    description: 'A dreamy layered sponge with clouds of cream — light, airy and utterly indulgent.',
    available: true,
    accentColor: 'var(--classic-brown)',
  },
  {
    id: 'vanilla-hazelnut-cake',
    name: 'Vanilla Hazelnut Cake',
    category: 'cake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/vanilla-hazelnut-cake.jpg',
    description: 'Fragrant vanilla sponge with crushed hazelnut praline and silky cream layers.',
    available: true,
    accentColor: 'var(--hazelnut)',
  },
  {
    id: 'double-chocolate-cake',
    name: 'Double Chocolate Cake',
    category: 'cake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/double-chocolate-cake.jpg',
    description: 'Rich, cocoa-dark sponge layered with chocolate ganache — deeply satisfying.',
    available: true,
    accentColor: 'var(--chocolate-dark)',
  },
  {
    id: 'caramel-chocolate-cake',
    name: 'Caramel Chocolate Cake',
    category: 'cake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/caramel-chocolate-cake.jpg',
    description: 'Bittersweet chocolate with ribbons of golden caramel — warm and comforting.',
    available: true,
    accentColor: 'var(--caramel)',
  },
  {
    id: 'pistachio-chocolate-cake',
    name: 'Pistachio Chocolate Cake',
    category: 'cake',
    flavors: [],
    price: 6.00,
    image: 'assets/images/new images/pistachio-chocolate-cake.jpg',
    description: 'Vivid pistachio cream over chocolate sponge — nutty, earthy and elegant.',
    available: true,
    accentColor: 'var(--pistachio)',
  },
];

// ---------- Signature items for the horizontal scroll (Section 04) ----------
export const SIGNATURE_ITEMS = [
  'tiramisu-strawberry',
  'tiramisu-mango',
  'tiramisu-classic',
  'cheesecake-strawberry',
  'cheesecake-mango',
  'bueno-chocolate-cake',
  'pistachio-chocolate-cake',
];

// ---------- Category Tiles (Section 03) ----------
export const CATEGORY_TILES = [
  {
    id: 'tiramisu',
    title: 'Tiramisu',
    image: 'assets/images/new images/tiramisus.jpg',
    description: 'Layers of silky mascarpone and espresso-kissed sponge.',
  },
  {
    id: 'cheesecake',
    title: 'Cheesecake',
    image: 'assets/images/new images/cheesecakes.jpg',
    description: 'Creamy, buttery, crowned with fruit.',
  },
  {
    id: 'cake',
    title: 'Cakes',
    image: 'assets/images/new images/cakes.jpg',
    description: 'Rich layers of sponge, cream and crunch.',
  },
];

// ---------- Instagram Grid Images (Section 09) ----------
export const INSTAGRAM_IMAGES = [
  { src: 'assets/images/products-1.jpg', alt: 'Chera dessert cups with chocolate and pistachio layers' },
  { src: 'assets/images/products-2.jpg', alt: 'An array of Chera cups in every flavour' },
  { src: 'assets/images/menu-items-photo-1.jpg', alt: 'Strawberry and mango tiramisu cups from Chera' },
  { src: 'assets/images/menu-items-photo-2.jpg', alt: 'Bueno, pistachio, mango and strawberry cheesecake cups' },
  { src: 'assets/images/hand-gift-box.jpg', alt: 'A hand lifting the pink Chera gift box with satin ribbon' },
  { src: 'assets/images/chef.jpg', alt: 'The hands behind Chera, crafting with care' },
];
