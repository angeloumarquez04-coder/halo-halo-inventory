// ============================================================
//  APP.JS — Global Utilities & Shared App Logic
//  Ube & Sand Halo-Halo Shop Inventory System
// ============================================================

// ---- Active Nav Highlight ----
export function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && currentPage === href) {
      link.classList.add('active');
    }
  });
}

// ---- Format Currency (₱) ----
export function formatCurrency(amount) {
  return '₱' + Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ---- Format Date ----
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

// ---- Format Date + Time ----
export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ---- Generate Order Number ----
export function generateOrderNumber() {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `ORD-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(Date.now()).slice(-5)}`;
}

// ---- Toast Notification ----
export function showToast(title, message = '', type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    warning: 'fa-triangle-exclamation',
    info: 'fa-circle-info'
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
    </button>
  `;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4500);
}

// ---- Sidebar Mobile Toggle ----
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

// ---- Confirm Dialog (promise-based) ----
export function confirmDialog(message) {
  return new Promise(resolve => {
    const existing = document.getElementById('_confirmDialog');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = '_confirmDialog';
    el.style.cssText = `
      position:fixed;inset:0;background:rgba(30,27,46,0.6);
      backdrop-filter:blur(4px);z-index:999;
      display:flex;align-items:center;justify-content:center;padding:20px;
    `;
    el.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:28px 24px;max-width:380px;width:100%;box-shadow:0 20px 60px rgba(91,45,142,0.22);">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <i class="fa-solid fa-circle-question" style="font-size:22px;color:var(--warning);"></i>
          <span style="font-size:1rem;font-weight:700;color:var(--gray-900);">Confirm Action</span>
        </div>
        <p style="color:var(--gray-700);font-size:0.9rem;margin-bottom:22px;">${message}</p>
        <div style="display:flex;gap:10px;justify-content:flex-end;">
          <button id="_confirmNo"  style="padding:10px 20px;border:2px solid var(--gray-200);border-radius:10px;background:var(--gray-100);font-family:inherit;font-size:0.875rem;font-weight:600;cursor:pointer;color:var(--gray-700);">Cancel</button>
          <button id="_confirmYes" style="padding:10px 20px;border:none;border-radius:10px;background:linear-gradient(135deg,var(--primary),var(--primary-light));color:#fff;font-family:inherit;font-size:0.875rem;font-weight:600;cursor:pointer;">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(el);
    el.querySelector('#_confirmYes').addEventListener('click', () => { el.remove(); resolve(true); });
    el.querySelector('#_confirmNo').addEventListener('click',  () => { el.remove(); resolve(false); });
  });
}

// ---- Debounce ----
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ---- Escape HTML (prevent XSS) ----
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---- Truncate text ----
export function truncate(str, maxLen = 40) {
  if (!str) return '—';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

// ---- Get today's date range (for Firestore queries) ----
export function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// ---- Loading button helper ----
export function setButtonLoading(btnEl, loading = true, originalHTML = '') {
  if (loading) {
    btnEl._originalHTML = btnEl.innerHTML;
    btnEl.disabled = true;
    btnEl.innerHTML = `<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Loading...`;
  } else {
    btnEl.disabled = false;
    btnEl.innerHTML = originalHTML || btnEl._originalHTML || 'Save';
  }
}

// ---- Stock status badge ----
export function stockBadge(stock, threshold = 10) {
  const isLow = Number(stock) <= Number(threshold);
  return isLow
    ? `<span class="badge badge-danger"><i class="fa-solid fa-triangle-exclamation"></i> Low</span>`
    : `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> In Stock</span>`;
}

// ---- Log type badge ----
export function logTypeBadge(type) {
  const map = {
    stock_in:   `<span class="badge badge-success"><i class="fa-solid fa-arrow-down"></i> Stock In</span>`,
    stock_out:  `<span class="badge badge-danger"><i class="fa-solid fa-arrow-up"></i> Stock Out</span>`,
    adjustment: `<span class="badge badge-info"><i class="fa-solid fa-sliders"></i> Adjustment</span>`,
    sale:       `<span class="badge badge-gold"><i class="fa-solid fa-cash-register"></i> Sale</span>`,
  };
  return map[type] || `<span class="badge badge-purple">${type}</span>`;
}
