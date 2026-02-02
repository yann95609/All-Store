// ============================================
// ALLSTORE — PROFILE PAGE LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', () => Prof.init());

const Prof = {
  session: null,

  toast(msg, type='info') {
    const w = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<span class="dot"></span>' + msg;
    w.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2800);
  },
  fmt(n) { return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'; },

  init() {
    this.session = DB.getSession();
    if (!this.session || !this.session.loggedIn) {
      window.location.href = 'login.html';
      return;
    }

    this.populateHeader();
    this.populateSidebar();
    this.populateSettings();
    this.renderDashboard();

    // Nav links
    document.querySelectorAll('.prof-nav-link').forEach(link => {
      link.addEventListener('click', () => this.showSection(link.dataset.section));
    });

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
      DB.logout();
      this.toast('Vous êtes déconnecté', 'info');
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    });

    // Save settings
    document.getElementById('btnSave').addEventListener('click', () => this.saveSettings());

    // Cart badge
    const cnt = DB.getCartCount();
    const badge = document.getElementById('cartBadge');
    badge.style.display = cnt > 0 ? 'flex' : 'none';
    badge.textContent = cnt;
  },

  populateHeader() {
    // nothing extra needed — sidebar has all info
  },

  populateSidebar() {
    const s = this.session;
    const initials = (s.firstname[0] || 'A') + (s.lastname ? s.lastname[0] : '');
    document.getElementById('profAvatar').textContent = initials.toUpperCase();
    document.getElementById('profName').textContent = s.firstname + ' ' + (s.lastname || '');
    document.getElementById('profEmail').textContent = s.email;
  },

  populateSettings() {
    const s = this.session;
    document.getElementById('setFirst').value = s.firstname || '';
    document.getElementById('setLast').value  = s.lastname  || '';
    document.getElementById('setEmail').value = s.email     || '';
    document.getElementById('setPhone').value = s.phone     || '';
  },

  showSection(name) {
    document.querySelectorAll('.prof-nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.prof-section').forEach(s => s.classList.remove('active'));

    const link = document.querySelector(`[data-section="${name}"]`);
    const sec  = document.getElementById('sec' + name.charAt(0).toUpperCase() + name.slice(1));
    if (link) link.classList.add('active');
    if (sec)  sec.classList.add('active');

    // Lazy render on switch
    if (name === 'orders')   this.renderOrders();
    if (name === 'wishlist') this.renderWishlist();
  },

  renderDashboard() {
    const orders = DB.getOrders();
    const wishlist = DB.getWishlist();

    // Stats
    document.getElementById('statOrders').textContent = orders.length;
    const spent = orders.reduce((sum, o) => sum + o.total, 0);
    document.getElementById('statSpent').textContent = this.fmt(spent);
    document.getElementById('statWish').textContent = wishlist.length;

    // Recent orders (last 3)
    this.renderOrderList('dashOrders', orders.slice(0, 3));
  },

  renderOrders() {
    this.renderOrderList('allOrders', DB.getOrders());
  },

  renderOrderList(containerId, orders) {
    const container = document.getElementById(containerId);
    if (orders.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:60px 0;"><p style="color:var(--c-text2);font-size:14px;">Aucune commande pour le moment.</p><a href="index.html" class="btn-gold" style="margin-top:16px;display:inline-flex;">Explorer les produits</a></div>';
      return;
    }
    container.innerHTML = orders.map(o => {
      const statusClass = o.status === 'livrée' ? 'livre' : 'encours';
      const statusIcon  = o.status === 'livrée' ? '✓ ' : '⏳ ';
      return `
      <div class="order-card">
        <div>
          <div class="o-id">${o.id}</div>
          <div class="o-date">${o.date}</div>
        </div>
        <div class="o-items">${o.items} article${o.items > 1 ? 's' : ''}</div>
        <div>
          <div class="o-total">${this.fmt(o.total)}</div>
          <div class="o-status ${statusClass}">${statusIcon}${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</div>
        </div>
      </div>`;
    }).join('');
  },

  renderWishlist() {
    const ids = DB.getWishlist();
    const container = document.getElementById('wishGrid');
    if (ids.length === 0) {
      container.innerHTML = '<div style="text-align:center;padding:60px 0;grid-column:1/-1;"><p style="color:var(--c-text2);font-size:14px;">Aucun produit favori.</p><a href="index.html" class="btn-gold" style="margin-top:16px;display:inline-flex;">Explorer les produits</a></div>';
      return;
    }
    container.innerHTML = ids.map(id => {
      const p = DB.getProductById(id);
      if (!p) return '';
      return `
      <div class="p-card" style="cursor:pointer;" onclick="window.location.href='product-details.html#${p.id}'">
        <div class="p-card-img">
          <button class="p-wish active" data-id="${p.id}" onclick="event.stopPropagation();Prof.removeWish(this,${p.id})">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="p-card-body">
          <div class="p-cat">${p.category}</div>
          <div class="p-title">${p.title}</div>
          <div class="p-stars">★★★★${p.rating >= 4.8 ? '★' : '☆'} <span>(${p.reviews.toLocaleString()})</span></div>
          <div class="p-price"><span class="cur">${this.fmt(p.price)}</span>${p.oldPrice ? '<span class="old">' + this.fmt(p.oldPrice) + '</span>' : ''}</div>
          <button class="btn-cart" onclick="event.stopPropagation();Prof.addToCart(${p.id})">
            <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Ajouter au panier
          </button>
        </div>
      </div>`;
    }).join('');
  },

  removeWish(btn, id) {
    DB.toggleWishlist(id); // removes it
    this.toast('Retiré des favoris', 'info');
    this.renderWishlist(); // re-render
  },

  addToCart(id) {
    DB.addToCart(id);
    const cnt = DB.getCartCount();
    const badge = document.getElementById('cartBadge');
    badge.style.display = cnt > 0 ? 'flex' : 'none';
    badge.textContent = cnt;
    this.toast('Ajouté au panier ✓', 'success');
  },

  saveSettings() {
    const first = document.getElementById('setFirst').value.trim();
    const last  = document.getElementById('setLast').value.trim();
    const email = document.getElementById('setEmail').value.trim();
    const phone = document.getElementById('setPhone').value.trim();
    const pw    = document.getElementById('setPw').value;
    const pwc   = document.getElementById('setPwConf').value;

    if (!first || !email) { this.toast('Le prénom et l\'email sont requis', 'warn'); return; }
    if (pw && pw !== pwc) { this.toast('Les mots de passe ne correspondent pas', 'error'); return; }
    if (pw && pw.length < 6) { this.toast('Le mot de passe doit avoir au moins 6 caractères', 'warn'); return; }

    // Update session in localStorage
    const sess = DB.getSession();
    sess.firstname = first;
    sess.lastname  = last;
    sess.email     = email;
    sess.phone     = phone;
    if (pw) sess.passwordHash = DB.hashPw(pw);
    localStorage.setItem('as_session', JSON.stringify(sess));
    this.session = sess;

    // Reset pw fields
    document.getElementById('setPw').value = '';
    document.getElementById('setPwConf').value = '';

    // Update sidebar display
    this.populateSidebar();

    this.toast('Paramètres sauvegardés avec succès ✓', 'success');
  }
};
