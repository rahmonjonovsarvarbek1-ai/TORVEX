/**
 * TORVEX | Industrial & Master Ecosystem
 * Full Control Script v2.6 (Firebase Integrated)
 * Lead Developer: Sarvarbek Rahmonjonov
 */

"use strict";


import { 
    auth, 
    db, 
    googleProvider, 

    signInWithPopup, 
    onAuthStateChanged, 
    signOut 
} from './firebase-config.js';
// 2. Firestore funksiyalarini ham 'db' qayerdan kelayotgan bo'lsa, o'sha versiyada ishlating.
// Agar 'db' config ichida 'getFirestore()' bo'lsa, quyidagi importlarni ham config ichiga o'tkazgan ma'qul.
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    orderBy, 
    onSnapshot, 
    deleteDoc, 
    doc,
    getDoc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"; 
// DIQQAT: firebase-config.js ichidagi versiya ham 10.8.0 ekanligiga ishonch hosil qiling!
// --- ENDI PASTROQDA HECH QANDAY 'IMPORT' BO'LMASIN ---
// --- ENDI PASTROQDA HECH QANDAY 'IMPORT' BO'LMASIN ---


window.loginWithPhone = async () => {
    // 1. Foydalanuvchidan raqamni so'rash
    const phoneNumber = prompt("Telefon raqamingizni kiriting:", "+998901234567");
    
    if (!phoneNumber) return;

    // 2. ReCAPTCHA-ni sozlash (Invisible)
    // 'auth-modal' bu sizning modal oynangizning ID-si bo'lishi kerak
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'auth-modal', {
            'size': 'invisible'
        });
    }

    try {
        const appVerifier = window.recaptchaVerifier;
        
        // 3. SMS yuborish so'rovi (Test raqam bo'lgani uchun SMS kelmaydi)
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        
        // 4. Test kodini kiritish (Siz o'rnatgan 123456)
        const code = prompt("Siz belgilagan 6 xonali test kodini kiriting:");
        
        if (code) {
            const result = await confirmationResult.confirm(code);
            console.log("Muvaffaqiyatli kirildi!", result.user);
            alert("Xush kelibsiz! Telefon orqali kirish tasdiqlandi.");
            

        }
    } catch (error) {
        console.error("Xatolik:", error.code);
        alert("Xatolik yuz berdi: " + error.message);
    }
};

// 2.3 Apple orqali kirish
window.loginWithApple = () => {
    alert("Apple ID xizmati sozlanmoqda...");
};




// 1. Global funksiyalarni e'lon qilish (HTML onclick ishlashi uchun)
window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
};

window.updateComposerUserInfo = function(user) {
    const avatarImg = document.getElementById('user-avatar-composer');
    const composerTitle = document.querySelector('.composer-header span');
    
    if (user && avatarImg && composerTitle) {
        avatarImg.src = user.photoURL || 'assets/default-avatar.png';
        composerTitle.innerText = user.displayName || "Yangi e'lon";
    }
};

// 2. Auth holatini kuzatish
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // AppState bormi yoki yo'qligini tekshirish (xato bermasligi uchun)
        if (typeof AppState !== 'undefined') AppState.user = user;
        
        console.log("Sessiya faol:", user.email);
        
        try {
            // Firestore'dan foydalanuvchi ma'lumotlarini olish
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                
                // Inputlarni to'ldirish (Xavfsiz tekshiruv bilan)
                const fields = {
                    'dbUsername': data.username || '',
                    'dbRegion': data.region || 'Andijon',
                    'dbBirthdate': data.birthdate || ''
                };

                for (const [id, value] of Object.entries(fields)) {
                    const el = document.getElementById(id);
                    if (el) el.value = value;
                }
                
                // Telefon raqami
                const phoneEl = document.getElementById('dbPhone');
                if (phoneEl && data.phone) {
                    phoneEl.value = data.phone.replace("+998", "");
                }
                
                // Rolni aktivlashtirish
                if (data.role) {
                    window.currentSelectedRole = data.role;
                    if (window.selectProfileRole) window.selectProfileRole(data.role);
                }
            }
        } catch (error) {
            console.error("Ma'lumot yuklashda xato:", error);
        }
        
        // UI funksiyalarini chaqirish
        if (window.renderProfile) renderProfile();
        window.updateComposerUserInfo(user);
        
        // AGAR OQ OYNA BO'LSA: Asosiy bo'limni ko'rsatishni majburlash
        if (window.showSection) showSection('asosiy');

    } else {
        if (typeof AppState !== 'undefined') AppState.user = null;
        if (window.resetProfileUI) resetProfileUI();
        
        // Kirilmagan bo'lsa login (profil) oynasiga o'tkazish
        if (window.showSection) showSection('profil');

    }
});


// 2.5 Profil bo'limini chizish
function renderProfile() {
    const profileContainer = document.getElementById('profil');
    if (!profileContainer || !AppState.user) return;

    profileContainer.innerHTML = `
        <div class="profile-container" style="padding: 20px; animation: fadeIn 0.5s ease;">
            <div class="profile-header" style="text-align: center; margin-bottom: 25px;">
                <img src="${AppState.user.photoURL || 'assets/default-avatar.png'}" 
                     style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #f1c40f; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <h2 style="margin-top: 15px; color: var(--text-color);">${AppState.user.displayName || 'Foydalanuvchi'}</h2>
                <span style="color: #2ecc71; font-size: 0.9em;"><i class="fas fa-check-circle"></i> Tasdiqlangan profil</span>
            </div>

            <div class="profile-info-grid" style="display: grid; gap: 15px; background: rgba(0,0,0,0.05); padding: 20px; border-radius: 12px; color: var(--text-color);">
                <div class="info-item"><i class="far fa-envelope"></i> <strong>Email:</strong> ${AppState.user.email}</div>
                <div class="info-item"><i class="fas fa-phone-alt"></i> <strong>Tel:</strong> ${AppState.user.phoneNumber || 'Kiritilmagan'}</div>
                <div class="info-item"><i class="fas fa-id-badge"></i> <strong>ID:</strong> ${AppState.user.uid.substring(0, 10)}...</div>
            </div>

            <button onclick="window.handleLogout()" 
                    style="width: 100%; margin-top: 25px; background: #e74c3c; color: white; border: none; padding: 15px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-sign-out-alt"></i> Tizimdan chiqish
            </button>
        </div>
    `;
}

function resetProfileUI() {
    const profileContainer = document.getElementById('profil');
    if (profileContainer) {
        profileContainer.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
                <i class="fas fa-user-lock" style="font-size: 3em; color: #ccc;"></i>
                <p style="margin-top: 15px;">Profilni ko'rish uchun tizimga kiring</p>
                <button onclick="toggleAuthModal()" class="login-prompt-btn">Kirish</button>
            </div>
        `;
    }
}
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






window.loginWithGoogle = async function() {
    const googleBtn = document.querySelector('.social-btn.google');
    if (googleBtn.disabled) return; // Ikki marta bosishni oldini olish

    try {
        googleBtn.disabled = true;
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>...';
        
        // signInWithPopup ishlatishdan oldin keshni tozalash uchun
        const result = await signInWithPopup(auth, googleProvider);
        if (result.user) {
            showSection('asosiy');
        }
    } catch (error) {
        console.error("Login xatosi:", error);
    } finally {
        googleBtn.disabled = false;
        googleBtn.innerHTML = 'Google orqali kirish';
    }
};



// 5.1 EMAIL ORQALI KIRISH (Siz so'ragan funksiya)
window.initiateUserSession = async (event) => {
    if (event) event.preventDefault();
    
    const emailInput = document.getElementById('modalEmail');
    const email = emailInput ? emailInput.value : '';

    if (!email) {
        alert("Iltimos, email manzilingizni kiriting!");
        return;
    }

    // Hozircha konsolga chiqaradi, Firebase ulanmagan bo'lsa xabar beradi
    console.log("Email orqali kirish urinishi:", email);
    alert("Email xizmati vaqtincha sozlanmoqda. Iltimos, hozircha Google orqali kiring.");
};

// 5.2 TELEFON RAQAMI ORQALI KIRISH
window.loginWithPhone = async () => {
    const phoneNumber = prompt("Telefon raqamingizni kiriting (masalan: +998901234567):");
    
    if (!phoneNumber) {
        alert("Raqam kiritilmadi!");
        return;
    }

    console.log("Telefon orqali kirish urinishi:", phoneNumber);
    alert("Telefon orqali tasdiqlash xizmati vaqtincha sozlanmoqda. Iltimos, hozircha Google orqali kiring.");
    
    // Kelajakda Firebase sozlangach modalni yopish uchun:
    // const authModal = document.getElementById('auth-modal');
    // if (authModal) authModal.style.display = 'none';
};

// E. SAQLASH FUNKSIYASI (Siz boshlagan funksiya davomi)
window.updatePersonalDetails = async function() {
    const user = auth.currentUser;
    if (!user) return alert("Avval tizimga kiring!");

    const saveBtn = document.querySelector('.save-btn-modern');
    const originalText = saveBtn.innerHTML;
    
    const profileData = {
        username: document.getElementById('dbUsername').value.trim(),
        phone: "+998" + document.getElementById('dbPhone').value.trim(),
        birthdate: document.getElementById('dbBirthdate').value,
        region: document.getElementById('dbRegion').value,
        role: document.querySelector('input[name="profileRole"]:checked')?.value || 'observer',
        updatedAt: serverTimestamp()
    };

    try {
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saqlanmoqda...';
        await setDoc(doc(db, "users", user.uid), profileData, { merge: true });
        alert("Ma'lumotlaringiz TORVEX bazasida saqlandi!");
    } catch (e) {
        console.error("Saqlashda xato:", e);
        alert("Xatolik: " + e.message);
    } finally {
        saveBtn.innerHTML = originalText;
    }
};

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


window.showSection = function(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item, .nav-item-mobile');

    const activeSection = document.getElementById(sectionId);
    if (!activeSection) return;

   
    sections.forEach(s => s.style.display = 'none');
    navItems.forEach(n => n.classList.remove('active'));

    
    activeSection.style.display = 'block';
    
    // Pastki menyu aktivligini boshqarish
    const navId = sectionId === 'dash' ? 'li-dash' : `li-${sectionId}`;
    const activeNav = document.getElementById(navId);
    if (activeNav) activeNav.classList.add('active');

    // Profil bo'limi uchun auth tekshiruvi
    if (sectionId === 'profil') checkProfileAuthView();

    window.scrollTo(0, 0);
};


function checkProfileAuthView() {
    // auth obyekti yuklanganini tekshiramiz
    if (typeof auth === 'undefined') return; 

    const user = auth.currentUser; 
    const loggedInDiv = document.getElementById('auth-logged-in');
    const loggedOutDiv = document.getElementById('auth-logged-out');

    if (user) {
        if (loggedInDiv) loggedInDiv.style.display = 'block';
        if (loggedOutDiv) loggedOutDiv.style.display = 'none';
        console.log("Profil: Foydalanuvchi tizimda");
    } else {
        if (loggedInDiv) loggedInDiv.style.display = 'none';
        if (loggedOutDiv) loggedOutDiv.style.display = 'block';
        console.log("Profil: Foydalanuvchi tizimga kirmagan");
    }
}

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

// Tanlangan rolni saqlash uchun o'zgaruvchi
window.currentSelectedRole = '';

// Ro'lni tanlash mantiqi
window.selectProfileRole = function(role) {
    window.currentSelectedRole = role;
    
    // Hammasidan 'active'ni olib tashlash
    document.querySelectorAll('.role-option').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Tanlanganiga 'active' qo'shish
    const activeBtn = document.getElementById(`role-${role}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
};






// 1. E'lon berish modalini ochish
window.openAddAdModal = function() {
    console.log("E'lon berish modalini ochishga urinish...");
    const modal = document.getElementById('addAdModal');
    if (modal) {
        modal.style.display = 'flex';
        // Animatsiyani har safar yangilash uchun
        const content = modal.querySelector('.modal-content');
        content.style.animation = 'none';
        content.offsetHeight; /* reflow */
        content.style.animation = null;
    } else {
        console.error("Xatolik: 'addAdModal' topilmadi. HTML-da ID to'g'rimi?");
    }
};

// 2. Modalni yopish
window.closeAddAdModal = function() {
    const modal = document.getElementById('addAdModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// 3. Avtorizatsiya/Profil modalini ochish
window.toggleAuthModal = function() {
    console.log("Profil modalini ochish...");
    const authModal = document.getElementById('profil'); // Sizdagi ID profil edi
    if (authModal) {
        // Agar display none bo'lsa block qiladi, aksincha bo'lsa none
        const currentDisplay = window.getComputedStyle(authModal).display;
        authModal.style.display = currentDisplay === 'none' ? 'block' : 'none';
        
        if (authModal.style.display === 'block') {
            authModal.scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        console.error("Xatolik: 'profil' ID-li element topilmadi!");
    }
};

// Modalni yopish funksiyasi
window.closeAddAdModal = function() {
    const modal = document.getElementById('addAdModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};
window.handleImageSelect = function(event) {
    const files = Array.from(event.target.files);
    const previewGrid = document.getElementById('imagePreviewGrid');
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-container';
            div.innerHTML = `
                <img src="${e.target.result}">
                <button class="remove-img-btn" onclick="this.parentElement.remove()">&times;</button>
            `;
            previewGrid.appendChild(div);
        }
        reader.readAsDataURL(file);
    });
};

// E'lonni yuborish
window.submitAd = async function() {
    const description = document.getElementById('adDescription').value;
    const btn = document.getElementById('submitAdBtn');
    
    if (!description || selectedFiles.length === 0) {
        alert("Rasm va tavsif majburiy!");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Yuklanmoqda...";

        // 1. Rasmlarni Storage-ga yuklash
        const imageUrls = [];
        for (const file of selectedFiles) {
            const storageRef = ref(storage, `ads/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            imageUrls.push(url);
        }

        // 2. Firestore-ga ma'lumotlarni yozish
        await addDoc(collection(db, "posts"), {
            userId: auth.currentUser.uid,
            userName: auth.currentUser.displayName,
            userPhoto: auth.currentUser.photoURL,
            description: description,
            images: imageUrls,
            likes: [],
            commentsCount: 0,
            createdAt: serverTimestamp()
        });

        closeAddAdModal();
        alert("E'lon muvaffaqiyatli joylandi!");
        location.reload(); // Tasmani yangilash

    } catch (e) {
        console.error(e);
        alert("Xatolik yuz berdi.");
    } finally {
        btn.disabled = false;
    }
};


// --- 1. E'LON BERISH FUNKSIYASI ---
window.openAddAdModal = function() {
    const modal = document.getElementById('addAdModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Sahifa skrolini to'xtatish
    } else {
        alert("Tez orada e'lon berish oynasi ishga tushadi!");
    }
};

// --- 2. PREMIUM FUNKSIYASI ---
window.openPremiumModal = function() {
    // Premium xizmatlar haqida ma'lumot oynasi yoki sahifasi
    console.log("Premium bo'limi ochilmoqda...");
    alert("Premium obuna orqali e'lonlaringizni TOP-ga chiqaring! (Tez kunda)");
};

// --- 3. YORDAM FUNKSIYASI (Telegram botga yoki qo'llab-quvvatlashga) ---
window.openSupport = function() {
    // Foydalanuvchini qo'llab-quvvatlash markaziga yoki Telegram-ga yo'naltirish
    const supportLink = "https://t.me/rahmonjonov21"; // O'zingizning havolangizni qo'ying
    window.open(supportLink, '_blank');
};

// Modallarni yopish uchun umumiy funksiya
window.closeAddAdModal = function() {
    document.getElementById('addAdModal').style.display = 'none';
    document.body.style.overflow = 'auto';
};

// 1. E'lon berish oynasini ochish
window.openAddAdModal = function() {
    const composer = document.getElementById('inline-composer');
    if (composer) {
        composer.style.display = 'block';
        composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// 2. Oynani yopish
window.closeComposer = function() {
    document.getElementById('inline-composer').style.display = 'none';
};

// 3. Rasmlarni tanlash va ko'rsatish
window.handleImageSelect = function(event) {
    const previewGrid = document.getElementById('imagePreviewGrid');
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-container';
            div.style = "position: relative; flex: 0 0 120px;";
            div.innerHTML = `
                <img src="${e.target.result}" style="width:120px; height:120px; object-fit:cover; border-radius:12px; border:1px solid #eee;">
                <button onclick="this.parentElement.remove()" style="position:absolute; top:5px; right:5px; background:rgba(255,0,0,0.7); color:white; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer;">&times;</button>
            `;
            previewGrid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
};

// --- 1. POSTNI BAZAGA YUBORISH ---
window.submitAd = async function() {
    const descField = document.getElementById('adDescription');
    const previewGrid = document.getElementById('imagePreviewGrid');
    const images = Array.from(previewGrid.querySelectorAll('img')).map(img => img.src);
    const user = auth.currentUser;

    if (!user) return alert("Avval tizimga kiring!");
    if (!descField.value.trim() && images.length === 0) return alert("Ma'lumot kiriting!");

    try {
        // Firestore-ga yozish
        await addDoc(collection(db, "posts"), {
            userId: user.uid,
            userName: user.displayName || "Foydalanuvchi",
            userPhoto: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}`,
            text: descField.value,
            images: images,
            createdAt: serverTimestamp() // Butun umrga saqlash uchun
        });

        // Formani tozalash
        descField.value = '';
        previewGrid.innerHTML = '';
        window.closeComposer();
    } catch (e) {
        console.error("Xatolik yuz berdi: ", e);
    }
};

// --- 2. POSTLARNI HAMMA UCHUN CHIQARISH VA O'CHIRISH ---
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;
    
    feed.innerHTML = ''; // Dublikat bo'lmasligi uchun

    snapshot.forEach((postDoc) => {
        const post = postDoc.data();
        const isOwner = auth.currentUser && auth.currentUser.uid === post.userId;

        const postHTML = `
            <div class="post-card" style="background:#fff; border:1px solid #f0f0f0; border-radius:18px; padding:15px; margin-bottom:15px; position:relative;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                    <img src="${post.userPhoto}" style="width:35px; height:35px; border-radius:50%;">
                    <div>
                        <strong style="display:block; font-size:14px;">${post.userName}</strong>
                        <span style="font-size:11px; color:#999;">${post.createdAt?.toDate().toLocaleString() || 'Yuklanmoqda...'}</span>
                    </div>
                    
                    ${isOwner ? `
                        <button onclick="window.deletePost('${postDoc.id}')" style="margin-left:auto; background:none; border:none; color:#ff4d4d; cursor:pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
                <p style="font-size:15px; color:#333;">${post.text}</p>
                <div style="display:flex; gap:10px; overflow-x:auto; margin-top:10px;">
                    ${post.images.map(src => `<img src="${src}" style="height:200px; border-radius:12px;">`).join('')}
                </div>
            </div>
        `;
        feed.insertAdjacentHTML('beforeend', postHTML);
    });
});

// --- 3. O'CHIRISH FUNKSIYASI ---
window.deletePost = async function(postId) {
    if (confirm("Haqiqatan ham bu e'lonni o'chirmoqchimisiz?")) {
        try {
            await deleteDoc(doc(db, "posts", postId));
        } catch (e) {
            alert("Xatolik: O'chirishga ruxsatingiz yo'q!");
        }
    }
};
// Postni pastdagi tasmaga chiroyli chiqarish funksiyasi
function renderPostToFeed(post) {
    const feed = document.getElementById('posts-feed');
    if (!feed) return;

    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${post.userPhoto}" class="mini-avatar">
            <div class="post-info">
                <strong>${post.userName}</strong>
                <span>Hozirgincha</span>
            </div>
        </div>
        <div class="post-content">
            <p>${post.text}</p>
            <div class="post-images-grid">
                ${post.images.map(img => `<img src="${img}" class="feed-img">`).join('')}
            </div>
        </div>
        <div class="post-actions">
            <button class="action-btn"><i class="far fa-heart"></i> ${post.likes}</button>
            <button class="action-btn"><i class="far fa-comment"></i> 0</button>
            <button class="action-btn"><i class="fas fa-share"></i></button>
        </div>
    `;
    
    // Yangi postni eng tepaga qo'shish
    feed.prepend(postElement);
}

// Yangi postni tasmaga chiqarish funksiyasi
function renderNewPost(post) {
    const feed = document.getElementById('posts-feed');
    const postHTML = `
        <div class="post-card">
            <div class="post-header">
                <img src="${post.userPhoto}" class="mini-avatar">
                <div class="post-info">
                    <strong>${post.userName}</strong>
                    <span>Hozirgincha</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.text}</p>
                <div class="post-images">
                    ${post.images.map(src => `<img src="${src}" class="feed-img">`).join('')}
                </div>
            </div>
            <div class="post-actions">
                <span><i class="far fa-heart"></i> ${post.likes}</span>
                <span><i class="far fa-comment"></i> ${post.comments.length}</span>
            </div>
        </div>
    `;
    // Yangi postni eng tepaga qo'shish
    feed.insertAdjacentHTML('afterbegin', postHTML);
}

