// ============================================
// ALLSTORE — MAIN APP (index.html)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.renderFlash();
    this.renderTrend();
    this.bindSearch();
    this.bindNav();
    this.bindCats();
    this.bindFilterTabs();
    this.bindNewsletter();
    this.startCountdown();
    this.syncHeader();
    this.stickyHeader();
    this.scrollAnimations();
    this.initScrollToTop();
  },

  // ── Toast system ──
  toast(msg, type='info') {
    const wrap = document.getElementById('toastWrap');
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML = '<span class="dot"></span>' + msg;
    wrap.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2800);
  },

  // ── Format price ──
  fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  },

  // ── Render product card HTML ──
  cardHTML(p) {
    const inWl = DB.isInWishlist(p.id);
    const badgeMap = { flash:'flash', new:'new', top:'top', discount:'disc' };
    return `
    <div class="p-card" data-id="${p.id}">
      <div class="p-card-img">
        ${p.badge ? '<span class="p-badge '+badgeMap[p.badge]+'">'+( p.badge==='flash' ? '⚡ Flash' : p.badge==='new' ? 'Nouveau' : p.badge==='top' ? '★ Top' : '-'+p.discount+'%' )+'</span>' : ''}
        <button class="p-wish ${inWl?'active':''}" data-id="${p.id}">
          <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="p-card-body">
        <div class="p-cat">${p.category}</div>
        <div class="p-title">${p.title}</div>
        <div class="p-stars">★★★★${p.rating>=4.8?'★':'☆'} <span>(${p.reviews.toLocaleString()})</span></div>
        <div class="p-price">
          <span class="cur">${this.fmt(p.price)}</span>
          ${p.oldPrice ? '<span class="old">'+this.fmt(p.oldPrice)+'</span>' : ''}
          ${p.discount ? '<span class="save">-'+p.discount+'%</span>' : ''}
        </div>
        <button class="btn-cart" data-id="${p.id}">
          <svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          Ajouter au panier
        </button>
      </div>
    </div>`;
  },

  // ── Flash grid ──
  renderFlash() {
    const flashProds = DB.products.filter(p => p.badge === 'flash');
    document.getElementById('flashGrid').innerHTML = flashProds.map(p => this.cardHTML(p)).join('');
    this.bindCards('flashGrid');
  },

  // ── Trending grid ──
  renderTrend(filter) {
    const prods = filter && filter !== 'Tout'
      ? DB.products.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()))
      : DB.products;
    document.getElementById('trendGrid').innerHTML = prods.map(p => this.cardHTML(p)).join('');
    this.bindCards('trendGrid');
  },

  // ── Bind add-to-cart & wishlist in a grid ──
  bindCards(gridId) {
    const grid = document.getElementById(gridId);
    grid.querySelectorAll('.btn-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        DB.addToCart(id);
        this.syncHeader();
        this.toast('Produit ajouté au panier ✓', 'success');
      });
    });
    grid.querySelectorAll('.p-wish').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const added = DB.toggleWishlist(id);
        btn.classList.toggle('active', added);
        this.toast(added ? 'Ajouté aux favoris ♥' : 'Retiré des favoris', added ? 'success' : 'info');
      });
    });
  },

  // ── Search ──
  bindSearch() {
    const inp = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    const doSearch = () => {
      const q = inp.value.trim();
      if (!q) { this.toast('Tapez un terme de recherche', 'warn'); return; }
      const ql = q.toLowerCase();
      const res = DB.products.filter(p => p.title.toLowerCase().includes(ql) || p.category.toLowerCase().includes(ql));
      document.getElementById('trendGrid').innerHTML = res.map(p => this.cardHTML(p)).join('');
      this.bindCards('trendGrid');
      this.toast(res.length + ' résultat(s) trouvé(s)', 'info');
      document.getElementById('trending').scrollIntoView({ behavior:'smooth', block:'start' });
    };
    btn.addEventListener('click', doSearch);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
  },

  // ── Nav links ──
  bindNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const f = link.dataset.filter;
        this.renderTrend(f === 'Tout' ? null : f);
        document.getElementById('trending').scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
  },

  // ── Category cards ──
  bindCats() {
    document.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => {
        const f = card.dataset.filter;
        this.renderTrend(f);
        document.getElementById('trending').scrollIntoView({ behavior:'smooth', block:'start' });
      });
    });
  },

  // ── Filter tabs ──
  bindFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const f = tab.dataset.filter;
        this.renderTrend(f === 'Tout' ? null : f);
      });
    });
  },

  // ── Newsletter ──
  bindNewsletter() {
    document.getElementById('nlForm').addEventListener('submit', e => {
      e.preventDefault();
      this.toast('Inscription réussie ! Vérifiez votre email ✓', 'success');
      e.target.querySelector('input').value = '';
    });
  },

  // ── Countdown ──
  startCountdown() {
    let h=5, m=32, s=18;
    const tick = () => {
      s--;
      if (s<0) { s=59; m--; }
      if (m<0) { m=59; h--; }
      if (h<0) { h=23; m=59; s=59; }
      document.getElementById('cdH').textContent = String(h).padStart(2,'0');
      document.getElementById('cdM').textContent = String(m).padStart(2,'0');
      document.getElementById('cdS').textContent = String(s).padStart(2,'0');
    };
    setInterval(tick, 1000);
  },

  // ── Sync header with session ──
  syncHeader() {
    const sess = DB.getSession();
    const badge = document.getElementById('cartBadge');
    const cnt = DB.getCartCount();
    badge.style.display = cnt > 0 ? 'flex' : 'none';
    badge.textContent = cnt;
    const actAcc = document.getElementById('actAccount');
    if (sess && sess.loggedIn) {
      actAcc.href = 'profile.html';
      actAcc.querySelector('span').textContent = sess.firstname;
      document.getElementById('hdrUser').innerHTML = 'Bonjour, <strong style="color:var(--c-gold)">'+sess.firstname+'</strong>';
    } else {
      actAcc.href = 'login.html';
      actAcc.querySelector('span').textContent = 'Compte';
      document.getElementById('hdrUser').innerHTML = '<a href="login.html" style="color:var(--c-gold)">Connectez-vous</a>';
    }
  },

  // ── Sticky hide/show header ──
  stickyHeader() {
    let last = 0;
    const hdr = document.getElementById('hdr');
    window.addEventListener('scroll', () => {
      const cur = window.scrollY;
      hdr.classList.toggle('scrolled', cur > 60);
      hdr.classList.toggle('hidden', cur > last && cur > 200);
      last = cur;
    });
  },

  // ── Scroll animations ──
  scrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
    }, { threshold:0.1, rootMargin:'0px 0px -60px 0px' });
    document.querySelectorAll('.p-card, .cat-card').forEach((el,i) => {
      el.style.opacity='0';
      el.style.transform='translateY(24px)';
      el.style.transition=`opacity .5s ease ${i%4*0.08}s, transform .5s ease ${i%4*0.08}s`;
      obs.observe(el);
    });
  },

  // ── Scroll to Top Button ──
  initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    // Smooth scroll to top on click
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};
