/**
 * HRMS — Profile Management Module
 * Handles: View Profile, Edit Profile, Employee Directory
 */

let profileEditTarget = null; // empId being edited
let profileEditIsAdmin = false;

// ============================================================
// RENDER PROFILE PAGE
// ============================================================
function renderProfilePage() {
  const session = State.getSession();
  if (!session) return;
  const user = State.getUserById(session.id);
  if (!user) return;
  populateProfileView(user);
}
window.renderProfilePage = renderProfilePage;

function populateProfileView(user) {
  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const calc = State.calcPayroll(user.payroll);

  // Avatar / header
  document.getElementById('profile-avatar-large').textContent = initials;
  document.getElementById('profile-name-display').textContent = fullName;
  document.getElementById('profile-designation-display').textContent = user.designation || '--';
  document.getElementById('profile-dept-badge').textContent = user.department || '--';
  document.getElementById('profile-dept-display').textContent = user.department || '--';
  document.getElementById('profile-empid-display').textContent = user.id;
  document.getElementById('profile-email-display').textContent = user.email;

  // Personal tab
  document.getElementById('pf-fullname').textContent  = fullName;
  document.getElementById('pf-dob').textContent       = user.dob ? formatDate(user.dob) : '--';
  document.getElementById('pf-gender').textContent    = user.gender || '--';
  document.getElementById('pf-phone').textContent     = user.phone || '--';
  document.getElementById('pf-address').textContent   = user.address || '--';
  document.getElementById('pf-emergency').textContent = user.emergency || '--';
  document.getElementById('pf-blood').textContent     = user.blood || '--';

  // Job tab
  document.getElementById('pf-empid').textContent       = user.id;
  document.getElementById('pf-designation').textContent = user.designation || '--';
  document.getElementById('pf-dept').textContent        = user.department || '--';
  document.getElementById('pf-doj').textContent         = user.dateOfJoining ? formatDate(user.dateOfJoining) : '--';
  document.getElementById('pf-emptype').textContent     = user.employmentType || '--';
  document.getElementById('pf-location').textContent    = user.workLocation || '--';
  document.getElementById('pf-manager').textContent     = user.manager || '--';
  document.getElementById('pf-status').textContent      = user.status || '--';

  // Salary tab
  document.getElementById('pf-basic').textContent      = formatCurrency(user.payroll.basic);
  document.getElementById('pf-allowances').textContent = formatCurrency(user.payroll.hra + user.payroll.transport + user.payroll.medical);
  document.getElementById('pf-deductions').textContent = formatCurrency(calc.totalDeductions);
  document.getElementById('pf-net').textContent        = formatCurrency(calc.net);
  document.getElementById('pf-bank').textContent       = user.bank || '--';
  document.getElementById('pf-pan').textContent        = user.pan || '--';
}

// ============================================================
// PROFILE TABS
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.closest('.profile-detail-card') || btn.closest('.card');
    const tabId    = btn.dataset.tab;

    // Deactivate all in same group
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabGroup.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const content = document.getElementById(`tab-${tabId}`);
    if (content) content.classList.add('active');
  });
});

// ============================================================
// EDIT PROFILE MODAL
// ============================================================
document.getElementById('edit-profile-btn').addEventListener('click', () => {
  const session = State.getSession();
  if (!session) return;
  const user = State.getUserById(session.id);
  if (!user) return;
  openProfileEditModal(user, session.role === 'admin');
});

function openProfileEditModal(user, isAdmin = false) {
  profileEditTarget = user.id;
  profileEditIsAdmin = isAdmin;

  // Populate form
  document.getElementById('edit-fname').value     = user.firstName || '';
  document.getElementById('edit-lname').value     = user.lastName  || '';
  document.getElementById('edit-phone').value     = user.phone     || '';
  document.getElementById('edit-dob').value       = user.dob       || '';
  document.getElementById('edit-gender').value    = user.gender    || '';
  document.getElementById('edit-blood').value     = user.blood     || '';
  document.getElementById('edit-address').value   = user.address   || '';
  document.getElementById('edit-emergency').value = user.emergency || '';
  document.getElementById('edit-bank').value      = user.bank      || '';
  document.getElementById('edit-pan').value       = user.pan       || '';

  // Admin-only section
  const adminSection = document.getElementById('admin-edit-section');
  if (isAdmin) {
    adminSection.style.display = 'block';
    document.getElementById('edit-designation').value  = user.designation    || '';
    document.getElementById('edit-dept').value         = user.department     || '';
    document.getElementById('edit-emptype').value      = user.employmentType || 'Full-time';
    document.getElementById('edit-status').value       = user.status         || 'Active';
    document.getElementById('edit-basic-salary').value = user.payroll?.basic     || 0;
    document.getElementById('edit-hra').value          = user.payroll?.hra       || 0;
    document.getElementById('edit-transport').value    = user.payroll?.transport || 0;
    document.getElementById('edit-medical').value      = user.payroll?.medical   || 0;
  } else {
    adminSection.style.display = 'none';
  }

  document.getElementById('profile-modal-title').textContent = isAdmin
    ? `Edit: ${user.firstName} ${user.lastName}`
    : 'Edit Profile';

  Modal.open('profile-edit-modal');
}
window.openProfileEditModal = openProfileEditModal;

document.getElementById('profile-modal-close').addEventListener('click', () => Modal.close('profile-edit-modal'));
document.getElementById('profile-edit-cancel').addEventListener('click', () => Modal.close('profile-edit-modal'));

document.getElementById('profile-edit-save').addEventListener('click', () => {
  saveProfileEdit();
});

function saveProfileEdit() {
  if (!profileEditTarget) return;

  const fname = document.getElementById('edit-fname').value.trim();
  const lname = document.getElementById('edit-lname').value.trim();

  if (!fname || !lname) {
    Toast.error('First and last name are required.');
    return;
  }

  const updates = {
    firstName: fname,
    lastName:  lname,
    phone:     document.getElementById('edit-phone').value.trim(),
    dob:       document.getElementById('edit-dob').value,
    gender:    document.getElementById('edit-gender').value,
    blood:     document.getElementById('edit-blood').value,
    address:   document.getElementById('edit-address').value.trim(),
    emergency: document.getElementById('edit-emergency').value.trim(),
    bank:      document.getElementById('edit-bank').value.trim(),
    pan:       document.getElementById('edit-pan').value.trim()
  };

  if (profileEditIsAdmin) {
    updates.designation    = document.getElementById('edit-designation').value.trim();
    updates.department     = document.getElementById('edit-dept').value;
    updates.employmentType = document.getElementById('edit-emptype').value;
    updates.status         = document.getElementById('edit-status').value;
    updates.payroll = {
      ...State.getUserById(profileEditTarget)?.payroll,
      basic:     parseFloat(document.getElementById('edit-basic-salary').value) || 0,
      hra:       parseFloat(document.getElementById('edit-hra').value)          || 0,
      transport: parseFloat(document.getElementById('edit-transport').value)    || 0,
      medical:   parseFloat(document.getElementById('edit-medical').value)      || 0
    };
  }

  State.updateUser(profileEditTarget, updates);

  // Update session if editing own profile
  const session = State.getSession();
  if (session && session.id === profileEditTarget) {
    State.setSession({ ...session, ...updates });
  }

  Modal.close('profile-edit-modal');
  Toast.success('Profile updated successfully.');

  // Refresh current page
  if (Router.currentPage === 'profile') renderProfilePage();
  if (Router.currentPage === 'employees') renderEmployeesPage();
  if (Router.currentPage === 'dashboard') renderDashboard();

  // Update sidebar name
  const updatedUser = State.getUserById(profileEditTarget);
  if (updatedUser && session?.id === profileEditTarget) {
    const initials = getInitials(updatedUser.firstName, updatedUser.lastName);
    const fullName = `${updatedUser.firstName} ${updatedUser.lastName}`;
    document.getElementById('sidebar-avatar').textContent   = initials;
    document.getElementById('sidebar-user-name').textContent = fullName;
    document.getElementById('topbar-avatar').textContent    = initials;
    document.getElementById('topbar-user-name').textContent = fullName;
  }
}

// ============================================================
// EMPLOYEE DIRECTORY (Admin)
// ============================================================
function renderEmployeesPage() {
  const search = document.getElementById('emp-search')?.value.toLowerCase() || '';
  const dept   = document.getElementById('emp-dept-filter')?.value || '';
  renderEmployeesTable(search, dept);
}
window.renderEmployeesPage = renderEmployeesPage;

function renderEmployeesTable(search = '', dept = '') {
  const tbody = document.getElementById('employees-tbody');
  if (!tbody) return;

  let users = State.getUsers().filter(u => u.role !== 'admin');

  if (search) {
    users = users.filter(u =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) ||
      u.id.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  }
  if (dept) {
    users = users.filter(u => u.department === dept);
  }

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No employees found.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
      <td>
        <div class="table-emp-cell">
          <div class="table-avatar">${getInitials(u.firstName, u.lastName)}</div>
          <div>
            <div class="table-emp-name">${u.firstName} ${u.lastName}</div>
            <div class="table-emp-id">${u.email}</div>
          </div>
        </div>
      </td>
      <td class="fw-600">${u.id}</td>
      <td>${u.department}</td>
      <td>${u.designation}</td>
      <td><span class="badge ${getStatusBadgeClass(u.status)}">${u.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary" onclick="openViewEmployeeModal(State.getUserById('${u.id}'))">
            <i class="fa-regular fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-ghost" onclick="openProfileEditModal(State.getUserById('${u.id}'), true)">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Search and filter listeners
document.getElementById('emp-search').addEventListener('input', (e) => {
  const dept = document.getElementById('emp-dept-filter').value;
  renderEmployeesTable(e.target.value.toLowerCase(), dept);
});

document.getElementById('emp-dept-filter').addEventListener('change', (e) => {
  const search = document.getElementById('emp-search').value.toLowerCase();
  renderEmployeesTable(search, e.target.value);
});

// ============================================================
// VIEW EMPLOYEE MODAL (Admin)
// ============================================================
window.openViewEmployeeModal = function(user) {
  if (!user) return;
  const calc = State.calcPayroll(user.payroll);
  const fullName = `${user.firstName} ${user.lastName}`;

  document.getElementById('view-emp-modal-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--border-secondary)">
      <div class="table-avatar" style="width:52px;height:52px;font-size:1rem">${getInitials(user.firstName, user.lastName)}</div>
      <div>
        <div style="font-size:var(--font-size-xl);font-weight:700;color:var(--text-primary)">${fullName}</div>
        <div style="font-size:var(--font-size-sm);color:var(--text-tertiary)">${user.designation} · ${user.department}</div>
        <span class="badge ${getStatusBadgeClass(user.status)}" style="margin-top:0.25rem">${user.status}</span>
      </div>
    </div>
    <div class="info-grid" style="gap:0.75rem 2rem">
      <div class="info-field"><label>Employee ID</label><span>${user.id}</span></div>
      <div class="info-field"><label>Email</label><span>${user.email}</span></div>
      <div class="info-field"><label>Phone</label><span>${user.phone || '--'}</span></div>
      <div class="info-field"><label>Date of Joining</label><span>${user.dateOfJoining ? formatDate(user.dateOfJoining) : '--'}</span></div>
      <div class="info-field"><label>Employment Type</label><span>${user.employmentType || '--'}</span></div>
      <div class="info-field"><label>Work Location</label><span>${user.workLocation || '--'}</span></div>
      <div class="info-field"><label>Manager</label><span>${user.manager || '--'}</span></div>
      <div class="info-field"><label>Gender</label><span>${user.gender || '--'}</span></div>
      <div class="info-field info-field-full"><label>Address</label><span>${user.address || '--'}</span></div>
      <div class="info-field"><label>Basic Salary</label><span>${formatCurrency(user.payroll.basic)}</span></div>
      <div class="info-field"><label>Net Salary</label><span style="color:var(--emerald-500);font-weight:600">${formatCurrency(calc.net)}</span></div>
    </div>
  `;

  // Edit button wires up
  document.getElementById('view-emp-edit-btn').onclick = () => {
    Modal.close('view-employee-modal');
    openProfileEditModal(user, true);
  };

  Modal.open('view-employee-modal');
};

document.getElementById('view-emp-modal-close').addEventListener('click', () => Modal.close('view-employee-modal'));
document.getElementById('view-emp-close-btn').addEventListener('click', () => Modal.close('view-employee-modal'));
