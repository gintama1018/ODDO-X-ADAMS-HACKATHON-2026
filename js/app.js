/**
 * HRMS — App Core: Router, Navigation, Toasts, Clock
 */

// ============================================================
// TOAST SYSTEM
// ============================================================
const Toast = {
  icons: {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    info:    'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  },

  show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${this.icons[type]} toast-icon"></i>
      <span class="toast-text">${message}</span>
      <button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    `;
    container.appendChild(toast);

    const close = () => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 350);
    };

    toast.querySelector('.toast-close').addEventListener('click', close);
    setTimeout(close, duration);
  },

  success(msg, dur) { this.show(msg, 'success', dur); },
  error(msg, dur)   { this.show(msg, 'error', dur || 5000); },
  info(msg, dur)    { this.show(msg, 'info', dur); },
  warning(msg, dur) { this.show(msg, 'warning', dur); }
};
window.Toast = Toast;

// ============================================================
// ROUTER
// ============================================================
const Router = {
  currentPage: 'dashboard',
  pageNames: {
    dashboard:  'Dashboard',
    attendance: 'Attendance',
    leaves:     'Leave Management',
    payroll:    'Payroll',
    profile:    'My Profile',
    employees:  'Employee Directory',
    approvals:  'Leave Approvals'
  },

  navigate(page, updateNav = true) {
    // Validate admin-only pages
    const session = State.getSession();
    const adminPages = ['employees', 'approvals'];
    if (adminPages.includes(page) && session?.role !== 'admin') {
      Toast.warning('Access denied. Admin only.');
      return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show requested page
    const target = document.getElementById(`page-${page}`);
    if (!target) return;
    target.classList.add('active');

    // Update nav active state
    if (updateNav) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
      if (navItem) navItem.classList.add('active');
    }

    // Update breadcrumb
    document.getElementById('breadcrumb-text').textContent = this.pageNames[page] || page;

    this.currentPage = page;

    // Trigger page-specific render
    this.onNavigate(page);
  },

  onNavigate(page) {
    switch (page) {
      case 'dashboard':
        if (typeof renderDashboard === 'function') renderDashboard();
        break;
      case 'attendance':
        if (typeof renderAttendancePage === 'function') renderAttendancePage();
        break;
      case 'leaves':
        if (typeof renderLeavePage === 'function') renderLeavePage();
        break;
      case 'payroll':
        if (typeof renderPayrollPage === 'function') renderPayrollPage();
        break;
      case 'profile':
        if (typeof renderProfilePage === 'function') renderProfilePage();
        break;
      case 'employees':
        if (typeof renderEmployeesPage === 'function') renderEmployeesPage();
        break;
      case 'approvals':
        if (typeof renderApprovalsPage === 'function') renderApprovalsPage();
        break;
    }
  }
};
window.Router = Router;

// ============================================================
// CLOCK
// ============================================================
function startClock() {
  function tick() {
    const now = new Date();
    const hours = now.getHours();
    const mins = padZ(now.getMinutes());
    const secs = padZ(now.getSeconds());
    const ampm = hours < 12 ? 'AM' : 'PM';
    const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const timeStr = `${padZ(h12)}:${mins}:${secs} ${ampm}`;

    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });

    // Topbar
    const topbarClock = document.getElementById('topbar-clock');
    const topbarDate  = document.getElementById('topbar-date');
    if (topbarClock) topbarClock.textContent = timeStr;
    if (topbarDate)  topbarDate.textContent = dateStr;

    // Attendance live clock
    const liveTime = document.getElementById('live-time');
    const liveDate = document.getElementById('live-date');
    if (liveTime) liveTime.textContent = `${padZ(h12)}:${mins}:${secs}`;
    if (liveDate) liveDate.textContent = dateStr;
  }

  tick();
  if (window._clockInterval) {
    clearInterval(window._clockInterval);
  }
  window._clockInterval = setInterval(tick, 1000);
}

// ============================================================
// APP SHELL — Show/hide, update UI for role
// ============================================================
function refreshShellIdentity(user) {
  const initials = getInitials(user.firstName, user.lastName);
  const fullName = `${user.firstName} ${user.lastName}`;

  // Update sidebar avatar
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  if (sidebarAvatar) {
    if (user.avatarImage) {
      sidebarAvatar.innerHTML = `<img src="${user.avatarImage}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
      sidebarAvatar.innerHTML = '';
      sidebarAvatar.textContent = initials;
    }
  }

  // Update topbar avatar
  const topbarAvatar = document.getElementById('topbar-avatar');
  if (topbarAvatar) {
    if (user.avatarImage) {
      topbarAvatar.innerHTML = `<img src="${user.avatarImage}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" />`;
    } else {
      topbarAvatar.innerHTML = '';
      topbarAvatar.textContent = initials;
    }
  }

  // Names and roles
  const sName = document.getElementById('sidebar-user-name');
  if (sName) sName.textContent = fullName;
  const sRole = document.getElementById('sidebar-user-role');
  if (sRole) sRole.textContent = user.role === 'admin' ? 'Administrator' : 'Employee';

  const tName = document.getElementById('topbar-user-name');
  if (tName) tName.textContent = fullName;
  const tRole = document.getElementById('topbar-user-role');
  if (tRole) tRole.textContent = user.role === 'admin' ? 'Administrator' : 'Employee';
}
window.refreshShellIdentity = refreshShellIdentity;

function showAppShell(user) {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-shell').classList.add('active');

  // Update identities
  refreshShellIdentity(user);

  // Admin menu
  const appShell = document.getElementById('app-shell');
  if (user.role === 'admin') {
    appShell.classList.add('show-admin');
  } else {
    appShell.classList.remove('show-admin');
  }

  startClock();
  Router.navigate('dashboard');
  updateBadges();
}

function showAuthScreen() {
  document.getElementById('app-shell').classList.remove('active');
  document.getElementById('auth-screen').classList.add('active');
}

// ============================================================
// BADGES (pending approvals, leave badge)
// ============================================================
function updateBadges() {
  const session = State.getSession();
  if (!session) return;

  // Admin: pending approvals badge
  const pending = State.getPendingLeaves();
  const approvalBadge = document.getElementById('nav-approval-badge');
  if (approvalBadge) {
    if (pending.length > 0) {
      approvalBadge.textContent = pending.length;
      approvalBadge.style.display = 'inline-flex';
    } else {
      approvalBadge.style.display = 'none';
    }
  }

  // Employee: pending own leaves
  if (session.role !== 'admin') {
    const myPending = State.getLeavesByEmp(session.id).filter(l => l.status === 'Pending').length;
    const leaveBadge = document.getElementById('nav-leave-badge');
    if (leaveBadge) {
      if (myPending > 0) {
        leaveBadge.textContent = myPending;
        leaveBadge.style.display = 'inline-flex';
      } else {
        leaveBadge.style.display = 'none';
      }
    }
  }
}
window.updateBadges = updateBadges;

// ============================================================
// MODAL HELPERS
// ============================================================
const Modal = {
  open(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Focus trap
    setTimeout(() => {
      const firstInput = el.querySelector('input, select, textarea, button:not(.modal-close-btn)');
      if (firstInput) firstInput.focus();
    }, 100);
  },

  close(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = 'none';
    document.body.style.overflow = '';
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
    document.body.style.overflow = '';
  },

  confirm(title, message, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    this.open('confirm-modal');

    const yesBtn = document.getElementById('confirm-yes');
    const noBtn  = document.getElementById('confirm-no');
    const close  = document.getElementById('confirm-close');

    // Remove old listeners
    const newYes = yesBtn.cloneNode(true);
    yesBtn.parentNode.replaceChild(newYes, yesBtn);
    newYes.addEventListener('click', () => {
      this.close('confirm-modal');
      onConfirm();
    });
    [noBtn, close].forEach(b => b.addEventListener('click', () => this.close('confirm-modal'), { once: true }));
  }
};
window.Modal = Modal;

// ============================================================
// GLOBAL EVENT LISTENERS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

  // ----- Check existing session -----
  const session = State.getSession();
  if (session && State.getUserById(session.id)) {
    showAppShell(session);
  } else {
    State.clearSession();
    showAuthScreen();
  }

  // ----- Nav item click -----
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      Router.navigate(item.dataset.page);
      // Close mobile menu
      if (window.innerWidth < 900) {
        document.getElementById('sidebar').classList.remove('mobile-open');
      }
    });
  });

  // ----- Card action button nav -----
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-action-btn[data-page]');
    if (btn) Router.navigate(btn.dataset.page);
  });

  // ----- Sidebar collapse -----
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });
  }

  // ----- Mobile menu -----
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });
  }

  // ----- Logout -----
  document.getElementById('logout-btn').addEventListener('click', () => {
    Modal.confirm('Sign Out', 'Are you sure you want to sign out?', () => {
      State.clearSession();
      showAuthScreen();
      // Reset to login form
      document.querySelectorAll('.auth-form-wrapper').forEach(f => f.classList.remove('active'));
      document.getElementById('login-form-wrapper').classList.add('active');
      Toast.success('Signed out successfully.');
    });
  });

  // ----- Close modals on overlay click -----
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) Modal.close(overlay.id);
    });
  });

  // ----- Sidebar mobile overlay -----
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 900) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar?.classList.contains('mobile-open') &&
          !sidebar.contains(e.target) &&
          e.target.id !== 'mobile-menu-btn') {
        sidebar.classList.remove('mobile-open');
      }
    }
  });

  // ----- Password toggle (generic) -----
  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-icon-wrapper');
      const input = wrapper?.querySelector('input');
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('i');
      icon.className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
    });
  });

  // ----- Admin add employee shortcut -----
  const adminAddEmpBtn = document.getElementById('admin-add-employee-btn');
  if (adminAddEmpBtn) {
    adminAddEmpBtn.addEventListener('click', () => Router.navigate('employees'));
  }

});

// ============================================================
// MOBILE SIDEBAR CSS ADDITION
// ============================================================
(function addMobileStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 900px) {
      .sidebar {
        position: fixed;
        top: 0; left: 0; bottom: 0;
        z-index: 200;
        transform: translateX(-100%);
        transition: transform 0.3s ease, width 0.4s ease;
        width: var(--sidebar-width) !important;
        min-width: var(--sidebar-width) !important;
      }
      .sidebar.mobile-open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0,0,0,0.5);
      }
      .sidebar .sidebar-brand-text,
      .sidebar .sidebar-user-info,
      .sidebar .nav-label,
      .sidebar .nav-section-label,
      .sidebar .nav-badge {
        display: block !important;
        opacity: 1 !important;
        width: auto !important;
        overflow: visible !important;
      }
      .sidebar .nav-badge { display: inline-flex !important; }
      #mobile-menu-btn { display: flex !important; }
    }
  `;
  document.head.appendChild(style);
})();
