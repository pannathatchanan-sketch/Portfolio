let currentLang = 'th';
let currentPage = 'home';

// ===== PROMO POPUP =====
function initPromo() {
  const noShow = localStorage.getItem('promo_noshow');
  if (!noShow) {
    setTimeout(() => {
      const overlay = document.getElementById('promo-overlay');
      if (overlay) overlay.classList.remove('hidden');
    }, 800);
  }
}

function closePromo() {
  const overlay = document.getElementById('promo-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s';
    setTimeout(() => overlay.classList.add('hidden'), 250);
  }
}

function closePromoAndGo(page) {
  closePromo();
  setTimeout(() => showPage(page), 200);
}

function toggleNoShow(checkbox) {
  if (checkbox.checked) {
    localStorage.setItem('promo_noshow', '1');
  } else {
    localStorage.removeItem('promo_noshow');
  }
}

function copyCode() {
  const code = document.getElementById('promo-code-text').textContent;
  navigator.clipboard.writeText(code).catch(() => {});
  const btn = document.getElementById('copy-btn');
  const orig = btn.textContent;
  btn.textContent = currentLang === 'th' ? '✓ คัดลอกแล้ว!' : '✓ Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove('copied');
  }, 2000);
}

function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    currentPage = page;
  }
  // Update nav active state
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Re-apply language to newly shown page
  applyLang(currentLang);
}

function setLang(lang) {
  currentLang = lang;
  document.getElementById('btn-th').classList.toggle('active', lang === 'th');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  applyLang(lang);
}

function applyLang(lang) {
  // Text content
  document.querySelectorAll('[data-th][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val) el.textContent = val;
  });
  // Placeholders
  document.querySelectorAll('[data-th-placeholder][data-en-placeholder]').forEach(el => {
    const val = el.getAttribute('data-' + lang + '-placeholder');
    if (val) el.placeholder = val;
  });
  // Select options
  document.querySelectorAll('select option[data-th][data-en]').forEach(opt => {
    const val = opt.getAttribute('data-' + lang);
    if (val) opt.textContent = val;
  });
  // html lang attribute
  document.documentElement.lang = lang === 'th' ? 'th' : 'en';
}

function filterCategory(btn, category) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Filter cards
  const cards = document.querySelectorAll('#catalog-grid .product-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterProducts() {
  const query = document.getElementById('catalog-search').value.toLowerCase();
  const cards = document.querySelectorAll('#catalog-grid .product-card');
  cards.forEach(card => {
    const name = card.querySelector('.product-name');
    const desc = card.querySelector('.product-desc');
    const text = ((name ? name.textContent : '') + ' ' + (desc ? desc.textContent : '')).toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
  // Reset filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn').classList.add('active');
}

function doSearch() {
  const query = document.getElementById('home-search').value.trim();
  if (query) {
    showPage('catalog');
    setTimeout(() => {
      const searchInput = document.getElementById('catalog-search');
      if (searchInput) {
        searchInput.value = query;
        filterProducts();
      }
    }, 100);
  }
}

function addToCart(btn) {
  const card = btn.closest('.product-card');
  const name = card.querySelector('.product-name').textContent;
  showToast(currentLang === 'th' ? `เพิ่ม "${name}" ลงในตะกร้าแล้ว 🛒` : `"${name}" added to cart 🛒`);
}

function submitForm(e) {
  e.preventDefault();
  showToast(currentLang === 'th' ? 'ส่งข้อความสำเร็จ! เราจะติดต่อกลับเร็วๆ นี้ ✅' : 'Message sent! We will contact you soon ✅');
  e.target.reset();
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3000);
}

// Allow pressing Enter in home search
document.addEventListener('DOMContentLoaded', () => {
  const hs = document.getElementById('home-search');
  if (hs) hs.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  const cs = document.getElementById('catalog-search');
  if (cs) cs.addEventListener('keydown', e => { if (e.key === 'Enter') filterProducts(); });
  applyLang(currentLang);
  initPromo();
});
