/**
 * TORVEX — Industrial & Master Platform
 * script.js — Main Application Logic
 * Author: Sarvarbek Rahmonjonov
 * Version: 2.0.0
 */

'use strict';

// ════════════════════════════════════════════════════════════
// GLOBAL STATE
// ════════════════════════════════════════════════════════════

const App = {
  currentSection: 'dash',
  currentUser: null,
  theme: localStorage.getItem('torvex_theme') || 'dark',
  cart: JSON.parse(localStorage.getItem('torvex_cart') || '[]'),
  favorites: JSON.parse(localStorage.getItem('torvex_favs') || '{"masters":[],"products":[],"posts":[]}'),
  notifications: [],
  feedPosts: [],
  feedPage: 0,
  feedFilter: 'all',
  mastersData: [],
  mastersFilter: 'all',
  mastersSortBy: 'rating',
  marketData: [],
  marketFilter: 'all',
  marketSortBy: 'popular',
  marketView: 'grid',
  projectsData: [],
  chatsData: [],
  activeChat: null,
  messages: {},
  postType: 'sale',
  composerImages: [],
  unreadCount: 0,
  sidebarOpen: false,
  fabMenuOpen: false,
  notifPanelOpen: false,
};

// ════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════

const MOCK_MASTERS = [
  { id: 1, name: 'Alisher Toshmatov', job: 'Elektrik', rating: 4.9, reviews: 127, exp: 8, price: 80000, region: 'Toshkent', phone: '+998901234567', bio: "Yuqori kuchlanishli tarmoqlar bilan 8 yillik tajriba. Sifat kafolatlanadi.", avatar: '', verified: true, premium: true, completed: 89, online: true },
  { id: 2, name: 'Bobur Rahimov', job: 'Santexnik', rating: 4.8, reviews: 98, exp: 6, price: 70000, region: 'Toshkent', phone: '+998901234568', bio: "Har qanday muammoni hal qilamiz. Tez, sifatli, kafolat bilan.", avatar: '', verified: true, premium: false, completed: 74, online: true },
  { id: 3, name: 'Sardor Yusupov', job: 'Malyar', rating: 4.7, reviews: 85, exp: 5, price: 60000, region: 'Samarqand', phone: '+998901234569', bio: "Zamonaviy bo'yoq texnologiyalari bilan ishlash tajribasi.", avatar: '', verified: true, premium: true, completed: 62, online: false },
  { id: 4, name: 'Jasur Mirzayev', job: 'Kafelchi', rating: 4.9, reviews: 143, exp: 10, price: 90000, region: 'Toshkent', phone: '+998901234570', bio: "Granit, mramor, keramika. 10 yillik tajriba. Portfolio mavjud.", avatar: '', verified: true, premium: true, completed: 112, online: true },
  { id: 5, name: 'Nodir Xasanov', job: 'Duradgor', rating: 4.6, reviews: 67, exp: 7, price: 75000, region: 'Farg\'ona', phone: '+998901234571', bio: "Mebel yasash, ta'mirlash. Maxsus buyurtmalar qabul qilinadi.", avatar: '', verified: false, premium: false, completed: 48, online: false },
  { id: 6, name: 'Sherzod Nazarov', job: 'Gipschi', rating: 4.8, reviews: 92, exp: 9, price: 65000, region: 'Toshkent', phone: '+998901234572', bio: "Gips qoplamalar, naqshli ishlar. Dizayn bo'yicha maslahat beramiz.", avatar: '', verified: true, premium: false, completed: 81, online: true },
  { id: 7, name: 'Ulugbek Sotvoldiyev', job: 'Konditsioner', rating: 4.7, reviews: 74, exp: 4, price: 85000, region: 'Toshkent', phone: '+998901234573', bio: "Barcha markadagi konditsionerlarni o'rnatish va ta'mirlash.", avatar: '', verified: true, premium: false, completed: 55, online: false },
  { id: 8, name: 'Furqat Mahmudov', job: 'Elektrik', rating: 4.5, reviews: 56, exp: 3, price: 55000, region: 'Namangan', phone: '+998901234574', bio: "Uy va ofis elektr ishlari. Tejamkor narxlar.", avatar: '', verified: false, premium: false, completed: 34, online: true },
  { id: 9, name: 'Kamol Tursunov', job: 'Santexnik', rating: 4.9, reviews: 165, exp: 12, price: 95000, region: 'Toshkent', phone: '+998901234575', bio: "Senior santexnik. Murakkab loyihalarni bajarishga ixtisoslashganman.", avatar: '', verified: true, premium: true, completed: 143, online: true },
  { id: 10, name: 'Dilshod Ergashev', job: 'Malyar', rating: 4.6, reviews: 43, exp: 2, price: 45000, region: 'Buxoro', phone: '+998901234576', bio: "Yangi texnologiyalar bilan ishlashni yaxshi ko'raman.", avatar: '', verified: false, premium: false, completed: 28, online: false },
  { id: 11, name: 'Otabek Qodirov', job: 'Kranchik', rating: 4.8, reviews: 88, exp: 11, price: 120000, region: 'Toshkent', phone: '+998901234577', bio: "Og'ir yuk ko'tarish va montaj ishlari. Litsenziyali operatorlar.", avatar: '', verified: true, premium: true, completed: 76, online: false },
  { id: 12, name: 'Husan Razzaqov', job: 'Duradgor', rating: 4.7, reviews: 61, exp: 6, price: 70000, region: 'Andijon', phone: '+998901234578', bio: "Interer bezak, pol qoplamalar. Maxsus dizayn yechimlari.", avatar: '', verified: true, premium: false, completed: 44, online: true },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Portland Sement M400', category: 'sement', price: 85000, unit: 'qop', brand: 'Quvaysement', rating: 4.8, reviews: 234, stock: 150, description: 'Yuqori sifatli Portland sement. Qurilish uchun ideal.', badge: 'Top sotiluvchi', discount: 0, image: '' },
  { id: 2, name: 'Armatura Ø12 A500C', category: 'arma', price: 12500, unit: 'metr', brand: 'O\'zmetall', rating: 4.7, reviews: 189, stock: 500, description: 'Yuqori mustahkamlikdagi qurilish armaturai.', badge: '', discount: 5, image: '' },
  { id: 3, name: 'Knauf Gips GB+', category: 'gips', price: 48000, unit: 'qop', brand: 'Knauf', rating: 4.9, reviews: 312, stock: 80, description: 'Professional gips qoplama. Tez quriydigan formula.', badge: 'Mashhur', discount: 0, image: '' },
  { id: 4, name: 'Kabel VVG 3×2.5', category: 'elektr', price: 8900, unit: 'metr', brand: 'Electrika', rating: 4.6, reviews: 156, stock: 1000, description: 'Mis o\'tkazgichli elektr kabeli. GOST standartiga mos.', badge: '', discount: 10, image: '' },
  { id: 5, name: 'Politropan Truba 32mm', category: 'santex', price: 5500, unit: 'metr', brand: 'Valsir', rating: 4.7, reviews: 98, stock: 300, description: 'Issiq va sovuq suv uchun polipropilen truba.', badge: '', discount: 0, image: '' },
  { id: 6, name: 'Perforator Bosch GBH 2-26', category: 'asbob', price: 1250000, unit: 'dona', brand: 'Bosch', rating: 4.9, reviews: 445, stock: 15, description: 'Professional perforator. SDS-plus patron. 800W.', badge: 'Pro', discount: 0, image: '' },
  { id: 7, name: 'Tikkurila Betomix Bo\'yoq', category: 'bo\'yoq', price: 185000, unit: 'vedro', brand: 'Tikkurila', rating: 4.8, reviews: 267, stock: 45, description: 'Fasad va ichki ishlar uchun premium bo\'yoq.', badge: 'Yangi', discount: 0, image: '' },
  { id: 8, name: 'Sement M500 D0', category: 'sement', price: 98000, unit: 'qop', brand: 'Ahangarsement', rating: 4.9, reviews: 178, stock: 200, description: 'Eng yuqori sifat. Yuqori mustahkamlik uchun.', badge: '', discount: 0, image: '' },
  { id: 9, name: 'Armatura Ø10 A400', category: 'arma', price: 9800, unit: 'metr', brand: 'O\'zmetall', rating: 4.6, reviews: 134, stock: 750, description: 'Standart qurilish armaturai.', badge: '', discount: 0, image: '' },
  { id: 10, name: 'Makita Arra DHS680', category: 'asbob', price: 1850000, unit: 'dona', brand: 'Makita', rating: 4.9, reviews: 321, stock: 8, description: 'Akkumulyatorli arra. 165mm. 18V.', badge: 'Top', discount: 15, image: '' },
  { id: 11, name: 'Elektr Rozetka ABB', category: 'elektr', price: 35000, unit: 'dona', brand: 'ABB', rating: 4.7, reviews: 89, stock: 200, description: 'Zamonaviy rozetka. IP44. Suv o\'tkazmaydi.', badge: '', discount: 0, image: '' },
  { id: 12, name: 'Mixer Sikhto Batareya', category: 'santex', price: 450000, unit: 'dona', brand: 'Grohe', rating: 4.8, reviews: 123, stock: 30, description: 'Oshxona kranli aralashtirgich. Xrom qoplama.', badge: '', discount: 5, image: '' },
];

const MOCK_POSTS = [
  { id: 1, type: 'sale', user: { name: 'Jasur M.', role: 'Kafelchi', avatar: '' }, text: 'Yangi keramik plitka sotyapman. Italiya importi. 1m² — 85,000 so\'m. Toshkent bo\'yicha yetkazib berish bor. 📦', price: 85000, images: [], likes: 24, comments: 8, shares: 3, time: '2 soat oldin', location: 'Toshkent', saved: false },
  { id: 2, type: 'job', user: { name: 'Abdulloh K.', role: 'Buyurtmachi', avatar: '' }, text: '🔧 Santexnik kerak! 3 xonali kvartira ta\'miri. Ish 3-4 kun. Narxi kelishiladi. Qo\'ng\'iroq qiling!', price: null, images: [], likes: 15, comments: 12, shares: 6, time: '4 soat oldin', location: 'Chilonzor, Toshkent', saved: false },
  { id: 3, type: 'service', user: { name: 'Sardor Y.', role: 'Malyar', avatar: '' }, text: '🎨 Professional bo\'yash xizmati! Zamonaviy texnologiyalar bilan. 1m² — 15,000 so\'mdan. Kafolat beriladi. Rasm va portfolio uchun DM.', price: 15000, images: [], likes: 31, comments: 5, shares: 9, time: '6 soat oldin', location: 'Toshkent', saved: false },
  { id: 4, type: 'buy', user: { name: 'Otabek R.', role: 'Sotuvchi', avatar: '' }, text: '🏗️ Eski armatura sotib olaman. Toza holat. Narx kelishiladi. Toshkent bo\'yicha o\'zim olib ketaman.', price: null, images: [], likes: 7, comments: 3, shares: 1, time: '8 soat oldin', location: 'Toshkent', saved: false },
  { id: 5, type: 'news', user: { name: 'TORVEX Admin', role: 'Admin', avatar: '' }, text: '📢 TORVEX platformasida yangi funksiyalar! Endi ustalar va buyurtmachilar real vaqtda muloqot qilishi mumkin. Premium paketlar narxlari yangilandi!', price: null, images: [], likes: 89, comments: 23, shares: 41, time: '1 kun oldin', location: '', saved: false },
  { id: 6, type: 'sale', user: { name: 'Behruz T.', role: 'Sotuvchi', avatar: '' }, text: '🪵 Duradgorlik mahsulotlari! Eshik, deraza ramkalari. Material — yangi yog\'och. Narxlar arzon. Buyurtma qabul qilinadi.', price: 350000, images: [], likes: 18, comments: 6, shares: 4, time: '1 kun oldin', location: 'Yunusobod, Toshkent', saved: false },
];

const MOCK_NEWS = [
  { id: 1, title: 'Qurilish materiallari narxi o\'zgarishi', category: 'Bozor', text: 'Yanvar oyida sement va armatura narxlari 5-8% ga tushdi. Ekspertlar bu tendensiya davom etishini aytmoqda.', time: '2 soat oldin', image: '', views: 1240, read: false },
  { id: 2, title: 'TORVEX v2.0 yangi funksiyalar bilan', category: 'Platforma', text: 'Yangi versiyada real-time chat, video qo\'ng\'iroq va AI asosidagi usta tavsiya tizimi ishga tushdi.', time: '5 soat oldin', image: '', views: 3200, read: false },
  { id: 3, title: 'Elektr ta\'minoti yangiliklari', category: 'Sanoat', text: 'O\'zbekistonda yangi energiya tejash qoidalari kiritildi. Ustalar uchun o\'quv kurslari boshlanadi.', time: '1 kun oldin', image: '', views: 890, read: true },
  { id: 4, title: 'Eng yaxshi 10 usta — Dekabr 2024', category: 'Reyting', text: 'Oylik reyting: Jasur Mirzayev (Kafelchi) birinchi o\'rinda. Kamol Tursunov (Santexnik) ikkinchi.', time: '2 kun oldin', image: '', views: 4500, read: true },
  { id: 5, title: 'Qishki chegirma mavsumi boshlandi', category: 'Aksiya', text: 'TORVEX bozorida 200+ mahsulotga 10-30% chegirma. Kampaniya 31 yanvargacha davom etadi.', time: '3 kun oldin', image: '', views: 6700, read: true },
];

const MOCK_PROJECTS = [
  { id: 1, title: '3 xonali kvartira ta\'miri', status: 'active', budget: 15000000, spent: 8500000, progress: 57, deadline: '2025-03-15', master: 'Jasur Mirzayev', category: 'Ta\'mir' },
  { id: 2, title: 'Ofis elektr tizimi', status: 'pending', budget: 5000000, spent: 0, progress: 0, deadline: '2025-04-01', master: 'Alisher Toshmatov', category: 'Elektr' },
  { id: 3, title: 'Hammom plitka ishlari', status: 'done', budget: 3500000, spent: 3200000, progress: 100, deadline: '2024-12-20', master: 'Nodir Xasanov', category: 'Kafel' },
];

const MOCK_CHATS = [
  { id: 1, type: 'direct', name: 'Alisher Toshmatov', role: 'Elektrik', avatar: '', online: true, unread: 2, lastMessage: 'Xop, ertaga kelaman', lastTime: '14:32' },
  { id: 2, type: 'direct', name: 'Jasur Mirzayev', role: 'Kafelchi', avatar: '', online: false, unread: 0, lastMessage: 'Narx bo\'yicha kelishdik', lastTime: 'Kecha' },
  { id: 3, type: 'group', name: 'TORVEX Toshkent', role: 'Guruh', avatar: '', online: true, unread: 5, lastMessage: 'Kim bugun Chilonzorda?', lastTime: '10:15' },
  { id: 4, type: 'direct', name: 'Bobur Rahimov', role: 'Santexnik', avatar: '', online: true, unread: 0, lastMessage: 'Rasm jo\'nating', lastTime: 'Dush' },
];

const PRICE_TICKER_DATA = [
  { name: 'Sement M400', price: '85 000', change: -3.2, unit: 'so\'m/qop' },
  { name: 'Armatura Ø12', price: '12 500', change: +1.5, unit: 'so\'m/m' },
  { name: 'Gips Knauf', price: '48 000', change: 0, unit: 'so\'m/qop' },
  { name: 'Qum (o\'rtacha)', price: '450 000', change: -1.8, unit: 'so\'m/m³' },
  { name: 'G\'isht M150', price: '1 200', change: +2.1, unit: 'so\'m/dona' },
  { name: 'Yog\'och 50×100', price: '8 500', change: +0.5, unit: 'so\'m/m' },
];

const NOTIFICATIONS_DATA = [
  { id: 1, type: 'message', icon: 'fas fa-comment', color: 'blue', text: 'Alisher sizga xabar jo\'natdi', time: '5 min oldin', read: false },
  { id: 2, type: 'system', icon: 'fas fa-star', color: 'amber', text: 'Sizning reytingingiz 4.8 ga ko\'tarildi', time: '1 soat oldin', read: false },
  { id: 3, type: 'promo', icon: 'fas fa-tag', color: 'green', text: 'Qishki chegirma: Bozorda 30% off', time: '3 soat oldin', read: false },
  { id: 4, type: 'system', icon: 'fas fa-check-circle', color: 'teal', text: 'Profilingiz tasdiqlandi', time: '1 kun oldin', read: true },
];

// ════════════════════════════════════════════════════════════
// INITIALIZATION
// ════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  simulateLoading();
  initApp();
  bindGlobalEvents();
});

function simulateLoading() {
  const screen = document.getElementById('loadingScreen');
  const fill = document.querySelector('.loader-fill');
  if (!screen) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25 + 10;
    if (fill) fill.style.width = Math.min(progress, 95) + '%';
    if (progress >= 100) {
      clearInterval(interval);
      if (fill) fill.style.width = '100%';
      setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => screen.remove(), 500);
      }, 300);
    }
  }, 200);
}

function initApp() {
  initData();
  animateCounters();
  renderFeed();
  renderTopMasters();
  renderPriceTicker();
  renderNotifications();
  renderProjectsMini();
  updateCartBadge();
  initSearch();
  initThemeToggle();
  handleURLHash();
  startPriceTickerAnimation();
}

function initData() {
  App.mastersData = [...MOCK_MASTERS];
  App.marketData = [...MOCK_PRODUCTS];
  App.feedPosts = [...MOCK_POSTS];
  App.notifications = [...NOTIFICATIONS_DATA];
  App.projectsData = [...MOCK_PROJECTS];
  App.chatsData = [...MOCK_CHATS];
  App.unreadCount = App.notifications.filter(n => !n.read).length;
  updateUnreadBadge();
}

function handleURLHash() {
  const hash = window.location.hash.replace('#', '');
  const valid = ['dash','feed','ustalar','bozor','muhokama','loyihalar','yangiliklar','profil','sevimlilari','sozlamalar'];
  if (hash && valid.includes(hash)) showSection(hash);
}

// ════════════════════════════════════════════════════════════
// SECTION NAVIGATION
// ════════════════════════════════════════════════════════════

function showSection(id) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
    requestAnimationFrame(() => {
      target.classList.add('active');
    });
  }

  // Update sidebar nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    item.removeAttribute('aria-current');
  });
  const navItem = document.getElementById('nav-' + id);
  if (navItem) {
    navItem.classList.add('active');
    navItem.setAttribute('aria-current', 'page');
  }

  // Update bottom nav
  document.querySelectorAll('.bn-item').forEach(btn => btn.classList.remove('active'));
  const bnItem = document.getElementById('bn-' + id);
  if (bnItem) bnItem.classList.add('active');

  App.currentSection = id;
  window.location.hash = id;
  closeSidebar();
  closeNotifPanel();

  // Lazy-render sections
  switch (id) {
    case 'feed':       renderFullFeed(); break;
    case 'ustalar':    renderMasters(); break;
    case 'bozor':      renderMarket(); break;
    case 'muhokama':   renderChats(); break;
    case 'loyihalar':  renderProjects(); break;
    case 'yangiliklar': renderNews(); break;
    case 'sevimlilari': renderFavorites(); break;
    case 'profil':     renderProfile(); break;
    case 'sozlamalar': renderSettings(); break;
  }

  // Scroll to top
  const wrapper = document.getElementById('sectionsWrapper');
  if (wrapper) wrapper.scrollTop = 0;
}

// ════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('collapsed')) {
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.classList.add('collapsed');
  }
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.add('open');
  if (overlay) overlay.classList.add('visible');
  App.sidebarOpen = true;
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
  App.sidebarOpen = false;
}

// ════════════════════════════════════════════════════════════
// THEME
// ════════════════════════════════════════════════════════════

function initTheme() {
  document.documentElement.setAttribute('data-theme', App.theme);
  updateThemeUI();
}

function toggleTheme() {
  App.theme = App.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', App.theme);
  localStorage.setItem('torvex_theme', App.theme);
  updateThemeUI();
}

function updateThemeUI() {
  const icon = document.getElementById('themeIcon');
  const toggle = document.getElementById('darkModeToggle');
  if (icon) icon.className = App.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  if (toggle) toggle.checked = App.theme === 'dark';
}

function initThemeToggle() {
  updateThemeUI();
}

// ════════════════════════════════════════════════════════════
// COUNTER ANIMATION
// ════════════════════════════════════════════════════════════

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        animateNumber(el, 0, target, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateNumber(el, start, end, duration) {
  const startTime = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(start + (end - start) * easeOut(progress));
    el.textContent = value.toLocaleString('uz-UZ');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ════════════════════════════════════════════════════════════
// FEED
// ════════════════════════════════════════════════════════════

function renderFeed() {
  const container = document.getElementById('postsFeed');
  if (!container) return;

  // Remove skeleton
  const skeleton = container.querySelector('.feed-skeleton');
  if (skeleton) skeleton.remove();

  const posts = App.feedPosts.slice(0, 3);
  container.innerHTML = '';
  posts.forEach(post => {
    container.insertAdjacentHTML('beforeend', buildPostCard(post));
  });

  // Feed count
  const countEl = document.getElementById('feedCount');
  if (countEl) countEl.textContent = App.feedPosts.length;
}

function renderFullFeed() {
  const container = document.getElementById('fullFeedContainer');
  if (!container) return;

  const filtered = App.feedFilter === 'all'
    ? App.feedPosts
    : App.feedPosts.filter(p => p.type === App.feedFilter);

  container.innerHTML = filtered.length > 0
    ? filtered.map(p => buildPostCard(p)).join('')
    : `<div class="empty-state"><i class="fas fa-inbox"></i><p>E'lonlar topilmadi</p></div>`;
}

function buildPostCard(post) {
  const typeLabels = { sale: 'Sotiladi', buy: 'Xarid', service: 'Xizmat', job: 'Ish', news: 'Xabar' };
  const typeColors = { sale: 'green', buy: 'blue', service: 'amber', job: 'purple', news: 'red' };
  const avatarLetter = post.user.name.charAt(0).toUpperCase();
  const isSaved = App.favorites.posts.includes(post.id);

  return `
  <article class="post-card" data-id="${post.id}" aria-label="${post.user.name} ning e'loni">
    <div class="pc-header">
      <div class="pc-avatar" style="background:${getColorByName(post.user.name)}">${avatarLetter}</div>
      <div class="pc-user-info">
        <strong class="pc-name">${escHtml(post.user.name)}</strong>
        <span class="pc-meta">${escHtml(post.user.role)} ${post.time ? '· ' + post.time : ''}</span>
      </div>
      <span class="pc-type-badge ${typeColors[post.type] || 'blue'}">${typeLabels[post.type] || post.type}</span>
      <button class="btn-icon pc-more" onclick="openPostMenu(${post.id})" aria-label="Ko'proq">
        <i class="fas fa-ellipsis-h"></i>
      </button>
    </div>
    <div class="pc-body">
      <p class="pc-text">${escHtml(post.text)}</p>
      ${post.price ? `<div class="pc-price"><i class="fas fa-tag"></i> ${post.price.toLocaleString('uz-UZ')} so'm</div>` : ''}
      ${post.location ? `<div class="pc-location"><i class="fas fa-map-marker-alt"></i> ${escHtml(post.location)}</div>` : ''}
    </div>
    <div class="pc-actions">
      <button class="pca-btn ${post.likes > 0 ? 'liked' : ''}" onclick="likePost(${post.id}, this)" aria-label="Yoqtirish">
        <i class="fas fa-heart"></i> <span>${post.likes}</span>
      </button>
      <button class="pca-btn" onclick="toggleComments(${post.id})" aria-label="Sharhlar">
        <i class="fas fa-comment"></i> <span>${post.comments}</span>
      </button>
      <button class="pca-btn" onclick="sharePost(${post.id})" aria-label="Ulashish">
        <i class="fas fa-share"></i> <span>${post.shares}</span>
      </button>
      <button class="pca-btn save-btn ${isSaved ? 'saved' : ''}" onclick="savePost(${post.id}, this)" aria-label="Saqlash">
        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
      </button>
    </div>
  </article>`;
}

function likePost(id, btn) {
  const post = App.feedPosts.find(p => p.id === id);
  if (!post) return;

  if (btn.classList.contains('liked')) {
    post.likes--;
    btn.classList.remove('liked');
  } else {
    post.likes++;
    btn.classList.add('liked');
  }
  const countEl = btn.querySelector('span');
  if (countEl) countEl.textContent = post.likes;
}

function savePost(id, btn) {
  const idx = App.favorites.posts.indexOf(id);
  const icon = btn.querySelector('i');
  if (idx > -1) {
    App.favorites.posts.splice(idx, 1);
    btn.classList.remove('saved');
    if (icon) { icon.className = 'far fa-bookmark'; }
    showToast('E\'londan olib tashlandi', 'info');
  } else {
    App.favorites.posts.push(id);
    btn.classList.add('saved');
    if (icon) { icon.className = 'fas fa-bookmark'; }
    showToast('Saqlanganlar ro\'yxatiga qo\'shildi', 'success');
  }
  saveFavorites();
}

function sharePost(id) {
  if (navigator.share) {
    navigator.share({ title: 'TORVEX E\'lon', url: window.location.href + '#' + id });
  } else {
    navigator.clipboard.writeText(window.location.href + '#post-' + id).then(() => {
      showToast('Havola nusxalandi!', 'success');
    });
  }
}

function toggleComments(id) {
  showToast('Sharhlar tez orada...', 'info');
}

function openPostMenu(id) {
  showToast('Menyu ochilyapti...', 'info');
}

function filterFeed(type, btn) {
  App.feedFilter = type;
  document.querySelectorAll('.feed-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderFullFeed();
}

function loadMorePosts() {
  const spinner = document.getElementById('loadMoreSpinner');
  if (spinner) spinner.style.display = 'inline-block';

  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    showToast('Barcha e\'lonlar yuklandi', 'info');
  }, 1200);
}

// ════════════════════════════════════════════════════════════
// MASTERS
// ════════════════════════════════════════════════════════════

function renderTopMasters() {
  const list = document.getElementById('topMastersList');
  if (!list) return;

  const top = [...App.mastersData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  list.innerHTML = top.map((m, i) => `
    <li class="tm-item" onclick="openMasterModal(${m.id})" role="button" tabindex="0" aria-label="${m.name} profili">
      <span class="tm-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze'}">${i + 1}</span>
      <div class="tm-avatar" style="background:${getColorByName(m.name)}">${m.name.charAt(0)}</div>
      <div class="tm-info">
        <strong>${escHtml(m.name)}</strong>
        <span>${escHtml(m.job)}</span>
      </div>
      <div class="tm-rating"><i class="fas fa-star"></i> ${m.rating}</div>
    </li>
  `).join('');
}

function renderMasters() {
  const grid = document.getElementById('mastersGrid');
  const totalEl = document.getElementById('totalMasters');
  if (!grid) return;

  let data = [...App.mastersData];

  // Filter by job
  if (App.mastersFilter !== 'all') {
    data = data.filter(m => m.job === App.mastersFilter);
  }

  // Search
  const q = document.getElementById('masterSearch')?.value?.toLowerCase();
  if (q) {
    data = data.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.job.toLowerCase().includes(q) ||
      m.region.toLowerCase().includes(q)
    );
  }

  // Sort
  switch (App.mastersSortBy) {
    case 'rating':    data.sort((a, b) => b.rating - a.rating); break;
    case 'exp':       data.sort((a, b) => b.exp - a.exp); break;
    case 'price_asc': data.sort((a, b) => a.price - b.price); break;
    case 'price_desc':data.sort((a, b) => b.price - a.price); break;
    case 'reviews':   data.sort((a, b) => b.reviews - a.reviews); break;
  }

  if (totalEl) totalEl.textContent = data.length;

  grid.innerHTML = data.length > 0
    ? data.map(m => buildMasterCard(m)).join('')
    : `<div class="empty-state"><i class="fas fa-user-slash"></i><p>Usta topilmadi</p></div>`;
}

function buildMasterCard(m) {
  const stars = renderStars(m.rating);
  const isFav = App.favorites.masters.includes(m.id);
  const letter = m.name.charAt(0).toUpperCase();

  return `
  <div class="master-card ${m.premium ? 'premium' : ''}" data-id="${m.id}" role="listitem">
    <div class="mc-header">
      <div class="mc-avatar-wrap">
        <div class="mc-avatar" style="background:${getColorByName(m.name)}">${letter}</div>
        ${m.online ? '<span class="mc-online-dot" aria-label="Onlayn"></span>' : ''}
      </div>
      <button class="mc-fav-btn ${isFav ? 'active' : ''}" onclick="toggleMasterFav(${m.id}, this)" aria-label="Saqlash">
        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
      </button>
      ${m.premium ? '<span class="mc-premium-badge"><i class="fas fa-crown"></i> Pro</span>' : ''}
      ${m.verified ? '<span class="mc-verified" title="Tasdiqlangan"><i class="fas fa-check-circle"></i></span>' : ''}
    </div>
    <div class="mc-body">
      <h3 class="mc-name">${escHtml(m.name)}</h3>
      <span class="mc-job">${escHtml(m.job)}</span>
      <div class="mc-stars" aria-label="Reyting ${m.rating}">${stars} <span>${m.rating}</span> <em>(${m.reviews})</em></div>
      <div class="mc-stats">
        <span><i class="fas fa-briefcase"></i> ${m.exp} yil</span>
        <span><i class="fas fa-map-marker-alt"></i> ${escHtml(m.region)}</span>
        <span><i class="fas fa-check-double"></i> ${m.completed} bajarildi</span>
      </div>
      <p class="mc-bio">${escHtml(m.bio)}</p>
      <div class="mc-price"><strong>${m.price.toLocaleString('uz-UZ')} so'm</strong><span>/kun</span></div>
    </div>
    <div class="mc-footer">
      <button class="btn-primary mc-hire-btn" onclick="hireMaster(${m.id})"><i class="fas fa-handshake"></i> Yollash</button>
      <button class="btn-ghost-sm" onclick="openMasterModal(${m.id})">Profil</button>
      <a href="tel:${m.phone}" class="btn-icon mc-call-btn" aria-label="Qo'ng'iroq"><i class="fas fa-phone"></i></a>
    </div>
  </div>`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) stars += '<i class="fas fa-star"></i>';
    else if (i === full && half) stars += '<i class="fas fa-star-half-alt"></i>';
    else stars += '<i class="far fa-star"></i>';
  }
  return stars;
}

function searchMasters() {
  renderMasters();
}

function sortMasters(value) {
  App.mastersSortBy = value;
  renderMasters();
}

function filterByJob(job, btn) {
  App.mastersFilter = job;
  document.querySelectorAll('.filter-chips-row .chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMasters();
}

function toggleMasterFav(id, btn) {
  const idx = App.favorites.masters.indexOf(id);
  const icon = btn.querySelector('i');
  if (idx > -1) {
    App.favorites.masters.splice(idx, 1);
    btn.classList.remove('active');
    if (icon) icon.className = 'far fa-heart';
    showToast('Sevimlillardan olib tashlandi', 'info');
  } else {
    App.favorites.masters.push(id);
    btn.classList.add('active');
    if (icon) icon.className = 'fas fa-heart';
    showToast('Sevimlilar ro\'yxatiga qo\'shildi', 'success');
  }
  saveFavorites();
}

function hireMaster(id) {
  const master = App.mastersData.find(m => m.id === id);
  if (!master) return;
  showToast(`${master.name} bilan bog'lanish boshlandi`, 'success');
  showSection('muhokama');
}

function openMasterModal(id) {
  const master = App.mastersData.find(m => m.id === id);
  if (!master) return;

  const stars = renderStars(master.rating);
  const content = document.getElementById('masterModalContent');
  if (content) {
    content.innerHTML = `
      <div class="master-modal-inner">
        <div class="mm-hero" style="background: linear-gradient(135deg, ${getColorByName(master.name)}44, var(--bg-secondary));">
          <div class="mm-avatar-big" style="background:${getColorByName(master.name)}">${master.name.charAt(0)}</div>
          ${master.premium ? '<span class="mm-premium"><i class="fas fa-crown"></i> Premium</span>' : ''}
          ${master.verified ? '<span class="mm-verified"><i class="fas fa-check-circle"></i> Tasdiqlangan</span>' : ''}
          ${master.online ? '<span class="mm-online"><i class="fas fa-circle"></i> Onlayn</span>' : '<span class="mm-offline"><i class="fas fa-circle"></i> Offline</span>'}
        </div>
        <div class="mm-info">
          <h2>${escHtml(master.name)}</h2>
          <span class="mm-job-badge">${escHtml(master.job)}</span>
          <div class="mm-stars">${stars} ${master.rating} (${master.reviews} sharh)</div>
          <p class="mm-bio">${escHtml(master.bio)}</p>
          <div class="mm-stats-grid">
            <div class="mm-stat"><strong>${master.exp}</strong><span>Yil tajriba</span></div>
            <div class="mm-stat"><strong>${master.completed}</strong><span>Bajarildi</span></div>
            <div class="mm-stat"><strong>${master.reviews}</strong><span>Sharhlar</span></div>
            <div class="mm-stat"><strong>${master.price.toLocaleString('uz-UZ')}</strong><span>So'm/kun</span></div>
          </div>
          <div class="mm-location"><i class="fas fa-map-marker-alt"></i> ${escHtml(master.region)}</div>
        </div>
        <div class="mm-actions">
          <button class="btn-primary full-width" onclick="hireMaster(${master.id}); closeModal('masterModal')">
            <i class="fas fa-handshake"></i> Ishga yollash
          </button>
          <a href="tel:${master.phone}" class="btn-ghost full-width">
            <i class="fas fa-phone"></i> ${master.phone}
          </a>
          <button class="btn-ghost-sm" onclick="toggleMasterFav(${master.id}, this)">
            <i class="far fa-heart"></i> Sevimlilarga qo'shish
          </button>
        </div>
      </div>`;
  }
  openModal('masterModal');
}

function toggleMapView() {
  const mapView = document.getElementById('mastersMapView');
  const grid = document.getElementById('mastersGrid');
  const btn = document.getElementById('mapViewBtn');
  if (!mapView || !grid) return;

  if (mapView.style.display === 'none') {
    mapView.style.display = 'block';
    grid.style.display = 'none';
    if (btn) btn.innerHTML = '<i class="fas fa-th"></i> Grid';
    showToast('Xarita ko\'rinishi (demo)', 'info');
  } else {
    mapView.style.display = 'none';
    grid.style.display = '';
    if (btn) btn.innerHTML = '<i class="fas fa-map"></i> Xaritada';
  }
}

// ════════════════════════════════════════════════════════════
// MARKET
// ════════════════════════════════════════════════════════════

function renderMarket() {
  const grid = document.getElementById('marketGrid');
  if (!grid) return;

  let data = [...App.marketData];

  if (App.marketFilter !== 'all') {
    data = data.filter(p => p.category === App.marketFilter);
  }

  const q = document.getElementById('marketSearch')?.value?.toLowerCase();
  if (q) {
    data = data.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  switch (App.marketSortBy) {
    case 'popular':    data.sort((a, b) => b.reviews - a.reviews); break;
    case 'price_asc':  data.sort((a, b) => a.price - b.price); break;
    case 'price_desc': data.sort((a, b) => b.price - a.price); break;
    case 'new':        data.sort((a, b) => b.id - a.id); break;
  }

  grid.className = `market-grid ${App.marketView === 'list' ? 'list-view' : ''}`;
  grid.innerHTML = data.length > 0
    ? data.map(p => buildProductCard(p)).join('')
    : `<div class="empty-state"><i class="fas fa-box-open"></i><p>Mahsulot topilmadi</p></div>`;
}

function buildProductCard(p) {
  const isFav = App.favorites.products.includes(p.id);
  const inCart = App.cart.find(c => c.id === p.id);
  const discountedPrice = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  const categoryIcons = {
    sement: 'fas fa-cubes', arma: 'fas fa-grip-lines', gips: 'fas fa-layer-group',
    elektr: 'fas fa-plug', santex: 'fas fa-faucet', asbob: 'fas fa-tools',
    "bo'yoq": 'fas fa-fill-drip'
  };
  const catIcon = categoryIcons[p.category] || 'fas fa-box';
  const categoryColors = {
    sement: '#e67e22', arma: '#95a5a6', gips: '#f39c12', elektr: '#3498db',
    santex: '#2980b9', asbob: '#e74c3c', "bo'yoq": '#9b59b6'
  };
  const catColor = categoryColors[p.category] || 'var(--accent)';

  return `
  <div class="product-card" data-id="${p.id}" role="listitem" onclick="openProductModal(${p.id})">
    <div class="prc-image" style="background: linear-gradient(135deg, ${catColor}22, ${catColor}44);">
      <i class="${catIcon}" style="color:${catColor}; font-size:2.5rem;"></i>
      ${p.badge ? `<span class="prc-badge">${escHtml(p.badge)}</span>` : ''}
      ${p.discount > 0 ? `<span class="prc-discount">-${p.discount}%</span>` : ''}
      <button class="prc-fav ${isFav ? 'active' : ''}" onclick="toggleProductFav(event,${p.id},this)" aria-label="Saqlash">
        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
      </button>
    </div>
    <div class="prc-body">
      <div class="prc-brand">${escHtml(p.brand)}</div>
      <h3 class="prc-name">${escHtml(p.name)}</h3>
      <div class="prc-rating">${renderStars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
      <div class="prc-price-row">
        <div>
          <strong class="prc-price">${discountedPrice.toLocaleString('uz-UZ')} so'm</strong>
          <span class="prc-unit">/${p.unit}</span>
          ${p.discount > 0 ? `<del class="prc-old-price">${p.price.toLocaleString('uz-UZ')}</del>` : ''}
        </div>
        <span class="prc-stock ${p.stock < 20 ? 'low' : ''}">${p.stock < 20 ? 'Kam qoldi' : 'Mavjud'}</span>
      </div>
    </div>
    <div class="prc-footer" onclick="event.stopPropagation()">
      <button class="btn-primary prc-add-btn ${inCart ? 'in-cart' : ''}"
        onclick="addToCart(${p.id})"
        aria-label="Savatga qo'shish">
        <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
        ${inCart ? 'Savatda' : 'Savatga'}
      </button>
    </div>
  </div>`;
}

function openProductModal(id) {
  const p = App.marketData.find(x => x.id === id);
  if (!p) return;

  const discountedPrice = p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
  const inCart = App.cart.find(c => c.id === p.id);
  const categoryIcons = {
    sement: 'fas fa-cubes', arma: 'fas fa-grip-lines', gips: 'fas fa-layer-group',
    elektr: 'fas fa-plug', santex: 'fas fa-faucet', asbob: 'fas fa-tools',
    "bo'yoq": 'fas fa-fill-drip'
  };
  const catIcon = categoryIcons[p.category] || 'fas fa-box';
  const catColor = { sement:'#e67e22', arma:'#95a5a6', gips:'#f39c12', elektr:'#3498db', santex:'#2980b9', asbob:'#e74c3c' }[p.category] || 'var(--accent)';

  const content = document.getElementById('productModalContent');
  if (content) {
    content.innerHTML = `
      <div class="product-modal-inner">
        <div class="pm-image-area" style="background: linear-gradient(135deg, ${catColor}22, ${catColor}44);">
          <i class="${catIcon}" style="color:${catColor}; font-size:5rem;"></i>
          ${p.badge ? `<span class="pm-badge">${escHtml(p.badge)}</span>` : ''}
          ${p.discount > 0 ? `<span class="pm-discount">-${p.discount}%</span>` : ''}
        </div>
        <div class="pm-info">
          <div class="pm-brand">${escHtml(p.brand)}</div>
          <h2 id="productModalTitle">${escHtml(p.name)}</h2>
          <div class="pm-rating">${renderStars(p.rating)} ${p.rating} · ${p.reviews} sharh</div>
          <p class="pm-desc">${escHtml(p.description)}</p>
          <div class="pm-price-block">
            <strong class="pm-price">${discountedPrice.toLocaleString('uz-UZ')} so'm</strong>
            <span class="pm-unit">/${p.unit}</span>
            ${p.discount > 0 ? `<del>${p.price.toLocaleString('uz-UZ')}</del> <span class="pm-save">Tejash: ${(p.price - discountedPrice).toLocaleString('uz-UZ')} so'm</span>` : ''}
          </div>
          <div class="pm-stock-info">
            <i class="fas fa-warehouse"></i>
            Qoldi: <strong>${p.stock} ${p.unit}</strong>
          </div>
          <div class="pm-qty-row">
            <label>Miqdor:</label>
            <div class="qty-control">
              <button onclick="changeQty(-1,'pm-qty')" aria-label="Kamaytirish">−</button>
              <input type="number" id="pm-qty" value="1" min="1" max="${p.stock}" aria-label="Miqdor">
              <button onclick="changeQty(1,'pm-qty')" aria-label="Ko'paytirish">+</button>
            </div>
          </div>
          <div class="pm-actions">
            <button class="btn-primary full-width ${inCart ? 'in-cart' : ''}" onclick="addToCart(${p.id}); closeModal('productModal')">
              <i class="fas ${inCart ? 'fa-check' : 'fa-cart-plus'}"></i>
              ${inCart ? 'Savatda' : 'Savatga qo\'shish'}
            </button>
            <button class="btn-ghost full-width" onclick="toggleProductFav(event,${p.id}, this)">
              <i class="far fa-heart"></i> Saqlash
            </button>
          </div>
        </div>
      </div>`;
  }
  openModal('productModal');
}

function changeQty(delta, inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const val = parseInt(input.value) + delta;
  input.value = Math.max(1, Math.min(val, parseInt(input.max) || 999));
}

function filterMarket(cat, btn) {
  App.marketFilter = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMarket();
}

function sortMarket(value) {
  App.marketSortBy = value;
  renderMarket();
}

function searchMarket() {
  renderMarket();
}

function setMarketView(view, btn) {
  App.marketView = view;
  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderMarket();
}

function toggleProductFav(e, id, btn) {
  if (e) e.stopPropagation();
  const idx = App.favorites.products.indexOf(id);
  const icon = btn?.querySelector('i');
  if (idx > -1) {
    App.favorites.products.splice(idx, 1);
    if (btn) btn.classList.remove('active');
    if (icon) icon.className = 'far fa-heart';
    showToast('Sevimlillardan olib tashlandi', 'info');
  } else {
    App.favorites.products.push(id);
    if (btn) btn.classList.add('active');
    if (icon) icon.className = 'fas fa-heart';
    showToast('Sevimlilar ro\'yxatiga qo\'shildi', 'success');
  }
  saveFavorites();
}

// ════════════════════════════════════════════════════════════
// CART
// ════════════════════════════════════════════════════════════

function addToCart(productId) {
  const product = App.marketData.find(p => p.id === productId);
  if (!product) return;

  const existing = App.cart.find(c => c.id === productId);
  if (existing) {
    existing.qty++;
    showToast(`${product.name} miqdori oshirildi`, 'info');
  } else {
    App.cart.push({ id: productId, qty: 1, name: product.name, price: product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price, unit: product.unit });
    showToast(`${product.name} savatga qo'shildi!`, 'success');
  }

  saveCart();
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(productId) {
  App.cart = App.cart.filter(c => c.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartItems();
  showToast('Savatdan olib tashlandi', 'info');
}

function updateCartQty(productId, qty) {
  const item = App.cart.find(c => c.id === productId);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart();
    updateCartBadge();
    renderCartItems();
  }
}

function updateCartBadge() {
  const total = App.cart.reduce((sum, c) => sum + c.qty, 0);
  const badge = document.getElementById('cartBadge');
  const label = document.getElementById('cartCountLabel');
  if (badge) badge.textContent = total;
  if (label) label.textContent = total;
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const empty = document.getElementById('cartEmpty');
  const totalEl = document.getElementById('cartTotal');
  if (!container) return;

  if (App.cart.length === 0) {
    if (empty) empty.style.display = 'flex';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (empty) empty.style.display = 'none';
  if (footer) footer.style.display = 'block';

  const itemsHTML = App.cart.map(item => `
    <div class="cart-item">
      <div class="ci-info">
        <strong>${escHtml(item.name)}</strong>
        <span>${item.price.toLocaleString('uz-UZ')} so'm/${item.unit}</span>
      </div>
      <div class="ci-qty">
        <button onclick="updateCartQty(${item.id}, ${item.qty - 1})">−</button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty(${item.id}, ${item.qty + 1})">+</button>
      </div>
      <strong class="ci-subtotal">${(item.price * item.qty).toLocaleString('uz-UZ')}</strong>
      <button class="ci-remove" onclick="removeFromCart(${item.id})" aria-label="O'chirish">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');

  container.innerHTML = itemsHTML + (empty ? empty.outerHTML : '');

  const total = App.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  if (totalEl) totalEl.textContent = total.toLocaleString('uz-UZ') + ' so\'m';
}

function toggleCart() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  const isOpen = drawer?.classList.contains('open');

  if (isOpen) {
    drawer?.classList.remove('open');
    overlay?.classList.remove('visible');
  } else {
    renderCartItems();
    drawer?.classList.add('open');
    overlay?.classList.add('visible');
  }
}

function checkout() {
  if (App.cart.length === 0) {
    showToast('Savat bo\'sh', 'warning');
    return;
  }
  showToast('To\'lov tizimi tez orada ishga tushadi!', 'info');
}

function saveCart() {
  localStorage.setItem('torvex_cart', JSON.stringify(App.cart));
}

// ════════════════════════════════════════════════════════════
// PRICE TICKER
// ════════════════════════════════════════════════════════════

function renderPriceTicker() {
  const list = document.getElementById('priceTicker');
  if (!list) return;

  list.innerHTML = PRICE_TICKER_DATA.map(item => `
    <li class="pt-item">
      <span class="pt-name">${escHtml(item.name)}</span>
      <div class="pt-right">
        <span class="pt-price">${item.price}</span>
        <span class="pt-change ${item.change > 0 ? 'up' : item.change < 0 ? 'down' : 'flat'}">
          ${item.change > 0 ? '<i class="fas fa-arrow-up"></i>' : item.change < 0 ? '<i class="fas fa-arrow-down"></i>' : '<i class="fas fa-minus"></i>'}
          ${Math.abs(item.change)}%
        </span>
      </div>
    </li>
  `).join('');
}

function startPriceTickerAnimation() {
  setInterval(() => {
    PRICE_TICKER_DATA.forEach(item => {
      const delta = (Math.random() - 0.5) * 2;
      item.change = parseFloat((item.change + delta * 0.1).toFixed(1));
    });
    if (App.currentSection === 'dash') renderPriceTicker();
  }, 8000);
}

// ════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════

function renderNotifications() {
  const list = document.getElementById('notifList');
  const badge = document.getElementById('notifBadge');
  if (!list) return;

  list.innerHTML = App.notifications.map(n => `
    <li class="notif-item ${n.read ? '' : 'unread'}" onclick="readNotif(${n.id})">
      <span class="notif-icon ${n.color}"><i class="${n.icon}"></i></span>
      <div class="notif-content">
        <p>${escHtml(n.text)}</p>
        <span class="notif-time">${n.time}</span>
      </div>
      ${!n.read ? '<span class="notif-dot"></span>' : ''}
    </li>
  `).join('');

  const unread = App.notifications.filter(n => !n.read).length;
  if (badge) {
    badge.textContent = unread;
    badge.style.display = unread > 0 ? 'flex' : 'none';
  }
}

function readNotif(id) {
  const notif = App.notifications.find(n => n.id === id);
  if (notif) notif.read = true;
  renderNotifications();
  updateUnreadBadge();
}

function markAllRead() {
  App.notifications.forEach(n => n.read = true);
  renderNotifications();
  updateUnreadBadge();
  showToast('Barcha bildirishnomalar o\'qildi', 'success');
}

function updateUnreadBadge() {
  const count = App.notifications.filter(n => !n.read).length;
  App.unreadCount = count;
  const badge = document.getElementById('notifBadge');
  const unreadCount = document.getElementById('unreadCount');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
  if (unreadCount) unreadCount.textContent = count;
}

function toggleNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (!panel) return;
  App.notifPanelOpen = !App.notifPanelOpen;
  panel.classList.toggle('open', App.notifPanelOpen);
  panel.setAttribute('aria-hidden', String(!App.notifPanelOpen));
}

function closeNotifPanel() {
  const panel = document.getElementById('notifPanel');
  if (panel) panel.classList.remove('open');
  App.notifPanelOpen = false;
}

// ════════════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════════════

function renderProjectsMini() {
  const list = document.getElementById('projectMiniList');
  if (!list) return;

  const active = App.projectsData.filter(p => p.status === 'active');
  if (active.length === 0) return;

  list.innerHTML = active.map(p => `
    <div class="pm-project-item">
      <div class="pmpi-header">
        <strong>${escHtml(p.title)}</strong>
        <span class="pmpi-category">${escHtml(p.category)}</span>
      </div>
      <div class="pmpi-progress-bar">
        <div class="pmpi-fill" style="width:${p.progress}%"></div>
      </div>
      <span class="pmpi-pct">${p.progress}%</span>
    </div>
  `).join('');
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const activeBtn = document.querySelector('.tab-bar .tab-btn.active');
  const statusFilter = activeBtn?.textContent.trim().toLowerCase().includes('faol') ? 'active'
    : activeBtn?.textContent.trim().toLowerCase().includes('kutilmoqda') ? 'pending' : 'done';

  const data = App.projectsData.filter(p => p.status === statusFilter);

  // Update counts
  const counts = { active: 0, pending: 0, done: 0 };
  App.projectsData.forEach(p => counts[p.status]++);
  const activeCountEl = document.getElementById('activeProjectCount');
  const pendingCountEl = document.getElementById('pendingProjectCount');
  const doneCountEl = document.getElementById('doneProjectCount');
  if (activeCountEl) activeCountEl.textContent = counts.active;
  if (pendingCountEl) pendingCountEl.textContent = counts.pending;
  if (doneCountEl) doneCountEl.textContent = counts.done;

  grid.innerHTML = data.length > 0
    ? data.map(p => buildProjectCard(p)).join('')
    : `<div class="empty-state"><i class="fas fa-folder-open"></i><p>Loyihalar topilmadi</p><button class="btn-primary" onclick="openModal('adModal')">Loyiha qo'shish</button></div>`;
}

function buildProjectCard(p) {
  const statusLabels = { active: 'Faol', pending: 'Kutilmoqda', done: 'Yakunlandi' };
  const statusColors = { active: 'green', pending: 'amber', done: 'blue' };
  const spentPct = p.budget > 0 ? Math.round(p.spent / p.budget * 100) : 0;

  return `
  <div class="project-card" role="listitem">
    <div class="prj-header">
      <div>
        <h3>${escHtml(p.title)}</h3>
        <span class="prj-category">${escHtml(p.category)}</span>
      </div>
      <span class="prj-status ${statusColors[p.status]}">${statusLabels[p.status]}</span>
    </div>
    <div class="prj-master"><i class="fas fa-user-hard-hat"></i> ${escHtml(p.master)}</div>
    <div class="prj-progress">
      <div class="prj-progress-bar">
        <div class="prj-progress-fill" style="width:${p.progress}%"></div>
      </div>
      <span>${p.progress}% bajarildi</span>
    </div>
    <div class="prj-budget">
      <span><i class="fas fa-wallet"></i> Byudjet: <strong>${p.budget.toLocaleString('uz-UZ')} so'm</strong></span>
      <span class="prj-spent">Sarflandi: ${p.spent.toLocaleString('uz-UZ')} (${spentPct}%)</span>
    </div>
    <div class="prj-deadline"><i class="fas fa-calendar-alt"></i> Muddat: ${p.deadline}</div>
    <div class="prj-footer">
      <button class="btn-ghost-sm" onclick="showToast('Loyiha tafsilotlari','info')">Tafsilot</button>
      ${p.status === 'active' ? `<button class="btn-primary" onclick="showToast('Xabar yuborildi','success')"><i class="fas fa-comment"></i> Xabar</button>` : ''}
    </div>
  </div>`;
}

function filterProjects(status, btn) {
  document.querySelectorAll('#loyihalar .tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }
  renderProjects();
}

// ════════════════════════════════════════════════════════════
// NEWS
// ════════════════════════════════════════════════════════════

function renderNews() {
  const grid = document.getElementById('newsGrid');
  const trends = document.getElementById('newsTrends');
  if (!grid) return;

  grid.innerHTML = MOCK_NEWS.map(n => `
    <article class="news-card ${n.read ? '' : 'unread'}" role="listitem" onclick="readNewsItem(${n.id}, this)">
      <div class="nc-image">
        <i class="fas fa-newspaper"></i>
        ${!n.read ? '<span class="nc-new-dot"></span>' : ''}
      </div>
      <div class="nc-body">
        <span class="nc-category">${escHtml(n.category)}</span>
        <h3>${escHtml(n.title)}</h3>
        <p>${escHtml(n.text)}</p>
        <div class="nc-meta">
          <span><i class="fas fa-clock"></i> ${n.time}</span>
          <span><i class="fas fa-eye"></i> ${n.views.toLocaleString()}</span>
        </div>
      </div>
    </article>
  `).join('');

  if (trends) {
    const trendItems = ['#Sement', '#Elektrik', '#Santexnik', '#Kafelchi', '#Ta\'mir', '#Toshkent'];
    trends.innerHTML = trendItems.map(t => `
      <li class="trend-item" onclick="showToast('${t} qidirish','info')">${t}</li>
    `).join('');
  }
}

function readNewsItem(id, card) {
  const item = MOCK_NEWS.find(n => n.id === id);
  if (item) item.read = true;
  if (card) card.classList.remove('unread');
  const dot = card?.querySelector('.nc-new-dot');
  if (dot) dot.remove();
  MOCK_NEWS[id - 1].views++;
}

// ════════════════════════════════════════════════════════════
// FAVORITES
// ════════════════════════════════════════════════════════════

function renderFavorites() {
  const activeTab = document.querySelector('#sevimlilari .tab-btn.active');
  const type = activeTab?.textContent.toLowerCase().includes('usta') ? 'masters'
    : activeTab?.textContent.toLowerCase().includes('mahsulot') ? 'products' : 'posts';
  filterFavs(type, activeTab);
}

function filterFavs(type, btn) {
  document.querySelectorAll('#sevimlilari .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const grid = document.getElementById('favsGrid');
  if (!grid) return;

  if (type === 'masters') {
    const favMasters = App.mastersData.filter(m => App.favorites.masters.includes(m.id));
    grid.innerHTML = favMasters.length > 0
      ? favMasters.map(m => buildMasterCard(m)).join('')
      : `<div class="empty-state"><i class="fas fa-user-slash"></i><p>Saqlangan usta yo'q</p></div>`;
  } else if (type === 'products') {
    const favProducts = App.marketData.filter(p => App.favorites.products.includes(p.id));
    grid.innerHTML = favProducts.length > 0
      ? favProducts.map(p => buildProductCard(p)).join('')
      : `<div class="empty-state"><i class="fas fa-box-open"></i><p>Saqlangan mahsulot yo'q</p></div>`;
  } else {
    const favPosts = App.feedPosts.filter(p => App.favorites.posts.includes(p.id));
    grid.innerHTML = favPosts.length > 0
      ? favPosts.map(p => buildPostCard(p)).join('')
      : `<div class="empty-state"><i class="fas fa-bookmark"></i><p>Saqlangan e'lon yo'q</p></div>`;
  }
}

function saveFavorites() {
  localStorage.setItem('torvex_favs', JSON.stringify(App.favorites));
}

// ════════════════════════════════════════════════════════════
// MESSENGER
// ════════════════════════════════════════════════════════════

function renderChats() {
  const list = document.getElementById('chatList');
  if (!list) return;

  list.innerHTML = App.chatsData.map(chat => `
    <li class="chat-item ${chat.unread > 0 ? 'has-unread' : ''} ${App.activeChat === chat.id ? 'active' : ''}"
      onclick="openChat(${chat.id})" role="button" tabindex="0" aria-label="${chat.name} suhbati">
      <div class="ci-avatar-wrap">
        <div class="ci-avatar" style="background:${getColorByName(chat.name)}">${chat.name.charAt(0)}</div>
        ${chat.online ? '<span class="ci-online"></span>' : ''}
      </div>
      <div class="ci-details">
        <div class="ci-header">
          <strong>${escHtml(chat.name)}</strong>
          <span class="ci-time">${chat.lastTime}</span>
        </div>
        <div class="ci-preview">
          <span>${escHtml(chat.lastMessage)}</span>
          ${chat.unread > 0 ? `<span class="ci-unread-badge">${chat.unread}</span>` : ''}
        </div>
      </div>
    </li>
  `).join('');
}

function openChat(chatId) {
  const chat = App.chatsData.find(c => c.id === chatId);
  if (!chat) return;

  App.activeChat = chatId;
  chat.unread = 0;

  const empty = document.getElementById('msEmpty');
  const conv = document.getElementById('msConversation');
  const peerName = document.getElementById('msPeerName');
  const peerStatus = document.getElementById('msPeerStatus');
  const peerAvatar = document.getElementById('msPeerAvatar');
  const msgContainer = document.getElementById('msMessages');

  if (empty) empty.style.display = 'none';
  if (conv) conv.style.display = 'flex';
  if (peerName) peerName.textContent = chat.name;
  if (peerStatus) peerStatus.textContent = chat.online ? 'Onlayn' : 'Offline';
  if (peerAvatar) { peerAvatar.style.display = 'none'; }

  // Initialize messages if not exists
  if (!App.messages[chatId]) {
    App.messages[chatId] = [
      { id: 1, from: 'peer', text: 'Salom! Qanday yordam bera olaman?', time: '14:00', type: 'text' },
      { id: 2, from: 'me', text: 'Salom! Narx bo\'yicha gaplashsak bo\'ladimi?', time: '14:02', type: 'text' },
      { id: 3, from: 'peer', text: chat.lastMessage, time: chat.lastTime, type: 'text' },
    ];
  }

  renderMessages(chatId);
  renderChats();

  // Mobile: hide sidebar
  const sidebar = document.getElementById('messengerSidebar');
  if (window.innerWidth < 768 && sidebar) {
    sidebar.style.display = 'none';
  }
}

function renderMessages(chatId) {
  const container = document.getElementById('msMessages');
  if (!container) return;

  const msgs = App.messages[chatId] || [];
  container.innerHTML = msgs.map(msg => `
    <div class="msg-bubble ${msg.from === 'me' ? 'mine' : 'theirs'}" aria-label="${msg.from === 'me' ? 'Mening xabarim' : 'Kelgan xabar'}">
      <p>${escHtml(msg.text)}</p>
      <span class="msg-time">${msg.time}</span>
      ${msg.from === 'me' ? '<i class="fas fa-check-double msg-status"></i>' : ''}
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  if (!App.activeChat) {
    showToast('Suhbat tanlanmagan', 'warning');
    return;
  }
  const input = document.getElementById('msInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

  if (!App.messages[App.activeChat]) App.messages[App.activeChat] = [];
  App.messages[App.activeChat].push({
    id: Date.now(), from: 'me', text, time, type: 'text'
  });

  input.value = '';
  input.style.height = 'auto';
  renderMessages(App.activeChat);

  // Simulate response
  setTimeout(() => {
    if (!App.activeChat) return;
    App.messages[App.activeChat].push({
      id: Date.now() + 1, from: 'peer', text: 'Xabar qabul qilindi. Tez orada javob beraman!', time: `${now.getHours().toString().padStart(2,'0')}:${(now.getMinutes()+1).toString().padStart(2,'0')}`, type: 'text'
    });
    renderMessages(App.activeChat);
  }, 1500);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function autoResizeTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function filterChats(type, btn) {
  document.querySelectorAll('.ms-tab').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }

  const list = document.getElementById('chatList');
  if (!list) return;

  const filtered = type === 'all' ? App.chatsData : App.chatsData.filter(c => c.type === type);
  const temp = App.chatsData;
  App.chatsData = filtered;
  renderChats();
  App.chatsData = temp;
}

function searchChats(q) {
  const list = document.getElementById('chatList');
  if (!list) return;
  const filtered = App.chatsData.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(q.toLowerCase())
  );
  const temp = App.chatsData;
  App.chatsData = filtered;
  renderChats();
  App.chatsData = temp;
}

function closeConversation() {
  const sidebar = document.getElementById('messengerSidebar');
  const conv = document.getElementById('msConversation');
  const empty = document.getElementById('msEmpty');
  if (sidebar) sidebar.style.display = '';
  if (conv) conv.style.display = 'none';
  if (empty) empty.style.display = 'flex';
  App.activeChat = null;
}

function startVoiceCall() { showToast('Ovozli qo\'ng\'iroq: Tez orada!', 'info'); }
function startVideoCall() { showToast('Video qo\'ng\'iroq: Tez orada!', 'info'); }
function openChatInfo() { showToast('Chat ma\'lumotlari', 'info'); }
function attachFile() { showToast('Fayl biriktirish: Tez orada!', 'info'); }
function attachImage() { showToast('Rasm yuborish: Tez orada!', 'info'); }
function toggleEmoji() { showToast('Emoji: Tez orada!', 'info'); }

// ════════════════════════════════════════════════════════════
// POST COMPOSER
// ════════════════════════════════════════════════════════════

function openComposer(mode) {
  const user = App.currentUser;
  const cfName = document.getElementById('cfName');
  const cfAvatar = document.getElementById('cfAvatar');
  if (cfName) cfName.textContent = user ? user.name : 'Mehmon';
  if (cfAvatar) {
    if (user?.photo) {
      cfAvatar.src = user.photo;
    } else {
      cfAvatar.style.display = 'none';
    }
  }

  // Set default type based on mode
  if (mode === 'photo') setPostType('sale', null);
  else if (mode === 'price') setPostType('sale', null);
  else if (mode === 'job') setPostType('job', null);

  openModal('composerModal');
}

function setPostType(type, btn) {
  App.postType = type;
  document.querySelectorAll('.cf-type-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const fieldsContainer = document.getElementById('postTypeFields');
  if (!fieldsContainer) return;

  const fieldSets = {
    sale: `
      <div class="form-field-inline">
        <label><i class="fas fa-tag"></i> Narx (so'm)</label>
        <input type="number" id="postPrice" placeholder="150000" min="0">
      </div>
      <div class="form-field-inline">
        <label><i class="fas fa-box"></i> Miqdor/Birlik</label>
        <input type="text" id="postUnit" placeholder="dona, metr, qop...">
      </div>`,
    buy: `
      <div class="form-field-inline">
        <label><i class="fas fa-money-bill"></i> Taklif narx</label>
        <input type="number" id="postBudget" placeholder="200000" min="0">
      </div>`,
    service: `
      <div class="form-field-inline">
        <label><i class="fas fa-tag"></i> Narx dan</label>
        <input type="number" id="postPriceFrom" placeholder="50000" min="0">
      </div>
      <div class="form-field-inline">
        <label><i class="fas fa-phone"></i> Telefon</label>
        <input type="tel" id="postPhone" placeholder="+998 90 123 45 67">
      </div>`,
    job: `
      <div class="form-field-inline">
        <label><i class="fas fa-briefcase"></i> Mutaxassislik</label>
        <input type="text" id="postSpecialty" placeholder="Elektrik, Santexnik...">
      </div>
      <div class="form-field-inline">
        <label><i class="fas fa-clock"></i> Davomiyligi</label>
        <input type="text" id="postDuration" placeholder="1-2 kun, 1 hafta...">
      </div>
      <div class="form-field-inline">
        <label><i class="fas fa-wallet"></i> Byudjet</label>
        <input type="number" id="postJobBudget" placeholder="500000">
      </div>`,
    news: `
      <div class="form-field-inline">
        <label><i class="fas fa-link"></i> Havola (ixtiyoriy)</label>
        <input type="url" id="postLink" placeholder="https://...">
      </div>`,
  };

  fieldsContainer.innerHTML = fieldSets[type] || '';
}

function submitPost() {
  const text = document.getElementById('composerText')?.value?.trim();
  if (!text) {
    showToast('Matn kiriting!', 'warning');
    return;
  }

  const newPost = {
    id: Date.now(),
    type: App.postType,
    user: { name: App.currentUser?.name || 'Mehmon', role: App.currentUser?.role || 'Foydalanuvchi', avatar: '' },
    text,
    price: null,
    images: App.composerImages,
    likes: 0,
    comments: 0,
    shares: 0,
    time: 'Hozir',
    location: '',
    saved: false,
  };

  App.feedPosts.unshift(newPost);
  renderFeed();
  closeModal('composerModal');
  const textArea = document.getElementById('composerText');
  if (textArea) textArea.value = '';
  App.composerImages = [];
  const preview = document.getElementById('composerImagePreview');
  if (preview) preview.innerHTML = '';
  showToast('E\'lon muvaffaqiyatli joylashtirildi!', 'success');
}

function handleComposerImages(e) {
  const files = Array.from(e.target.files);
  const preview = document.getElementById('composerImagePreview');
  if (!preview) return;
  preview.innerHTML = '';
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.insertAdjacentHTML('beforeend', `
        <div class="ci-preview-thumb">
          <img src="${ev.target.result}" alt="preview">
          <button class="ci-remove-thumb" onclick="this.parentNode.remove()" aria-label="O'chirish">&times;</button>
        </div>`);
    };
    reader.readAsDataURL(file);
  });
}

const composerText = document.getElementById('composerText');
if (composerText) {
  composerText.addEventListener('input', () => {
    const count = document.getElementById('composerCharCount');
    if (count) count.textContent = composerText.value.length;
  });
}

function addPriceField() {
  const price = prompt('Narxni kiriting (so\'m):');
  if (price && !isNaN(price)) {
    const text = document.getElementById('composerText');
    if (text) text.value += `\n💰 Narx: ${parseInt(price).toLocaleString('uz-UZ')} so'm`;
  }
}

function openLocationPicker() {
  showToast('Joylashuv tanlash: Tez orada!', 'info');
}

// ════════════════════════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════════════════════════

function renderProfile() {
  const gate = document.getElementById('profilAuthGate');
  const content = document.getElementById('profilContent');
  if (!gate || !content) return;

  if (App.currentUser) {
    gate.style.display = 'none';
    content.style.display = 'block';
    populateProfile(App.currentUser);
  } else {
    gate.style.display = 'flex';
    content.style.display = 'none';
  }
}

function populateProfile(user) {
  const fields = {
    profileName: user.name,
    profileRoleBadge: user.role,
    profileBio: user.bio || 'Bio qo\'shilmagan',
    sfName: user.name,
    sfRole: user.role,
    psPostCount: user.posts || 0,
    psRating: user.rating || '0.0',
    psReviews: user.reviews || 0,
    psCompleted: user.completed || 0,
  };

  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  const sfUserArea = document.getElementById('sfUserArea');
  const sfAuthArea = document.getElementById('sfAuthArea');
  if (sfUserArea) sfUserArea.style.display = 'flex';
  if (sfAuthArea) sfAuthArea.style.display = 'none';

  filterProfileTab('posts', null);
}

function filterProfileTab(tab, btn) {
  document.querySelectorAll('#profil .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const content = document.getElementById('profileTabContent');
  if (!content) return;

  switch (tab) {
    case 'posts':
      const userPosts = App.feedPosts.filter(p => p.user.name === App.currentUser?.name);
      content.innerHTML = userPosts.length > 0
        ? userPosts.map(p => buildPostCard(p)).join('')
        : `<div class="empty-state"><i class="fas fa-pen"></i><p>Hali e'lon yo'q</p><button class="btn-primary" onclick="openComposer()">E'lon berish</button></div>`;
      break;
    case 'reviews':
      content.innerHTML = `<div class="empty-state"><i class="fas fa-star"></i><p>Sharhlar yo'q</p></div>`;
      break;
    case 'info':
      content.innerHTML = `
        <div class="profile-info-grid">
          <div class="pi-item"><i class="fas fa-envelope"></i> <span>${App.currentUser?.email || '—'}</span></div>
          <div class="pi-item"><i class="fas fa-phone"></i> <span>${App.currentUser?.phone || '—'}</span></div>
          <div class="pi-item"><i class="fas fa-map-marker-alt"></i> <span>${App.currentUser?.region || 'Toshkent'}</span></div>
          <div class="pi-item"><i class="fas fa-calendar"></i> <span>Ro'yxatdan o'tgan: ${App.currentUser?.joinDate || '2024'}</span></div>
        </div>`;
      break;
    case 'portfolio':
      content.innerHTML = `<div class="empty-state"><i class="fas fa-images"></i><p>Portfolio bo'sh</p><button class="btn-primary" onclick="showToast('Portfolio qo\\'shish tez orada','info')">Rasm qo'shish</button></div>`;
      break;
  }
}

function changeAvatar() { showToast('Avatar o\'zgartirish: Tez orada!', 'info'); }
function changeCoverPhoto() { showToast('Muqova rasmi: Tez orada!', 'info'); }
function shareProfile() {
  navigator.clipboard.writeText(window.location.href).then(() => showToast('Profil havolasi nusxalandi!', 'success'));
}

function toggleUserMenu() {
  showToast('Menyu ochilmoqda...', 'info');
}

// ════════════════════════════════════════════════════════════
// SETTINGS
// ════════════════════════════════════════════════════════════

function renderSettings() {
  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) darkToggle.checked = App.theme === 'dark';
}

function toggleCompact() {
  document.body.classList.toggle('compact-view');
  showToast('Ko\'rinish o\'zgartirildi', 'success');
}

function changeLanguage(lang) {
  localStorage.setItem('torvex_lang', lang);
  showToast('Til o\'zgartirildi: ' + lang.toUpperCase(), 'success');
}

function saveNotifSettings() {
  showToast('Bildirishnoma sozlamalari saqlandi', 'success');
}

function savePrivacy() {
  showToast('Maxfiylik sozlamalari saqlandi', 'success');
}

function confirmClearData() {
  showConfirm(
    'Ma\'lumotlarni tozalash',
    'Barcha lokal ma\'lumotlar o\'chiriladi. Davom etasizmi?',
    () => {
      localStorage.clear();
      App.cart = [];
      App.favorites = { masters: [], products: [], posts: [] };
      updateCartBadge();
      showToast('Ma\'lumotlar tozalandi', 'success');
    }
  );
}

function confirmDeleteAccount() {
  showConfirm(
    'Hisobni o\'chirish',
    'Bu amalni qaytarib bo\'lmaydi. Hisobingiz butunlay o\'chiriladi!',
    () => {
      showToast('Hisob o\'chirish so\'rovi yuborildi', 'info');
      logoutUser();
    }
  );
}

// ════════════════════════════════════════════════════════════
// AUTHENTICATION
// ════════════════════════════════════════════════════════════

function switchAuthTab(tab) {
  const isRegister = tab === 'register';
  const loginTab = document.getElementById('tabLogin');
  const regTab = document.getElementById('tabRegister');
  const regFields = document.getElementById('registerFields');
  const loginOptions = document.getElementById('loginOptions');
  const title = document.getElementById('authModalTitle');
  const subtitle = document.getElementById('authSubtitle');
  const btnText = document.getElementById('authBtnText');

  if (loginTab) { loginTab.classList.toggle('active', !isRegister); loginTab.setAttribute('aria-selected', String(!isRegister)); }
  if (regTab) { regTab.classList.toggle('active', isRegister); regTab.setAttribute('aria-selected', String(isRegister)); }
  if (regFields) regFields.style.display = isRegister ? 'block' : 'none';
  if (loginOptions) loginOptions.style.display = isRegister ? 'none' : 'flex';
  if (title) title.textContent = isRegister ? 'Ro\'yxatdan o\'tish' : 'Xush kelibsiz!';
  if (subtitle) subtitle.textContent = isRegister ? 'Yangi hisob yaratish' : 'Davom etish uchun hisobingizga kiring';
  if (btnText) btnText.textContent = isRegister ? 'Ro\'yxatdan o\'tish' : 'Kirish';
}

function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail')?.value?.trim();
  const pass = document.getElementById('authPass')?.value;
  const spinner = document.getElementById('authSpinner');
  const btn = document.getElementById('authBtn');
  const isRegister = document.getElementById('tabRegister')?.classList.contains('active');

  // Validation
  clearAuthErrors();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError('authEmailErr', 'To\'g\'ri email kiriting');
    return;
  }
  if (!pass || pass.length < 6) {
    showFieldError('authPassErr', 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    return;
  }
  if (isRegister) {
    const confirm = document.getElementById('authConfirmPass')?.value;
    if (pass !== confirm) {
      showFieldError('authConfirmPassErr', 'Parollar mos emas');
      return;
    }
  }

  // Simulate auth
  if (spinner) spinner.style.display = 'inline-block';
  if (btn) btn.disabled = true;

  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    if (btn) btn.disabled = false;

    const name = document.getElementById('authName')?.value || email.split('@')[0];
    const phone = document.getElementById('authPhone')?.value || '';
    const role = document.getElementById('authRole')?.value || 'user';
    const roleLabels = { user: 'Mijoz', master: 'Usta', seller: 'Sotuvchi' };

    App.currentUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      phone,
      role: roleLabels[role] || 'Mijoz',
      joinDate: new Date().getFullYear(),
      posts: 0, rating: 0.0, reviews: 0, completed: 0,
    };

    closeModal('authModal');
    showToast(`Xush kelibsiz, ${App.currentUser.name}!`, 'success');
    updateAuthUI();
    renderProfile();
  }, 1500);
}

function updateAuthUI() {
  const user = App.currentUser;
  const topbarUser = document.getElementById('topbarUser');
  const sfUserArea = document.getElementById('sfUserArea');
  const sfAuthArea = document.getElementById('sfAuthArea');
  const sfName = document.getElementById('sfName');
  const sfRole = document.getElementById('sfRole');

  if (user) {
    if (sfUserArea) sfUserArea.style.display = 'flex';
    if (sfAuthArea) sfAuthArea.style.display = 'none';
    if (sfName) sfName.textContent = user.name;
    if (sfRole) sfRole.textContent = user.role;
    if (topbarUser) {
      topbarUser.innerHTML = `
        <div class="user-avatar-initials" style="background:${getColorByName(user.name)}">${user.name.charAt(0)}</div>`;
      topbarUser.onclick = () => showSection('profil');
    }
  } else {
    if (sfUserArea) sfUserArea.style.display = 'none';
    if (sfAuthArea) sfAuthArea.style.display = 'block';
    if (topbarUser) {
      topbarUser.innerHTML = '<div class="user-avatar-placeholder"><i class="fas fa-user"></i></div>';
      topbarUser.onclick = () => openModal('authModal');
    }
  }
}

function logoutUser() {
  App.currentUser = null;
  updateAuthUI();
  showSection('dash');
  showToast('Tizimdan chiqildi', 'info');
}

function loginWithGoogle() {
  showToast('Google orqali kirish: Tez orada!', 'info');
}

function loginWithTelegram() {
  showToast('Telegram orqali kirish: Tez orada!', 'info');
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearAuthErrors() {
  ['authEmailErr', 'authPassErr', 'authConfirmPassErr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(inputId + 'EyeIcon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    if (icon) icon.className = 'fas fa-eye';
  }
}

function subscribePlan(plan) {
  const planNames = { basic: 'Basic', pro: 'Pro', business: 'Business' };
  showToast(`${planNames[plan]} rejasi tanlandi! To'lov tez orada.`, 'success');
  closeModal('premiumModal');
}

// ════════════════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════════════════

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.classList.add('modal-open');
  const firstFocusable = modal.querySelector('button, input, select, textarea, a[href]');
  if (firstFocusable) setTimeout(() => firstFocusable.focus(), 100);
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; }, 300);
  document.body.classList.remove('modal-open');
}

function handleOverlayClick(e, modalId) {
  if (e.target.id === modalId) closeModal(modalId);
}

// Close modals on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    closeFabMenu();
    closeNotifPanel();
  }
});

// ════════════════════════════════════════════════════════════
// FAB MENU
// ════════════════════════════════════════════════════════════

function toggleFabMenu() {
  App.fabMenuOpen = !App.fabMenuOpen;
  const menu = document.getElementById('fabMenu');
  const btn = document.getElementById('fabMainBtn');
  const icon = document.getElementById('fabIcon');
  if (menu) menu.classList.toggle('open', App.fabMenuOpen);
  if (btn) btn.setAttribute('aria-expanded', String(App.fabMenuOpen));
  if (icon) icon.style.transform = App.fabMenuOpen ? 'rotate(45deg)' : 'rotate(0)';
}

function closeFabMenu() {
  App.fabMenuOpen = false;
  const menu = document.getElementById('fabMenu');
  const btn = document.getElementById('fabMainBtn');
  const icon = document.getElementById('fabIcon');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  if (icon) icon.style.transform = 'rotate(0)';
}

// ════════════════════════════════════════════════════════════
// GLOBAL SEARCH
// ════════════════════════════════════════════════════════════

let searchTimeout;
function handleGlobalSearch(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
}

function performSearch(q) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;
  const query = q.trim().toLowerCase();

  if (!query) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
    return;
  }

  const masterResults = App.mastersData
    .filter(m => m.name.toLowerCase().includes(query) || m.job.toLowerCase().includes(query))
    .slice(0, 3)
    .map(m => `<div class="srd-item" onclick="showSection('ustalar'); closeSearch()" role="option">
      <i class="fas fa-hard-hat"></i>
      <div><strong>${escHtml(m.name)}</strong><span>${escHtml(m.job)}</span></div>
    </div>`);

  const productResults = App.marketData
    .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
    .slice(0, 3)
    .map(p => `<div class="srd-item" onclick="openProductModal(${p.id}); closeSearch()" role="option">
      <i class="fas fa-box"></i>
      <div><strong>${escHtml(p.name)}</strong><span>${escHtml(p.brand)}</span></div>
    </div>`);

  const all = [...masterResults, ...productResults];

  if (all.length > 0) {
    dropdown.innerHTML = all.join('') + `
      <div class="srd-footer" onclick="showSection('ustalar'); closeSearch()">
        Barchasini ko'rish <i class="fas fa-arrow-right"></i>
      </div>`;
    dropdown.style.display = 'block';
    dropdown.setAttribute('aria-expanded', 'true');
  } else {
    dropdown.innerHTML = `<div class="srd-empty"><i class="fas fa-search"></i> Natija topilmadi</div>`;
    dropdown.style.display = 'block';
  }
}

function closeSearch() {
  const dropdown = document.getElementById('searchDropdown');
  const input = document.getElementById('globalSearch');
  if (dropdown) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; }
  if (input) input.value = '';
}

function initSearch() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-search')) closeSearch();
    if (!e.target.closest('.notif-panel') && !e.target.closest('#notifTrigger')) closeNotifPanel();
    if (!e.target.closest('.fab-container')) closeFabMenu();
  });
}

// ════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ════════════════════════════════════════════════════════════

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle' };
  const id = 'toast_' + Date.now();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.id = id;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span>${escHtml(message)}</span>
    <button onclick="removeToast('${id}')" aria-label="Yopish">&times;</button>`;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => removeToast(id), duration);
}

function removeToast(id) {
  const toast = document.getElementById(id);
  if (!toast) return;
  toast.classList.remove('show');
  setTimeout(() => toast.remove(), 300);
}

// ════════════════════════════════════════════════════════════
// CONFIRM DIALOG
// ════════════════════════════════════════════════════════════

function showConfirm(title, message, onConfirm) {
  const modal = document.getElementById('confirmModal');
  const titleEl = document.getElementById('confirmTitle');
  const msgEl = document.getElementById('confirmMessage');
  const okBtn = document.getElementById('confirmOkBtn');
  if (!modal) return;

  if (titleEl) titleEl.textContent = title;
  if (msgEl) msgEl.textContent = message;
  if (okBtn) {
    okBtn.onclick = () => {
      closeModal('confirmModal');
      onConfirm();
    };
  }
  openModal('confirmModal');
}

// ════════════════════════════════════════════════════════════
// SUPPORT MODAL
// ════════════════════════════════════════════════════════════

function toggleFaq(el) {
  el.classList.toggle('open');
  const answer = el.querySelector('.faq-answer');
  if (answer) answer.style.display = el.classList.contains('open') ? 'block' : 'none';
}

function openLiveChat() {
  closeModal('supportModal');
  showSection('muhokama');
  showToast('Canlı chat tez orada!', 'info');
}

// ════════════════════════════════════════════════════════════
// GLOBAL EVENTS
// ════════════════════════════════════════════════════════════

function bindGlobalEvents() {
  // Keyboard navigation for nav items
  document.querySelectorAll('.nav-item[tabindex="0"]').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cart-drawer') && !e.target.closest('#cartOverlay')) {
      // cart stays open until explicit close
    }
  });

  // Swipe gestures for mobile
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 80) {
      if (delta > 0 && touchStartX < 30) openSidebar();
      else if (delta < 0 && App.sidebarOpen) closeSidebar();
    }
  }, { passive: true });

  // Window resize
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768) {
      const sidebar = document.getElementById('messengerSidebar');
      if (sidebar) sidebar.style.display = '';
    }
  }, 200));

  // Scroll to update topbar
  const wrapper = document.getElementById('sectionsWrapper');
  if (wrapper) {
    wrapper.addEventListener('scroll', debounce(() => {
      const topbar = document.getElementById('topbar');
      if (topbar) topbar.classList.toggle('scrolled', wrapper.scrollTop > 20);
    }, 50));
  }

  // Hash change
  window.addEventListener('hashchange', handleURLHash);
}

// ════════════════════════════════════════════════════════════
// UTILITIES
// ════════════════════════════════════════════════════════════

function escHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getColorByName(name) {
  const colors = [
    '#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6',
    '#1abc9c','#e67e22','#34495e','#c0392b','#2980b9',
    '#27ae60','#d35400','#8e44ad','#16a085','#2c3e50'
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function formatPrice(n) {
  return n?.toLocaleString('uz-UZ') + ' so\'m';
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ════════════════════════════════════════════════════════════
// STUBS — Features under development
// ════════════════════════════════════════════════════════════

function becomeMasterModal() { openModal('becomeMasterModal'); }
function openModal_becomeMaster() { openModal('becomeMasterModal'); }

// Export globals needed by inline handlers
window.showSection       = showSection;
window.openModal         = openModal;
window.closeModal        = closeModal;
window.toggleSidebar     = toggleSidebar;
window.openSidebar       = openSidebar;
window.closeSidebar      = closeSidebar;
window.toggleTheme       = toggleTheme;
window.handleGlobalSearch= handleGlobalSearch;
window.toggleNotifPanel  = toggleNotifPanel;
window.markAllRead       = markAllRead;
window.toggleCart        = toggleCart;
window.addToCart         = addToCart;
window.removeFromCart    = removeFromCart;
window.updateCartQty     = updateCartQty;
window.checkout          = checkout;
window.openComposer      = openComposer;
window.setPostType       = setPostType;
window.submitPost        = submitPost;
window.handleComposerImages = handleComposerImages;
window.addPriceField     = addPriceField;
window.openLocationPicker= openLocationPicker;
window.likePost          = likePost;
window.savePost          = savePost;
window.sharePost         = sharePost;
window.toggleComments    = toggleComments;
window.openPostMenu      = openPostMenu;
window.filterFeed        = filterFeed;
window.loadMorePosts     = loadMorePosts;
window.searchMasters     = searchMasters;
window.sortMasters       = sortMasters;
window.filterByJob       = filterByJob;
window.toggleMasterFav   = toggleMasterFav;
window.hireMaster        = hireMaster;
window.openMasterModal   = openMasterModal;
window.toggleMapView     = toggleMapView;
window.filterMarket      = filterMarket;
window.sortMarket        = sortMarket;
window.searchMarket      = searchMarket;
window.setMarketView     = setMarketView;
window.toggleProductFav  = toggleProductFav;
window.openProductModal  = openProductModal;
window.changeQty         = changeQty;
window.openChat          = openChat;
window.sendMessage       = sendMessage;
window.handleChatKey     = handleChatKey;
window.autoResizeTextarea= autoResizeTextarea;
window.filterChats       = filterChats;
window.searchChats       = searchChats;
window.closeConversation = closeConversation;
window.startVoiceCall    = startVoiceCall;
window.startVideoCall    = startVideoCall;
window.openChatInfo      = openChatInfo;
window.attachFile        = attachFile;
window.attachImage       = attachImage;
window.toggleEmoji       = toggleEmoji;
window.filterProjects    = filterProjects;
window.filterProfileTab  = filterProfileTab;
window.changeAvatar      = changeAvatar;
window.changeCoverPhoto  = changeCoverPhoto;
window.shareProfile      = shareProfile;
window.toggleUserMenu    = toggleUserMenu;
window.renderSettings    = renderSettings;
window.toggleCompact     = toggleCompact;
window.changeLanguage    = changeLanguage;
window.saveNotifSettings = saveNotifSettings;
window.savePrivacy       = savePrivacy;
window.confirmClearData  = confirmClearData;
window.confirmDeleteAccount = confirmDeleteAccount;
window.switchAuthTab     = switchAuthTab;
window.handleAuth        = handleAuth;
window.logoutUser        = logoutUser;
window.loginWithGoogle   = loginWithGoogle;
window.loginWithTelegram = loginWithTelegram;
window.togglePasswordVisibility = togglePasswordVisibility;
window.subscribePlan     = subscribePlan;
window.toggleFabMenu     = toggleFabMenu;
window.closeFabMenu      = closeFabMenu;
window.handleOverlayClick= handleOverlayClick;
window.toggleFaq         = toggleFaq;
window.openLiveChat      = openLiveChat;
window.filterFavs        = filterFavs;
window.readNewsItem      = readNewsItem;
window.removeToast       = removeToast;
window.showToast         = showToast;