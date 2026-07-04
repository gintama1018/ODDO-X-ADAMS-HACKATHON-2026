/**
 * HRMS — Authentication Module
 * Handles: Sign In, Sign Up, OTP Verification
 */

let pendingRegData = null;
let pendingOTP = null;

// ============================================================
// FORM SWITCHERS
// ============================================================
function showForm(id) {
  document.querySelectorAll('.auth-form-wrapper').forEach(f => f.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

document.getElementById('go-to-register').addEventListener('click', () => showForm('register-form-wrapper'));
document.getElementById('go-to-login').addEventListener('click', () => {
  clearForm('register-form');
  clearAllErrors();
  showForm('login-form-wrapper');
});
document.getElementById('back-to-register').addEventListener('click', () => showForm('register-form-wrapper'));

// ============================================================
// HELPERS
// ============================================================
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function clearAllErrors() {
  document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
}

function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(pw) {
  return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
}

function setButtonLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    const text = btn.querySelector('.btn-text');
    if (text) text.textContent = 'Please wait...';
    const icon = btn.querySelector('.btn-icon');
    if (icon) icon.className = 'spinner';
  } else {
    btn.disabled = false;
  }
}

// ============================================================
// LOGIN
// ============================================================
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  let valid = true;

  if (!email) {
    showError('login-email-error', 'Email is required.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('login-email-error', 'Enter a valid email address.');
    valid = false;
  }

  if (!password) {
    showError('login-password-error', 'Password is required.');
    valid = false;
  }

  if (!valid) return;

  setButtonLoading('login-btn', true);

  // Simulate async
  setTimeout(() => {
    const user = State.getUserByEmail(email);

    if (!user) {
      showError('login-email-error', 'No account found with this email.');
      setButtonLoading('login-btn', false);
      // Restore button
      const btn = document.getElementById('login-btn');
      const text = btn.querySelector('.btn-text');
      const icon = btn.querySelector('.btn-icon');
      if (text) text.textContent = 'Sign In';
      if (icon) { icon.className = 'fa-solid fa-arrow-right btn-icon'; }
      return;
    }

    if (user.password !== password) {
      showError('login-password-error', 'Incorrect password. Please try again.');
      setButtonLoading('login-btn', false);
      const btn = document.getElementById('login-btn');
      const text = btn.querySelector('.btn-text');
      const icon = btn.querySelector('.btn-icon');
      if (text) text.textContent = 'Sign In';
      if (icon) icon.className = 'fa-solid fa-arrow-right btn-icon';
      return;
    }

    // Success
    State.setSession(user);
    Toast.success(`Welcome back, ${user.firstName}!`);
    showAppShell(user);

    // Reset login form
    clearForm('login-form');
    const btn = document.getElementById('login-btn');
    if (btn) {
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Sign In';
      const icon = btn.querySelector('.btn-icon');
      if (icon) icon.className = 'fa-solid fa-arrow-right btn-icon';
    }
  }, 800);
});

// ============================================================
// PASSWORD STRENGTH
// ============================================================
document.getElementById('reg-password').addEventListener('input', (e) => {
  const pw = e.target.value;
  const fill = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');

  let strength = 0;
  if (pw.length >= 8) strength++;
  if (/[A-Z]/.test(pw)) strength++;
  if (/[0-9]/.test(pw)) strength++;
  if (/[^A-Za-z0-9]/.test(pw)) strength++;

  const pct = (strength / 4) * 100;
  fill.style.width = pct + '%';

  if (strength <= 1) {
    fill.style.background = 'linear-gradient(90deg, #dc2626, #ef4444)';
    label.textContent = 'Weak';
    label.style.color = '#ef4444';
  } else if (strength === 2) {
    fill.style.background = 'linear-gradient(90deg, #d97706, #f59e0b)';
    label.textContent = 'Fair';
    label.style.color = '#f59e0b';
  } else if (strength === 3) {
    fill.style.background = 'linear-gradient(90deg, #0d9488, #14b8a6)';
    label.textContent = 'Good';
    label.style.color = '#14b8a6';
  } else {
    fill.style.background = 'linear-gradient(90deg, #047857, #10b981)';
    label.textContent = 'Strong';
    label.style.color = '#10b981';
  }

  if (!pw) {
    fill.style.width = '0%';
    label.textContent = '';
  }
});

// ============================================================
// REGISTER
// ============================================================
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  clearAllErrors();

  const fname  = document.getElementById('reg-fname').value.trim();
  const lname  = document.getElementById('reg-lname').value.trim();
  const empid  = document.getElementById('reg-empid').value.trim().toUpperCase();
  const email  = document.getElementById('reg-email').value.trim().toLowerCase();
  const dept   = document.getElementById('reg-dept').value;
  const pw     = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  let valid = true;

  if (!fname) { showError('reg-fname-error', 'First name is required.'); valid = false; }
  if (!lname) { showError('reg-lname-error', 'Last name is required.'); valid = false; }

  if (!empid) {
    showError('reg-empid-error', 'Employee ID is required.');
    valid = false;
  } else if (!/^EMP-\d{3,}$/.test(empid)) {
    showError('reg-empid-error', 'Format must be EMP-XXX (e.g. EMP-005).');
    valid = false;
  } else if (State.getUserById(empid)) {
    showError('reg-empid-error', 'This Employee ID is already taken.');
    valid = false;
  }

  if (!email) {
    showError('reg-email-error', 'Email is required.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('reg-email-error', 'Enter a valid email address.');
    valid = false;
  } else if (State.getUserByEmail(email)) {
    showError('reg-email-error', 'An account with this email already exists.');
    valid = false;
  }

  if (!dept) { showError('reg-dept-error', 'Please select a department.'); valid = false; }

  if (!pw) {
    showError('reg-password-error', 'Password is required.');
    valid = false;
  } else if (!validatePassword(pw)) {
    showError('reg-password-error', 'Min 8 characters, 1 uppercase, 1 number.');
    valid = false;
  }

  if (!confirm) {
    showError('reg-confirm-error', 'Please confirm your password.');
    valid = false;
  } else if (pw !== confirm) {
    showError('reg-confirm-error', 'Passwords do not match.');
    valid = false;
  }

  if (!valid) return;

  // Store pending and show OTP
  pendingRegData = { fname, lname, empid, email, dept, pw };
  pendingOTP = generateOTP();

  document.getElementById('verify-email-display').textContent = email;
  document.getElementById('verify-code-hint').textContent = pendingOTP;

  // Clear OTP inputs
  document.querySelectorAll('.otp-digit').forEach(i => {
    i.value = '';
    i.classList.remove('filled');
  });

  showForm('verify-form-wrapper');

  // Focus first OTP input
  setTimeout(() => {
    document.querySelector('.otp-digit')?.focus();
  }, 200);
});

// ============================================================
// OTP INPUTS — AUTO ADVANCE
// ============================================================
const otpDigits = document.querySelectorAll('.otp-digit');
otpDigits.forEach((input, idx) => {
  input.addEventListener('input', (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val;
    if (val) {
      e.target.classList.add('filled');
      if (idx < otpDigits.length - 1) otpDigits[idx + 1].focus();
    } else {
      e.target.classList.remove('filled');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && idx > 0) {
      otpDigits[idx - 1].focus();
      otpDigits[idx - 1].value = '';
      otpDigits[idx - 1].classList.remove('filled');
    }
    if (e.key === 'ArrowLeft' && idx > 0) otpDigits[idx - 1].focus();
    if (e.key === 'ArrowRight' && idx < otpDigits.length - 1) otpDigits[idx + 1].focus();
  });

  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    [...text].slice(0, 6).forEach((char, i) => {
      if (otpDigits[i]) {
        otpDigits[i].value = char;
        otpDigits[i].classList.add('filled');
      }
    });
    const nextIdx = Math.min(text.length, 5);
    otpDigits[nextIdx]?.focus();
  });
});

// ============================================================
// VERIFY & COMPLETE REGISTRATION
// ============================================================
document.getElementById('verify-form').addEventListener('submit', (e) => {
  e.preventDefault();
  clearError('verify-error');

  const entered = Array.from(otpDigits).map(i => i.value).join('');

  if (entered.length < 6) {
    showError('verify-error', 'Please enter all 6 digits.');
    return;
  }

  if (entered !== pendingOTP) {
    showError('verify-error', 'Invalid code. Please check and try again.');
    otpDigits.forEach(i => {
      i.style.borderColor = 'var(--crimson-500)';
      setTimeout(() => i.style.borderColor = '', 1200);
    });
    return;
  }

  if (!pendingRegData) {
    showError('verify-error', 'Session expired. Please register again.');
    showForm('register-form-wrapper');
    return;
  }

  // Create user
  const { fname, lname, empid, email, dept, pw } = pendingRegData;
  const newUser = {
    id: empid,
    email,
    password: pw,
    role: 'employee',
    firstName: fname,
    lastName: lname,
    designation: 'Employee',
    department: dept,
    status: 'Active',
    employmentType: 'Full-time',
    dateOfJoining: toDateString(new Date()),
    workLocation: 'Main Office',
    manager: 'Admin User',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    blood: '',
    emergency: '',
    bank: '',
    pan: '',
    payroll: {
      basic: 4000,
      hra: 1000,
      transport: 200,
      medical: 150,
      taxRate: 0.12,
      pfRate: 0.05,
      insuranceFlat: 80
    }
  };

  State.addUser(newUser);

  // Initialize leave quota
  const currentState = State.get();
  if (!currentState.leaveQuotas) currentState.leaveQuotas = {};
  currentState.leaveQuotas[empid] = {
    paid:   { total: 15, used: 0 },
    sick:   { total: 10, used: 0 },
    unpaid: { total: 5,  used: 0 }
  };
  State.set(currentState);

  // Login
  State.setSession(newUser);
  pendingRegData = null;
  pendingOTP = null;

  Toast.success(`Account created! Welcome, ${fname}!`);
  showAppShell(newUser);

  // Clear forms
  clearForm('register-form');
  clearAllErrors();
});
