/**
 * TORVEX | Industrial & Master Ecosystem
 * Full Control Script v2.6 (Firebase Integrated)
 * Lead Developer: Sarvarbek Rahmonjonov
 */

"use strict";

// 1. Firebase importlari (firebase-config.js dan)
import { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    onAuthStateChanged 
} from './firebase-config.js';

// --- 2. DATA (MA'LUMOTLAR OMBORI) ---
const TORVEX_DATA = {
    masters: [
        { id: 1, name: "Ali Valiyev", job: "Elektrik", rating: 4.9, exp: "12 yil", price: "100k", avatar: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Sardor Azimov", job: "Santexnik", rating: 4.7, exp: "8 yil", price: "80k", avatar: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Jasur Komilov", job: "Malyar", rating: 4.8, exp: "5 yil", price: "120k", avatar: "https://i.pravatar.cc/150?u=3" }
    ],
    products: [
        { id: 101, name: "Knauf Gipsokarton", price: 45000, img: "https://via.placeholder.com/150", category: "Qurilish" },
        { id: 102, name: "Bosch Perforator", price: 1200000, img: "https://via.placeholder.com/150", category: "Asboblar" }
    ]
};

// --- 3. GLOBAL STATE (ILOVA HOLATI) ---
let AppState = {
    user: null,
    cart: JSON.parse(localStorage.getItem('torvex_cart')) || [],
    currentTheme: localStorage.getItem('theme') || 'light'
};

// --- 4. INITIALIZATION (ISHGA TUSHIRISH) ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("TORVEX Ecosystem yuklanmoqda...");
    initTheme();
    renderMasters('all');
    renderMarket();
    setupChat();
    animateDashboard();
    checkAuthState(); // Login holatini tekshirish
    
    // Default bo'lim
    showSection('dash');
});

// --- 5. AUTH SYSTEM (GOOGLE LOGIN) ---
window.loginWithGoogle = async function() {
    try {
        console.log("Google tizimiga ulanish...");
        const result = await signInWithPopup(auth, googleProvider);
        updateUIForUser(result.user);
    } catch (error) {
        console.error("Auth xatosi:", error.message);
        alert("Xatolik: " + error.message);
    }
};

function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            AppState.user = user;
            updateUIForUser(user);
        }
    });
}

function updateUIForUser(user) {
    const authGate = document.getElementById('auth-gate');
    const profileSection = document.getElementById('real-profile-content');
    
    if (authGate && profileSection) {
        authGate.style.display = 'none';
        profileSection.style.display = 'block';
        profileSection.innerHTML = `
            <div class="user-card animate-fade-in">
                <img src="${user.photoURL}" class="user-avatar" style="width:60px; border-radius:50%">
                <h4>${user.displayName}</h4>
                <p>${user.email}</p>
                <button onclick="auth.signOut().then(() => location.reload())" class="btn-logout">Chiqish</button>
            </div>
        `;
    }
}

// --- 6. NAVIGATION ENGINE (BO'LIMLAR) ---
window.showSection = function(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item, .nav-item-mobile');

    const activeSection = document.getElementById(sectionId);
    if (!activeSection) return;

    sections.forEach(s => s.style.display = 'none');
    navItems.forEach(n => n.classList.remove('active'));

    activeSection.style.display = 'block';
    
    const navId = sectionId === 'dash' ? 'li-dash' : `li-${sectionId}`;
    const activeNav = document.getElementById(navId);
    if (activeNav) activeNav.classList.add('active');

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('active');
};

// --- 7. MASTERS SYSTEM (USTALAR KATALOGI) ---
window.renderMasters = function(filter = 'all') {
    const grid = document.getElementById('mastersGrid');
    if (!grid) return;

    const filtered = filter === 'all' ? TORVEX_DATA.masters : TORVEX_DATA.masters.filter(m => m.job === filter);
    
    grid.innerHTML = filtered.map(master => `
        <div class="master-card animate-fade-in">
            <div class="master-img">
                <img src="${master.avatar}" alt="${master.name}">
                <span class="verify-badge"><i class="fas fa-check"></i></span>
            </div>
            <div class="master-info">
                <h4>${master.name}</h4>
                <p class="job-tag">${master.job}</p>
                <div class="master-stats">
                    <span><i class="fas fa-star"></i> ${master.rating}</span>
                    <span><i class="fas fa-briefcase"></i> ${master.exp}</span>
                </div>
                <div class="master-footer">
                    <span class="price-start">${master.price} so'mdan</span>
                    <button onclick="window.showSection('muhokama')" class="btn-contact">Bog'lanish</button>
                </div>
            </div>
        </div>
    `).join('');

    const countEl = document.getElementById('totalMasters');
    if (countEl) countEl.innerText = filtered.length;
};

// filterByJob faqat bir marta window-da e'lon qilindi (SyntaxError oldini oladi)
window.filterByJob = function(job, event) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    window.renderMasters(job);
};

// --- 8. MARKETPLACE (BOZOR TIZIMI) ---
window.renderMarket = function() {
    const grid = document.getElementById('marketGrid');
    if (!grid) return;

    grid.innerHTML = TORVEX_DATA.products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-details">
                <h5>${p.name}</h5>
                <p class="price">${p.price.toLocaleString()} so'm</p>
                <button onclick="addToCart(${p.id})" class="btn-add-cart">Savatga</button>
            </div>
        </div>
    `).join('');
};

window.addToCart = function(id) {
    const product = TORVEX_DATA.products.find(p => p.id === id);
    AppState.cart.push(product);
    localStorage.setItem('torvex_cart', JSON.stringify(AppState.cart));
    updateCartUI();
};

function updateCartUI() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = AppState.cart.length;
}

// --- 9. CHAT & THEME ---
function setupChat() {
    const chatList = document.getElementById('chatList');
    if (!chatList) return;

    const chats = [
        { id: 1, name: "Ali Valiyev (Elektrik)", lastMsg: "Ertaga soat 9:00 da boraman.", time: "10:45" }
    ];

    chatList.innerHTML = chats.map(c => `
        <div class="chat-item" onclick="openConversation(${c.id})">
            <div class="chat-avatar">${c.name[0]}</div>
            <div class="chat-info">
                <b>${c.name}</b>
                <p>${c.lastMsg}</p>
            </div>
        </div>
    `).join('');
}

window.toggleDarkMode = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

function initTheme() {
    if (AppState.currentTheme === 'dark') document.body.classList.add('dark-mode');
}

function animateDashboard() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(c => {
        const target = +c.getAttribute('data-target');
        c.innerText = target.toLocaleString();
    });
}