let currentLang = 'th';
let currentPage = 'home';

// ===== REVIEWS SLIDER =====
let reviewIndex = 0;
let reviewsPerPage = 3;
let totalReviews = 0;
let currentReviewRating = 0;

function initReviews() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  totalReviews = track.querySelectorAll('.review-card').length;
  updateReviewsPerPage();
  buildDots();
  updateSlider();
  window.addEventListener('resize', () => {
    updateReviewsPerPage();
    reviewIndex = 0;
    buildDots();
    updateSlider();
  });
}

function updateReviewsPerPage() {
  const w = window.innerWidth;
  if (w < 640)       reviewsPerPage = 1;
  else if (w < 1024) reviewsPerPage = 2;
  else               reviewsPerPage = 3;
  // Update card widths
  const cards = document.querySelectorAll('.review-card');
  const gap = 20;
  cards.forEach(c => {
    c.style.minWidth = `calc(${100 / reviewsPerPage}% - ${gap * (reviewsPerPage - 1) / reviewsPerPage}px)`;
    c.style.maxWidth = c.style.minWidth;
  });
}

function buildDots() {
  const dotsEl = document.getElementById('reviews-dots');
  if (!dotsEl) return;
  const pages = Math.ceil(totalReviews / reviewsPerPage);
  dotsEl.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('div');
    d.className = 'rdot' + (i === 0 ? ' active' : '');
    d.onclick = () => { reviewIndex = i; updateSlider(); };
    dotsEl.appendChild(d);
  }
}

function slideReviews(dir) {
  const pages = Math.ceil(totalReviews / reviewsPerPage);
  reviewIndex = Math.max(0, Math.min(pages - 1, reviewIndex + dir));
  updateSlider();
}

function updateSlider() {
  const track = document.getElementById('reviews-track');
  if (!track) return;
  const card = track.querySelector('.review-card');
  if (!card) return;
  const cardW = card.offsetWidth + 20;
  track.style.transform = `translateX(-${reviewIndex * reviewsPerPage * cardW}px)`;

  const dots = document.querySelectorAll('.rdot');
  dots.forEach((d, i) => d.classList.toggle('active', i === reviewIndex));

  const pages = Math.ceil(totalReviews / reviewsPerPage);
  const leftBtn = document.querySelector('.arrow-left');
  const rightBtn = document.querySelector('.arrow-right');
  if (leftBtn)  leftBtn.disabled  = reviewIndex === 0;
  if (rightBtn) rightBtn.disabled = reviewIndex >= pages - 1;
}

// ===== WRITE REVIEW =====
function openWriteReview() {
  const el = document.getElementById('write-review-overlay');
  if (el) el.classList.remove('hidden');
  currentReviewRating = 0;
  updateStarUI(0);
}

function closeWriteReview() {
  const el = document.getElementById('write-review-overlay');
  if (el) el.classList.add('hidden');
}

function setReviewStar(val) {
  currentReviewRating = val;
  updateStarUI(val);
  const hints = {
    1: currentLang === 'th' ? 'แย่มาก 😞' : 'Very Bad 😞',
    2: currentLang === 'th' ? 'พอใช้ 😐'   : 'Fair 😐',
    3: currentLang === 'th' ? 'ปานกลาง 🙂' : 'Average 🙂',
    4: currentLang === 'th' ? 'ดีมาก 😊'   : 'Good 😊',
    5: currentLang === 'th' ? 'ยอดเยี่ยม 🤩' : 'Excellent 🤩',
  };
  const hint = document.getElementById('wr-star-hint');
  if (hint) hint.textContent = hints[val];
}

function updateStarUI(val) {
  document.querySelectorAll('.wr-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.val) <= val);
  });
}

function submitReview(e) {
  e.preventDefault();
  if (currentReviewRating === 0) {
    showToast(currentLang === 'th' ? '⭐ กรุณาให้คะแนนก่อนส่ง' : '⭐ Please rate before submitting');
    return;
  }
  const form = e.target;
  const inputs = form.querySelectorAll('input, textarea');
  const name    = inputs[0].value.trim();
  const job     = inputs[1].value.trim() || (currentLang === 'th' ? 'ลูกค้า' : 'Customer');
  const product = inputs[2].value.trim();
  const text    = inputs[3].value.trim();
  const stars   = '★'.repeat(currentReviewRating) + '☆'.repeat(5 - currentReviewRating);
  const initials = name.charAt(0).toUpperCase();
  const colors = [
    'linear-gradient(135deg,#FF6BB5,#E91E8C)',
    'linear-gradient(135deg,#FF8C00,#FFA940)',
    'linear-gradient(135deg,#9B59B6,#C39BD3)',
    'linear-gradient(135deg,#26C6DA,#0097A7)',
    'linear-gradient(135deg,#66BB6A,#388E3C)',
  ];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const newCard = document.createElement('div');
  newCard.className = 'review-card new-review';
  newCard.innerHTML = `
    <div class="review-header">
      <div class="reviewer-avatar" style="background:${color};">${initials}</div>
      <div class="reviewer-info">
        <div class="reviewer-name">${name}</div>
        <div class="reviewer-meta">${job} • ${currentLang === 'th' ? 'เพิ่งรีวิว' : 'Just reviewed'}</div>
      </div>
      <div class="review-verified">${currentLang === 'th' ? '✓ ซื้อแล้ว' : '✓ Verified'}</div>
    </div>
    <div class="review-stars">${stars}</div>
    ${product ? `<div class="review-product">${currentLang === 'th' ? 'สินค้า: ' : 'Product: '}${product}</div>` : ''}
    <p class="review-text">${text}</p>
    <div class="review-helpful"><span>👍 ${currentLang === 'th' ? 'มีประโยชน์ (0)' : 'Helpful (0)'}</span></div>
  `;
  const track = document.getElementById('reviews-track');
  if (track) {
    track.insertBefore(newCard, track.firstChild);
    totalReviews++;
    updateReviewsPerPage();
    buildDots();
    reviewIndex = 0;
    updateSlider();
    setTimeout(() => newCard.classList.remove('new-review'), 3000);
  }
  form.reset();
  closeWriteReview();
  showToast(currentLang === 'th' ? '🎉 ขอบคุณสำหรับรีวิวของคุณ!' : '🎉 Thank you for your review!');
}

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
  initReviews();
  initPromo();
});
