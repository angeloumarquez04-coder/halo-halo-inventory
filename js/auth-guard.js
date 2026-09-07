// ============================================================
//  AUTH GUARD — protects all pages except login
//  Import this module at the top of every protected page
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

let _app, _auth, _db;

export function initFirebase() {
  if (!_app) {
    _app = initializeApp(firebaseConfig);
    _auth = getAuth(_app);
    _db = getFirestore(_app);
  }
  return { app: _app, auth: _auth, db: _db };
}

export async function requireAuth() {
  const { auth, db } = initFirebase();
  return new Promise((resolve) => {
    const overlay = document.getElementById('loadingOverlay');
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'index.html';
        return;
      }
      // Load user display name
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const displayName = userData.displayName || user.displayName || user.email.split('@')[0];
        const email = user.email;

        // Populate sidebar user info if present
        const nameEl = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        if (nameEl) nameEl.textContent = displayName;
        if (emailEl) emailEl.textContent = email;

        if (overlay) overlay.style.display = 'none';
        resolve({ user, userData, displayName, email });
      } catch {
        if (overlay) overlay.style.display = 'none';
        resolve({ user, userData: {}, displayName: user.email, email: user.email });
      }
    });
  });
}

export async function logoutUser() {
  const { auth } = initFirebase();
  await signOut(auth);
  window.location.href = 'index.html';
}

// ---- Toast Utility ----
export function showToast(title, message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ---- Mobile Sidebar Toggle ----
export function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ---- Format Currency (Philippine Peso) ----
export function formatCurrency(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- Format Date ----
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ---- Generate Order Number ----
export function generateOrderNumber() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `ORD-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${String(Date.now()).slice(-5)}`;
}
