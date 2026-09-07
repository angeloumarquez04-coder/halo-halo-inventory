// ============================================================
//  AUTH GUARD + SHARED UTILITIES
//  Ube & Sand Halo-Halo Shop — Inventory System
// ============================================================

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// ---- Init Firebase (singleton) ----
let _app, _auth, _db;

export function initFirebase() {
  if (!_app) {
    _app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    _auth = getAuth(_app);
    _db   = getFirestore(_app);
  }
  return { app: _app, auth: _auth, db: _db };
}

// ---- Require Auth (redirects to login if not signed in) ----
export async function requireAuth() {
  const { auth, db } = initFirebase();
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'index.html';
        return;
      }
      let displayName = user.displayName || user.email.split('@')[0];
      let userData = {};
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          userData = snap.data();
          displayName = userData.displayName || displayName;
        }
      } catch (_) {}

      // Fill sidebar user info
      const nameEl  = document.getElementById('sidebarUserName');
      const emailEl = document.getElementById('sidebarUserEmail');
      if (nameEl)  nameEl.textContent  = displayName;
      if (emailEl) emailEl.textContent = user.email;

      // Hide loading overlay
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.style.display = 'none';

      resolve({ user, userData, displayName, email: user.email });
    });
  });
}

// ---- Logout ----
export async function logoutUser() {
  const { auth } = initFirebase();
  await signOut(auth);
  window.location.href = 'index.html';
}

// ---- Toast ----
export function showToast(title, message = '', type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info:    'fa-circle-info'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4500);
}

// ---- Sidebar mobile toggle ----
export function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar-overlay');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ---- Format helpers ----
export function formatCurrency(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

export function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-PH', { year:'numeric', month:'short', day:'numeric' });
}

export function formatDateTime(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-PH', {
    year:'numeric', month:'short', day:'numeric',
    hour:'2-digit', minute:'2-digit'
  });
}

export function generateOrderNumber() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `ORD-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${String(Date.now()).slice(-5)}`;
}
