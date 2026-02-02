// ============================================
// ALLSTORE - DATABASE LAYER (localStorage Backend)
// Simulates a full backend with structured data,
// authentication, orders, products, etc.
// ============================================

const DB = {
  // ---- Internal helpers ----
  _get(key) {
    try { return JSON.parse(localStorage.getItem('as_' + key)); }
    catch(e) { return null; }
  },
  _set(key, val) {
    localStorage.setItem('as_' + key, JSON.stringify(val));
  },

  // ============ PRODUCTS ============
  products: [
    { id:1, title:'iPhone 15 Pro Max 256GB', category:'Smartphones', price:599900, oldPrice:999000, rating:4.9, reviews:2847, image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', badge:'flash', discount:40 },
    { id:2, title:'AirPods Pro 2ème Génération', category:'Audio', price:162500, oldPrice:250000, rating:4.8, reviews:1923, image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', badge:'flash', discount:35 },
    { id:3, title:'MacBook Pro M3 14" 512GB', category:'Ordinateurs', price:1099000, oldPrice:1999000, rating:4.9, reviews:1456, image:'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', badge:'flash', discount:45 },
    { id:4, title:'PlayStation 5 + 2 Manettes', category:'Gaming', price:349900, oldPrice:499000, rating:4.8, reviews:3241, image:'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop', badge:'flash', discount:30 },
    { id:5, title:'Montre Automatique Luxe', category:'Montres', price:425000, oldPrice:550000, rating:4.9, reviews:892, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', badge:'new', discount:23 },
    { id:6, title:'Sneakers Premium Edition', category:'Chaussures', price:85900, oldPrice:120000, rating:4.7, reviews:654, image:'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=400&fit=crop', badge:'top', discount:28 },
    { id:7, title:'Sac à Dos Design Moderne', category:'Accessoires', price:37500, oldPrice:50000, rating:4.8, reviews:1234, image:'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop', badge:'discount', discount:25 },
    { id:8, title:'Robe Élégante Soirée', category:'Mode Femme', price:64000, oldPrice:80000, rating:4.6, reviews:456, image:'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop', badge:'new', discount:20 },
    { id:9, title:'Caméra 4K Professionnelle', category:'Photo & Vidéo', price:675000, oldPrice:850000, rating:4.9, reviews:789, image:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', badge:'top', discount:21 },
    { id:10, title:'Parfum de Luxe 100ml', category:'Parfums', price:105000, oldPrice:150000, rating:4.8, reviews:1567, image:'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop', badge:'discount', discount:30 },
    { id:11, title:'Smartwatch Ultra Premium', category:'Montres Connectées', price:299900, oldPrice:399000, rating:4.8, reviews:2134, image:'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop', badge:'new', discount:25 },
    { id:12, title:'Tablette Pro 12.9" 256GB', category:'Tablettes', price:510000, oldPrice:600000, rating:4.7, reviews:987, image:'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop', badge:'discount', discount:15 },
    { id:13, title:'Laptop Dell XPS 15 Pro', category:'Ordinateurs', price:899000, oldPrice:1200000, rating:4.7, reviews:543, image:'https://images.unsplash.com/photo-1491746035074-894992223426?w=400&h=400&fit=crop', badge:'new', discount:25 },
    { id:14, title:'Écouteurs Sony WH-1000XM5', category:'Audio', price:189000, oldPrice:280000, rating:4.9, reviews:2100, image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', badge:'top', discount:32 },
    { id:15, title:'Veste Cuir Vintage', category:'Mode Homme', price:145000, oldPrice:210000, rating:4.5, reviews:321, image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', badge:'discount', discount:31 },
    { id:16, title:'Montre Diesel Chrono', category:'Montres', price:187000, oldPrice:260000, rating:4.6, reviews:445, image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', badge:'new', discount:28 }
  ],

  getProducts(filter) {
    if (!filter || filter === 'Tout') return this.products;
    return this.products.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()) || p.title.toLowerCase().includes(filter.toLowerCase()));
  },
  getProductById(id) {
    return this.products.find(p => p.id === id) || null;
  },

  // ============ AUTH ============
  initUsers() {
    if (!this._get('users')) this._set('users', []);
  },
  register(firstname, lastname, email, phone, password) {
    this.initUsers();
    const users = this._get('users');
    if (users.find(u => u.email === email)) return { ok: false, error: 'Email déjà utilisé' };
    const user = { id: Date.now(), firstname, lastname, email, phone, password: this._hash(password), createdAt: new Date().toISOString() };
    users.push(user);
    this._set('users', users);
    this._set('session', { id: user.id, firstname, lastname, email, phone, loggedIn: true });
    return { ok: true, user: this._get('session') };
  },
  login(email, password) {
    this.initUsers();
    const users = this._get('users');
    const user = users.find(u => u.email === email && u.password === this._hash(password));
    if (!user) return { ok: false, error: 'Email ou mot de passe incorrect' };
    this._set('session', { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, phone: user.phone, loggedIn: true });
    return { ok: true, user: this._get('session') };
  },
  logout() {
    localStorage.removeItem('as_session');
  },
  getSession() {
    return this._get('session');
  },
  _hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h = ((h << 5) - h) + c; h |= 0; }
    return h.toString(36);
  },

  // ============ CART ============
  getCart() { return this._get('cart') || []; },
  addToCart(productId, qty = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;
    let cart = this.getCart();
    const existing = cart.find(i => i.id === productId);
    if (existing) { existing.qty = Math.min(existing.qty + qty, 10); }
    else { cart.push({ id: product.id, title: product.title, price: product.price, oldPrice: product.oldPrice, image: product.image, category: product.category, qty }); }
    this._set('cart', cart);
    return true;
  },
  removeFromCart(productId) {
    let cart = this.getCart().filter(i => i.id !== productId);
    this._set('cart', cart);
  },
  updateCartQty(productId, qty) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) { item.qty = Math.max(1, Math.min(qty, 10)); }
    this._set('cart', cart);
  },
  clearCart() { this._set('cart', []); },
  getCartTotal() {
    return this.getCart().reduce((sum, i) => sum + (i.price * i.qty), 0);
  },
  getCartCount() {
    return this.getCart().reduce((sum, i) => sum + i.qty, 0);
  },

  // ============ WISHLIST ============
  getWishlist() { return this._get('wishlist') || []; },
  toggleWishlist(productId) {
    let wl = this.getWishlist();
    const idx = wl.indexOf(productId);
    if (idx === -1) { wl.push(productId); } else { wl.splice(idx, 1); }
    this._set('wishlist', wl);
    return idx === -1; // true = added
  },
  isInWishlist(productId) {
    return (this.getWishlist() || []).includes(productId);
  },

  // ============ ORDERS ============
  getOrders() { return this._get('orders') || []; },
  placeOrder(cart) {
    const orders = this.getOrders();
    const order = {
      id: 'AS' + new Date().toISOString().replace(/[-:T.Z]/g,'').slice(0,14),
      items: [...cart],
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      status: 'En cours',
      date: new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }),
      createdAt: new Date().toISOString()
    };
    orders.unshift(order);
    this._set('orders', orders);
    this.clearCart();
    return order;
  },

  // ============ PROMO CODES ============
  promoCodes: { 'BIENVENUE10': 10, 'CYBER25': 25, 'FLASH30': 30, 'ALLSTORE50': 50 },
  applyPromo(code) {
    const discount = this.promoCodes[code.toUpperCase()];
    if (discount) { this._set('activePromo', { code: code.toUpperCase(), discount }); return { ok: true, discount }; }
    return { ok: false };
  },
  getActivePromo() { return this._get('activePromo'); },
  clearPromo() { localStorage.removeItem('as_activePromo'); }
};
