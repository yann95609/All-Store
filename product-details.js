// ============================================
// ALLSTORE — PRODUCT DETAILS PAGE
// ============================================
document.addEventListener('DOMContentLoaded', () => PD.init());

const PD = {
  product: null,
  qty: 1,

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
    // Get product ID from URL hash or default to 1
    const hash = window.location.hash.replace('#','');
    const id = parseInt(hash) || 1;
    this.product = DB.getProductById(id);
    if (!this.product) { this.product = DB.products[0]; }

    this.renderProduct();
    this.bindGallery();
    this.bindOptions();
    this.bindQty();
    this.bindCTA();
    this.bindTabs();
    this.renderSimilar();
    this.syncHeader();

    // Search redirect
    document.getElementById('searchBtn').addEventListener('click', () => {
      const q = document.getElementById('searchInput').value.trim();
      if (q) window.location.href = 'index.html';
    });
  },

  syncHeader() {
    const sess = DB.getSession();
    const acc = document.getElementById('actAccount');
    if (sess && sess.loggedIn) { acc.href = 'profile.html'; acc.querySelector('span').textContent = sess.firstname; }
    const cnt = DB.getCartCount();
    const badge = document.getElementById('cartBadge');
    badge.style.display = cnt > 0 ? 'flex' : 'none';
    badge.textContent = cnt;
  },

  // Thumbnail images (multiple angles simulated with same image + slight overlay variation)
  getThumbImages() {
    return [
      this.product.image,
      this.product.image.replace('w=400', 'w=401'),
      this.product.image.replace('w=400', 'w=402'),
      this.product.image.replace('w=400', 'w=403')
    ];
  },

  renderProduct() {
    const p = this.product;
    document.getElementById('bcProduct').textContent = p.title;
    document.getElementById('pdCat').textContent = p.category;
    document.getElementById('pdTitle').textContent = p.title;

    // Stars
    const fullStars = Math.floor(p.rating);
    const halfStar = p.rating - fullStars >= 0.5;
    let stars = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(5 - fullStars - (halfStar?1:0));
    document.getElementById('pdStars').textContent = stars;
    document.getElementById('pdReviewCnt').textContent = `(${p.reviews.toLocaleString()} avis)`;

    // Price
    document.getElementById('pdPrice').textContent = this.fmt(p.price);
    if (p.oldPrice) {
      document.getElementById('pdOld').textContent = this.fmt(p.oldPrice);
      document.getElementById('pdOld').style.display = 'inline';
    }
    if (p.discount) {
      document.getElementById('pdDisc').textContent = `−${p.discount}%`;
      document.getElementById('pdDisc').style.display = 'inline-block';
    }

    // Main image
    document.getElementById('mainImg').src = p.image;
    document.getElementById('mainImg').alt = p.title;

    // Badge
    if (p.badge === 'flash') {
      document.getElementById('mainBadge').style.display = 'inline-block';
      document.getElementById('mainBadge').textContent = '⚡ Flash −' + p.discount + '%';
    }

    // Thumbs
    const thumbs = document.getElementById('thumbs');
    thumbs.innerHTML = this.getThumbImages().map((src, i) =>
      `<div class="pd-thumb ${i===0?'active':''}" data-idx="${i}"><img src="${src}" alt="Vue ${i+1}"></div>`
    ).join('');

    // Description
    document.getElementById('descText').innerHTML = `
      <p>${p.title} — un produit de qualité supérieure disponible sur AllStore. Conçu avec les meilleurs matériaux pour vous offrir une expérience exceptionnelle.</p>
      <p style="margin-top:12px;">Ce produit est livré avec une garantie de 12 mois et un service après-vente dédié. Profitez de la livraison gratuite dès 50 000 FCFA et de notre politique de retour sous 30 jours.</p>`;

    // Specs
    document.getElementById('specsTable').innerHTML = `
      <tr><td>Catégorie</td><td>${p.category}</td></tr>
      <tr><td>Prix</td><td>${this.fmt(p.price)}</td></tr>
      <tr><td>Évaluation</td><td>${p.rating}/5 (${p.reviews.toLocaleString()} avis)</td></tr>
      <tr><td>Livraison</td><td>DHL Express — 3-5 jours</td></tr>
      <tr><td>Garantie</td><td>12 mois</td></tr>
      <tr><td>Retour</td><td>30 jours</td></tr>`;

    // Reviews (simulated)
    const names = ['Marie D.','Thomas K.','Fatou S.','Jean-Pierre B.','Ina R.'];
    const texts = [
      'Excellent produit, livraison très rapide. Je recommande vivement !',
      'Qualité au rendez-vous. Le prix est justifié pour cette qualité.',
      'Commande reçue en bon état. Service client très réactif.',
      'Parfait pour mon usage quotidien. Très satisfait du résultat.',
      'Rapport qualité/prix imbattible sur AllStore.'
    ];
    document.getElementById('reviewsList').innerHTML = names.map((name, i) => `
      <div class="review-item">
        <div class="review-head"><span class="review-author">${name}</span><span class="review-date">${['15 jan.','28 déc.','10 jan.','5 déc.','20 jan.'][i]} 2026</span></div>
        <div class="review-stars">${'★'.repeat(i < 2 ? 5 : 4)}${i >= 2 ? '☆' : ''}</div>
        <div class="review-text">${texts[i]}</div>
      </div>
    `).join('');

    // Wishlist state
    if (DB.isInWishlist(p.id)) {
      document.getElementById('btnWishDetail').classList.add('active');
    }
  },

  bindGallery() {
    document.getElementById('thumbs').addEventListener('click', e => {
      const thumb = e.target.closest('.pd-thumb');
      if (!thumb) return;
      document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const img = thumb.querySelector('img');
      document.getElementById('mainImg').src = img.src;
    });
  },

  bindOptions() {
    // Colors
    document.getElementById('colorSwatches').addEventListener('click', e => {
      const sw = e.target.closest('.opt-swatch');
      if (!sw) return;
      document.querySelectorAll('.opt-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
    // Sizes
    document.getElementById('sizeOptions').addEventListener('click', e => {
      const sz = e.target.closest('.opt-size');
      if (!sz || sz.classList.contains('unavail')) return;
      document.querySelectorAll('.opt-size').forEach(s => s.classList.remove('active'));
      sz.classList.add('active');
    });
  },

  bindQty() {
    document.getElementById('pdQtyMinus').addEventListener('click', () => {
      if (this.qty > 1) { this.qty--; document.getElementById('pdQtyVal').value = this.qty; }
    });
    document.getElementById('pdQtyPlus').addEventListener('click', () => {
      if (this.qty < 10) { this.qty++; document.getElementById('pdQtyVal').value = this.qty; }
    });
  },

  bindCTA() {
    document.getElementById('btnAddCart').addEventListener('click', e => {
      e.preventDefault();
      for (let i = 0; i < this.qty; i++) { DB.addToCart(this.product.id); }
      this.syncHeader();
      this.toast(`${this.qty}x ${this.product.title} ajouté au panier ✓`, 'success');
    });
    document.getElementById('btnWishDetail').addEventListener('click', () => {
      const added = DB.toggleWishlist(this.product.id);
      document.getElementById('btnWishDetail').classList.toggle('active', added);
      this.toast(added ? 'Ajouté aux favoris ♥' : 'Retiré des favoris', added ? 'success' : 'info');
    });
  },

  bindTabs() {
    document.querySelectorAll('.pd-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.pd-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById('tab' + btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1)).classList.add('active');
      });
    });
    // Reviews link scrolls to reviews tab
    document.getElementById('reviewsLink').addEventListener('click', () => {
      document.querySelectorAll('.pd-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pd-tab-content').forEach(c => c.classList.remove('active'));
      document.querySelector('[data-tab="reviews"]').classList.add('active');
      document.getElementById('tabReviews').classList.add('active');
      document.getElementById('tabReviews').scrollIntoView({ behavior:'smooth', block:'start' });
    });
  },

  renderSimilar() {
    // Show other products in same category, max 4
    const others = DB.products.filter(p => p.id !== this.product.id).slice(0, 4);
    const grid = document.getElementById('similarGrid');
    grid.innerHTML = others.map(p => {
      const inWl = DB.isInWishlist(p.id);
      const badgeMap = { flash:'flash', new:'new', top:'top', discount:'disc' };
      return `
      <div class="p-card" style="cursor:pointer;" onclick="window.location.hash='${p.id}';location.reload();">
        <div class="p-card-img">
          ${p.badge ? '<span class="p-badge '+badgeMap[p.badge]+'">'+( p.badge==='flash' ? '⚡ Flash' : p.badge==='new' ? 'Nouveau' : p.badge==='top' ? '★ Top' : '-'+p.discount+'%' )+'</span>' : ''}
          <button class="p-wish ${inWl?'active':''}" data-id="${p.id}" onclick="event.stopPropagation();PD.toggleSimilarWish(this,${p.id})">
            <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <img src="${p.image}" alt="${p.title}" loading="lazy">
        </div>
        <div class="p-card-body">
          <div class="p-cat">${p.category}</div>
          <div class="p-title">${p.title}</div>
          <div class="p-stars">★★★★${p.rating>=4.8?'★':'☆'} <span>(${p.reviews.toLocaleString()})</span></div>
          <div class="p-price"><span class="cur">${this.fmt(p.price)}</span>${p.oldPrice?'<span class="old">'+this.fmt(p.oldPrice)+'</span>':''}</div>
          <button class="btn-cart" onclick="event.stopPropagation();PD.addSimilarCart(${p.id})">
            <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Ajouter au panier
          </button>
        </div>
      </div>`;
    }).join('');
  },

  toggleSimilarWish(btn, id) {
    const added = DB.toggleWishlist(id);
    btn.classList.toggle('active', added);
    this.toast(added ? 'Ajouté aux favoris ♥' : 'Retiré des favoris', added ? 'success' : 'info');
  },

  addSimilarCart(id) {
    DB.addToCart(id);
    this.syncHeader();
    this.toast('Produit ajouté au panier ✓', 'success');
  }
};
