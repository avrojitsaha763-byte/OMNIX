/* ============================================================
   OMNIX CORE — Main Application Logic
   State, Navigation, Cart, Notifications, Animations
   ============================================================ */

'use strict';

// ============================================================
// 1. GLOBAL STATE
// ============================================================
const OMNIX = {
  cart: JSON.parse(localStorage.getItem('omnix_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('omnix_wishlist') || '[]'),
  user: {
    name: 'Alex Kumar',
    xp: 4750,
    level: 12,
    wallet: 12480,
    cashback: 1240,
    tier: 'GOLD'
  },
  settings: {
    currency: 'INR',
    currencySymbol: '₹'
  }
};

// ============================================================
// 2. NAVIGATION
// ============================================================
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // Scroll effect
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mark active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
})();

// ============================================================
// 3. CART SYSTEM
// ============================================================
function saveCart() {
  localStorage.setItem('omnix_cart', JSON.stringify(OMNIX.cart));
  updateCartUI();
}

function updateCartUI() {
  const badge = document.getElementById('cartCount');
  if (badge) {
    const count = OMNIX.cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  // Render cart drawer
  const list = document.getElementById('cartItemsList');
  const total = document.getElementById('cartTotal');
  if (!list) return;

  if (OMNIX.cart.length === 0) {
    list.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:var(--text-muted)">
        <div style="font-size:64px;margin-bottom:16px">🛒</div>
        <div style="font-size:16px;font-weight:600;margin-bottom:8px">Your cart is empty</div>
        <div style="font-size:14px">Add items to get started</div>
      </div>`;
  } else {
    list.innerHTML = OMNIX.cart.map(item => `
      <div style="display:flex;gap:12px;padding:16px;border-bottom:1px solid var(--color-border)">
        <div style="width:64px;height:64px;background:var(--color-surface-2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">${item.emoji}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:600;margin-bottom:2px">${item.name}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${item.brand}</div>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <div style="font-family:var(--font-display);font-size:16px;font-weight:700">₹${item.price.toLocaleString()}</div>
            <div style="display:flex;align-items:center;gap:8px">
              <button onclick="updateQty('${item.id}',-1)" style="width:28px;height:28px;border-radius:50%;background:var(--color-surface-3);border:1px solid var(--color-border);color:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">−</button>
              <span style="font-weight:700;min-width:20px;text-align:center">${item.qty}</span>
              <button onclick="updateQty('${item.id}',1)" style="width:28px;height:28px;border-radius:50%;background:var(--color-surface-3);border:1px solid var(--color-border);color:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center">+</button>
            </div>
          </div>
        </div>
      </div>`).join('');
  }

  if (total) {
    const subtotal = OMNIX.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Math.floor(subtotal * 0.08);
    const shipping = subtotal > 500 ? 0 : 49;
    total.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px"><span style="color:var(--text-secondary)">Subtotal</span><span>₹${subtotal.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px"><span style="color:var(--emerald)">OMNIX Discount (8%)</span><span style="color:var(--emerald)">−₹${discount.toLocaleString()}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:16px"><span style="color:var(--text-secondary)">Shipping</span><span>${shipping === 0 ? '<span style="color:var(--emerald)">FREE</span>' : '₹' + shipping}</span></div>
      <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:800;font-family:var(--font-display);margin-bottom:20px"><span>Total</span><span>₹${(subtotal - discount + shipping).toLocaleString()}</span></div>
      <button class="btn btn-primary" style="width:100%;font-size:16px;height:52px" onclick="checkout()">Checkout →</button>
    `;
  }
}

function addToCart(id, name, brand, price, emoji = '📦') {
  const existing = OMNIX.cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    OMNIX.cart.push({ id, name, brand, price, emoji, qty: 1 });
  }
  saveCart();
  showToast(`${emoji} ${name} added to cart!`, 'success');
  
  // Animate cart icon
  const cartBtn = document.getElementById('cartBtn');
  if (cartBtn) {
    cartBtn.style.animation = 'none';
    cartBtn.offsetHeight;
    cartBtn.style.animation = 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
  }
}

function updateQty(id, delta) {
  const item = OMNIX.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) OMNIX.cart = OMNIX.cart.filter(i => i.id !== id);
  saveCart();
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;
  drawer.classList.toggle('open');
  backdrop.classList.toggle('open');
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartBackdrop')?.classList.remove('open');
}

function checkout() {
  closeCart();
  showToast('🎉 Redirecting to checkout...', 'info');
  setTimeout(() => {
    showConfetti();
    showToast('✅ Order placed successfully!', 'success');
    OMNIX.cart = [];
    saveCart();
  }, 1500);
}

// ============================================================
// 4. TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-size:18px">${icons[type]}</span>
    <span style="font-size:14px;font-weight:500;flex:1">${message}</span>
    <button onclick="this.parentElement.remove()" style="font-size:16px;color:var(--text-muted);background:none;border:none;cursor:pointer;padding:0">✕</button>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ============================================================
// 5. CART DRAWER HTML — Auto Inject
// ============================================================
(function injectCartDrawer() {
  if (document.getElementById('cartDrawer')) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'cartBackdrop';
  backdrop.className = 'cart-backdrop';
  backdrop.onclick = closeCart;
  document.body.appendChild(backdrop);

  const drawer = document.createElement('div');
  drawer.id = 'cartDrawer';
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:24px 24px 16px;border-bottom:1px solid var(--color-border)">
      <div>
        <h3 style="font-family:var(--font-display);font-size:22px;font-weight:800">Shopping Cart 🛒</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-top:2px">Universal cart — all stores, one checkout</p>
      </div>
      <button onclick="closeCart()" style="width:36px;height:36px;border-radius:50%;background:var(--color-surface-2);border:1px solid var(--color-border);color:var(--text-primary);cursor:pointer;font-size:18px">✕</button>
    </div>
    <div id="cartItemsList" style="flex:1;overflow-y:auto"></div>
    <div id="cartTotal" style="padding:24px;border-top:1px solid var(--color-border);background:var(--color-deep)"></div>
  `;
  document.body.appendChild(drawer);

  updateCartUI();
})();

// ============================================================
// 6. SEARCH MODAL — Auto Inject
// ============================================================
(function injectSearchModal() {
  if (document.getElementById('searchModal')) return;

  const modal = document.createElement('div');
  modal.id = 'searchModal';
  modal.className = 'overlay';
  modal.innerHTML = `
    <div style="width:100%;max-width:720px;padding:0 24px">
      <div style="margin-bottom:16px">
        <div class="mega-search-box" style="border-radius:16px">
          <div class="mega-search-mode">⚡ AI Search</div>
          <input id="globalSearch" class="mega-search-input" placeholder="Search products, services, creators, B2B suppliers..." autofocus onkeyup="globalSearchFn(event)">
          <div class="mega-search-actions">
            <button class="search-mode-btn" title="Voice Search" onclick="showToast('🎙️ Voice search activated!','info')">🎙️</button>
            <button class="search-mode-btn" title="Image Search" onclick="showToast('📷 Image search activated!','info')">📷</button>
            <button class="mega-search-btn" onclick="doSearch()">🔍</button>
          </div>
        </div>
      </div>
      <div id="searchSuggestions" class="search-suggestions show" style="position:static;display:block;border-radius:16px">
        <div style="padding:16px 20px 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">Trending Searches</div>
        ${['iPhone 16 Pro', 'Samsung Galaxy S25 Ultra', 'Gaming Chair', 'Nike Air Max 2026', 'MacBook Pro M4', 'Sony WH-1000XM6', 'Organic Groceries Bundle'].map(q => `
          <div class="suggestion-item" onclick="goSearch('${q}')">
            <span class="suggestion-icon">🔥</span>
            <span class="suggestion-text">${q}</span>
            <span class="suggestion-category">Trending</span>
          </div>`).join('')}
        <div style="padding:16px 20px 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-top:8px">Quick Navigate</div>
        ${[['marketplace.html','🛒','Marketplace','Browse all products'],['ai-agent.html','🤖','AI Agent','Let AI shop for you'],['quick-commerce.html','⚡','Quick Commerce','10-min delivery'],['b2b.html','🏭','B2B','Bulk & wholesale']].map(([href,icon,label,desc]) => `
          <div class="suggestion-item" onclick="window.location.href='${href}'">
            <span class="suggestion-icon">${icon}</span>
            <span class="suggestion-text">${label}</span>
            <span class="suggestion-category">${desc}</span>
          </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:12px"><button onclick="document.getElementById('searchModal').classList.remove('open')" class="btn btn-ghost btn-sm">Close ✕</button></div>
    </div>
  `;
  modal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
  document.body.appendChild(modal);
})();

function globalSearchFn(e) {
  if (e.key === 'Enter') doSearch();
}

function doSearch() {
  const q = document.getElementById('globalSearch')?.value;
  goSearch(q);
}

function goSearch(q) {
  if (!q) return;
  document.getElementById('searchModal').classList.remove('open');
  showToast(`🔍 Searching for "${q}"...`, 'info');
  setTimeout(() => window.location.href = `marketplace.html?q=${encodeURIComponent(q)}`, 800);
}

// ============================================================
// 7. SCROLL REVEAL OBSERVER
// ============================================================
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
})();

// ============================================================
// 8. CURSOR GLOW
// ============================================================
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();

// ============================================================
// 9. COUNTER ANIMATION
// ============================================================
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration || 2000);

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateCounter(el, target, duration, prefix, suffix);
        observer.disconnect();
      }
    });
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', initCounters);

// ============================================================
// 10. CONFETTI
// ============================================================
function showConfetti() {
  const colors = ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#F43F5E', '#FAFAFA'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --duration: ${2 + Math.random() * 2}s;
      --delay: ${Math.random() * 0.5}s;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

// ============================================================
// 11. WISHLIST
// ============================================================
function toggleWishlist(id, name, emoji = '❤️') {
  const idx = OMNIX.wishlist.findIndex(i => i.id === id);
  if (idx > -1) {
    OMNIX.wishlist.splice(idx, 1);
    showToast(`Removed from wishlist`, 'info');
  } else {
    OMNIX.wishlist.push({ id, name, emoji });
    showToast(`${emoji} Added to wishlist!`, 'success');
  }
  localStorage.setItem('omnix_wishlist', JSON.stringify(OMNIX.wishlist));
  document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', OMNIX.wishlist.some(i => i.id === id));
  });
}

// ============================================================
// 12. TILT EFFECT
// ============================================================
function initTilt() {
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

document.addEventListener('DOMContentLoaded', initTilt);

// ============================================================
// 13. PARTICLE SYSTEM
// ============================================================
function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.1
  }));

  const colors = ['124,58,237', '6,182,212', '245,158,11'];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      const color = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color},${p.opacity})`;
      ctx.fill();

      // Connections
      particles.slice(i + 1).forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  });
}

// ============================================================
// 14. INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  // Auto-init particles if canvas exists
  if (document.getElementById('heroParticles')) {
    initParticles('heroParticles');
  }
});

// Export globals for inline use
window.OMNIX = OMNIX;
window.addToCart = addToCart;
window.updateQty = updateQty;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.checkout = checkout;
window.showToast = showToast;
window.showConfetti = showConfetti;
window.toggleWishlist = toggleWishlist;
window.initParticles = initParticles;
window.goSearch = goSearch;
