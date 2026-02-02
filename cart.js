// ============================================
// ALLSTORE — CART PAGE LOGIC
// ============================================
document.addEventListener('DOMContentLoaded', () => Cart.init());

const Cart = {
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
    this.syncHeader();
    this.render();
    this.bindPromo();

    document.getElementById('btnClear').addEventListener('click', () => {
      DB.clearCart(); DB.clearPromo(); this.render(); this.toast('Panier vidé', 'info');
    });
    document.getElementById('btnCheckout').addEventListener('click', () => this.checkout());
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

  render() {
    const cart = DB.getCart();
    const container = document.getElementById('cartItems');
    document.getElementById('cartCount').textContent = cart.length > 0 ? `(${cart.length} article${cart.length>1?'s':''})` : '';

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des produits pour commencer vos achats</p>
          <a href="index.html" class="btn-gold">Explorer les produits</a>
        </div>`;
      this.updateSummary();
      document.getElementById('btnCheckout').disabled = true;
      return;
    }

    container.innerHTML = cart.map((item, i) => {
      const saving = item.oldPrice ? item.oldPrice - item.price : 0;
      return `
      <div class="cart-item" style="animation-delay:${i*0.06}s">
        <div class="ci-img"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>
        <div class="ci-info">
          <div class="ci-cat">${item.category}</div>
          <div class="ci-title">${item.title}</div>
          <div class="ci-meta">
            <span class="in-stock">✓ En stock</span>
            ${DB.getCartTotal() >= 50000 ? '<span>🚚 Livraison gratuite</span>' : ''}
          </div>
          <div style="margin-top:12px;display:flex;align-items:center;gap:16px;">
            <div class="qty-wrap">
              <button class="qty-minus" data-id="${item.id}">−</button>
              <input type="number" value="${item.qty}" min="1" max="10" class="qty-val" data-id="${item.id}" readonly>
              <button class="qty-plus" data-id="${item.id}">+</button>
            </div>
            <button class="btn-remove" data-id="${item.id}">Retirer</button>
          </div>
        </div>
        <div class="ci-price">
          <span class="cur">${this.fmt(item.price * item.qty)}</span>
          ${item.oldPrice ? '<span class="old">'+this.fmt(item.oldPrice * item.qty)+'</span>' : ''}
          ${saving > 0 ? '<span class="save">Économie : '+this.fmt(saving * item.qty)+'</span>' : ''}
        </div>
      </div>`;
    }).join('');

    // Bind qty buttons
    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = DB.getCart().find(i => i.id === id);
        if (item && item.qty > 1) { DB.updateCartQty(id, item.qty - 1); this.render(); }
      });
    });
    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = DB.getCart().find(i => i.id === id);
        if (item && item.qty < 10) { DB.updateCartQty(id, item.qty + 1); this.render(); }
      });
    });
    container.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        DB.removeFromCart(parseInt(btn.dataset.id));
        this.render();
        this.toast('Produit retiré du panier', 'info');
      });
    });

    this.updateSummary();
    document.getElementById('btnCheckout').disabled = false;
  },

  updateSummary() {
    const subtotal = DB.getCartTotal();
    const shipping = subtotal >= 50000 ? 0 : 2500;
    const promo = DB.getActivePromo();
    let discount = 0;
    if (promo) { discount = Math.round(subtotal * promo.discount / 100); }
    const total = subtotal + shipping - discount;

    document.getElementById('csSubtotal').textContent = this.fmt(subtotal);
    const shipRow = document.getElementById('csShipRow');
    shipRow.querySelector('.val').textContent = shipping === 0 ? 'Gratuit' : this.fmt(shipping);
    shipRow.classList.toggle('free', shipping === 0);

    const promoRow = document.getElementById('csPromoRow');
    if (promo && discount > 0) {
      promoRow.style.display = 'flex';
      document.getElementById('csPromoVal').textContent = '−' + this.fmt(discount);
    } else { promoRow.style.display = 'none'; }

    document.getElementById('csTotal').textContent = this.fmt(Math.max(0, total));
  },

  bindPromo() {
    // Check if promo already active
    const existing = DB.getActivePromo();
    if (existing) { this.showActivePromo(existing); }

    document.getElementById('btnApplyPromo').addEventListener('click', () => {
      const code = document.getElementById('promoInput').value.trim();
      if (!code) { this.toast('Entrez un code promo', 'warn'); return; }
      const res = DB.applyPromo(code);
      if (res.ok) {
        this.toast(`Code appliqué ! −${res.discount}% sur le sous-total`, 'success');
        this.showActivePromo({ code: code.toUpperCase(), discount: res.discount });
        this.updateSummary();
      } else {
        this.toast('Code promo invalide', 'error');
      }
    });

    document.getElementById('btnClearPromo').addEventListener('click', () => {
      DB.clearPromo();
      document.getElementById('promoInputWrap').style.display = 'flex';
      document.getElementById('promoActive').style.display = 'none';
      document.getElementById('promoInput').value = '';
      this.updateSummary();
      this.toast('Code promo retiré', 'info');
    });
  },

  showActivePromo(promo) {
    document.getElementById('promoInputWrap').style.display = 'none';
    document.getElementById('promoActive').style.display = 'flex';
    document.getElementById('promoActiveLabel').textContent = `${promo.code} (−${promo.discount}%)`;
  },

  checkout() {
    const sess = DB.getSession();
    if (!sess || !sess.loggedIn) {
      this.toast('Connectez-vous pour finaliser votre commande', 'warn');
      setTimeout(() => { window.location.href = 'login.html'; }, 1400);
      return;
    }
    const cart = DB.getCart();
    if (cart.length === 0) return;
    const order = DB.placeOrder(cart);
    this.toast(`Commande ${order.id} placée avec succès !`, 'success');
    setTimeout(() => { window.location.href = 'profile.html'; }, 1600);
  }
};
