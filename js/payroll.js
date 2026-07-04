/**
 * HRMS — Payroll Module
 * Handles: Employee payslip, Admin payroll management
 */

let payrollEditTarget = null;

// ============================================================
// RENDER PAYROLL PAGE
// ============================================================
function renderPayrollPage() {
  const session = State.getSession();
  if (!session) return;

  if (session.role === 'admin') {
    renderAdminPayroll();
  } else {
    renderEmployeePayslip(session);
  }
}
window.renderPayrollPage = renderPayrollPage;

// ============================================================
// EMPLOYEE PAYSLIP
// ============================================================
function renderEmployeePayslip(session) {
  document.getElementById('emp-payroll-view').style.display   = 'block';
  document.getElementById('admin-payroll-view').style.display = 'none';
  document.getElementById('payroll-subtitle').textContent = 'Your salary details and pay slips';

  const user = State.getUserById(session.id);
  if (!user) return;

  const calc = State.calcPayroll(user.payroll);

  // Employee info
  document.getElementById('ps-name').textContent        = `${user.firstName} ${user.lastName}`;
  document.getElementById('ps-id').textContent          = user.id;
  document.getElementById('ps-dept').textContent        = user.department;
  document.getElementById('ps-designation').textContent = user.designation;

  // Earnings
  document.getElementById('ps-basic').textContent     = formatCurrency(user.payroll.basic);
  document.getElementById('ps-hra').textContent        = formatCurrency(user.payroll.hra);
  document.getElementById('ps-transport').textContent  = formatCurrency(user.payroll.transport);
  document.getElementById('ps-medical').textContent    = formatCurrency(user.payroll.medical);
  document.getElementById('ps-gross').textContent      = formatCurrency(calc.gross);

  // Deductions
  document.getElementById('ps-tax').textContent        = formatCurrency(calc.tax);
  document.getElementById('ps-pf').textContent         = formatCurrency(calc.pf);
  document.getElementById('ps-insurance').textContent  = formatCurrency(calc.insurance);
  document.getElementById('ps-deductions').textContent = formatCurrency(calc.totalDeductions);

  // Net
  document.getElementById('ps-net').textContent = formatCurrency(calc.net);

  // Period (from select)
  const periodSelect = document.getElementById('payroll-month-select');
  if (periodSelect) {
    const val = periodSelect.value;
    const [year, month] = val.split('-');
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('payslip-period').textContent = `${monthNames[parseInt(month) - 1]} ${year}`;
  }

  // Populate period dropdown with last 6 months
  populatePayrollPeriod();
}

function populatePayrollPeriod() {
  const select = document.getElementById('payroll-month-select');
  if (!select || select.dataset.populated) return;

  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let options = '';

  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${padZ(d.getMonth() + 1)}`;
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    options += `<option value="${val}">${label}</option>`;
  }

  select.innerHTML = options;
  select.dataset.populated = 'true';
  select.addEventListener('change', () => {
    const session = State.getSession();
    if (session) renderPayrollPage();
  });
}

// Print payslip
document.getElementById('print-payslip-btn').addEventListener('click', () => {
  window.print();
});

// ============================================================
// ADMIN PAYROLL VIEW
// ============================================================
function renderAdminPayroll() {
  document.getElementById('emp-payroll-view').style.display   = 'none';
  document.getElementById('admin-payroll-view').style.display = 'block';
  document.getElementById('payroll-subtitle').textContent = 'Manage employee salaries and compensation';

  const employees = State.getUsers().filter(u => u.role !== 'admin');
  const tbody = document.getElementById('admin-payroll-tbody');
  if (!tbody) return;

  if (!employees.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No employees found.</td></tr>';
    return;
  }

  tbody.innerHTML = employees.map(emp => {
    const calc = State.calcPayroll(emp.payroll);
    return `
      <tr>
        <td>
          <div class="table-emp-cell">
            <div class="table-avatar">${getInitials(emp.firstName, emp.lastName)}</div>
            <div>
              <div class="table-emp-name">${emp.firstName} ${emp.lastName}</div>
              <div class="table-emp-id">${emp.id}</div>
            </div>
          </div>
        </td>
        <td>${emp.department}</td>
        <td class="fw-600">${formatCurrency(emp.payroll.basic)}</td>
        <td>${formatCurrency(calc.gross)}</td>
        <td style="color:var(--crimson-500)">${formatCurrency(calc.totalDeductions)}</td>
        <td style="color:var(--emerald-500);font-weight:700">${formatCurrency(calc.net)}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="openPayrollEditModal('${emp.id}')">
              <i class="fa-solid fa-pen-to-square"></i> Edit
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// EDIT PAYROLL MODAL (Admin)
// ============================================================
window.openPayrollEditModal = function(empId) {
  const emp = State.getUserById(empId);
  if (!emp) return;

  payrollEditTarget = empId;

  document.getElementById('payroll-edit-emp-name').textContent = `${emp.firstName} ${emp.lastName} (${emp.id})`;
  document.getElementById('pe-basic').value     = emp.payroll.basic;
  document.getElementById('pe-hra').value       = emp.payroll.hra;
  document.getElementById('pe-transport').value = emp.payroll.transport;
  document.getElementById('pe-medical').value   = emp.payroll.medical;

  updatePayrollCalcPreview(emp.payroll);
  Modal.open('payroll-edit-modal');
};

function updatePayrollCalcPreview(payroll) {
  const basic     = parseFloat(document.getElementById('pe-basic').value)     || payroll.basic     || 0;
  const hra       = parseFloat(document.getElementById('pe-hra').value)       || payroll.hra       || 0;
  const transport = parseFloat(document.getElementById('pe-transport').value) || payroll.transport || 0;
  const medical   = parseFloat(document.getElementById('pe-medical').value)   || payroll.medical   || 0;

  const tempPayroll = {
    basic, hra, transport, medical,
    taxRate: payroll.taxRate || 0.12,
    pfRate:  payroll.pfRate  || 0.05,
    insuranceFlat: payroll.insuranceFlat || 80
  };

  const calc = State.calcPayroll(tempPayroll);

  document.getElementById('pe-gross-preview').textContent = formatCurrency(calc.gross);
  document.getElementById('pe-tax-preview').textContent   = formatCurrency(calc.tax);
  document.getElementById('pe-pf-preview').textContent    = formatCurrency(calc.pf);
  document.getElementById('pe-net-preview').textContent   = formatCurrency(calc.net);
}

// Live preview on input
['pe-basic', 'pe-hra', 'pe-transport', 'pe-medical'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    if (!payrollEditTarget) return;
    const emp = State.getUserById(payrollEditTarget);
    if (emp) updatePayrollCalcPreview(emp.payroll);
  });
});

document.getElementById('payroll-modal-close').addEventListener('click', () => Modal.close('payroll-edit-modal'));
document.getElementById('payroll-edit-cancel').addEventListener('click', () => Modal.close('payroll-edit-modal'));

document.getElementById('payroll-edit-save').addEventListener('click', () => {
  if (!payrollEditTarget) return;

  const basic     = parseFloat(document.getElementById('pe-basic').value)     || 0;
  const hra       = parseFloat(document.getElementById('pe-hra').value)       || 0;
  const transport = parseFloat(document.getElementById('pe-transport').value) || 0;
  const medical   = parseFloat(document.getElementById('pe-medical').value)   || 0;

  if (basic < 0 || hra < 0 || transport < 0 || medical < 0) {
    Toast.error('Salary values cannot be negative.');
    return;
  }

  State.updatePayroll(payrollEditTarget, { basic, hra, transport, medical });
  Modal.close('payroll-edit-modal');
  Toast.success('Payroll updated successfully.');
  renderAdminPayroll();

  // Refresh dashboard stats
  if (Router.currentPage === 'dashboard') renderDashboard();
});
