/**
 * HRMS — Dashboard Module
 * Renders Employee & Admin dashboards
 */

function renderDashboard() {
  const session = State.getSession();
  if (!session) return;

  const empDash   = document.getElementById('emp-dashboard');
  const adminDash = document.getElementById('admin-dashboard');

  if (session.role === 'admin') {
    empDash.style.display   = 'none';
    adminDash.style.display = 'block';
    renderAdminDashboard(session);
  } else {
    empDash.style.display   = 'block';
    adminDash.style.display = 'none';
    renderEmployeeDashboard(session);
  }
}
window.renderDashboard = renderDashboard;

// ============================================================
// EMPLOYEE DASHBOARD
// ============================================================
function renderEmployeeDashboard(user) {
  const now = new Date();
  const hour = now.getHours();

  // Greeting
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  document.getElementById('emp-greeting').textContent = `${greeting}, ${user.firstName}`;

  // Today's attendance
  const todayAtt = State.getTodayAttendance(user.id);
  renderTodayStatus(todayAtt);

  // Quick check-in button
  const quickBtn = document.getElementById('emp-checkin-quick-btn');
  if (quickBtn) {
    if (todayAtt && todayAtt.checkOut) {
      quickBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Done for Today</span>';
      quickBtn.disabled = true;
      quickBtn.classList.add('btn-ghost');
      quickBtn.classList.remove('btn-primary');
    } else if (todayAtt && !todayAtt.checkOut) {
      quickBtn.innerHTML = '<i class="fa-solid fa-fingerprint"></i><span>Check Out</span>';
      quickBtn.disabled = false;
      quickBtn.classList.remove('btn-ghost');
      quickBtn.classList.add('btn-primary');
    } else {
      quickBtn.innerHTML = '<i class="fa-solid fa-fingerprint"></i><span>Check In</span>';
      quickBtn.disabled = false;
      quickBtn.classList.remove('btn-ghost');
      quickBtn.classList.add('btn-primary');
    }
    quickBtn.onclick = () => {
      Router.navigate('attendance');
    };
  }

  // Stats
  renderEmpStats(user);

  // Recent leaves
  renderEmpRecentLeaves(user.id);

  // Recent attendance
  renderEmpRecentAttendance(user.id);
}

function renderTodayStatus(todayAtt) {
  const dot  = document.getElementById('status-dot');
  const text = document.getElementById('status-label-text');
  const checkInTime  = document.getElementById('display-checkin-time');
  const checkOutTime = document.getElementById('display-checkout-time');
  const duration     = document.getElementById('display-duration');

  if (!todayAtt) {
    dot.className  = 'status-dot status-dot-absent';
    text.textContent = 'Not Checked In';
    checkInTime.textContent  = '--:--';
    checkOutTime.textContent = '--:--';
    duration.textContent     = '--:--';
    return;
  }

  if (todayAtt.checkOut) {
    dot.className = 'status-dot status-dot-present';
    text.textContent = 'Checked Out';
  } else {
    dot.className = 'status-dot status-dot-present';
    text.textContent = 'Checked In — Working';
  }

  checkInTime.textContent  = formatTime12(todayAtt.checkIn) || '--:--';
  checkOutTime.textContent = todayAtt.checkOut ? formatTime12(todayAtt.checkOut) : 'Active';
  duration.textContent     = todayAtt.duration || '--:--';
}

function renderEmpStats(user) {
  // Hours this week
  const weekHours = calcWeekHours(user.id);
  document.getElementById('emp-stat-hours').textContent = weekHours;

  // Leaves remaining
  const quota = State.getLeaveQuota(user.id);
  const paidRem = (quota.paid.total - quota.paid.used);
  const sickRem = (quota.sick.total - quota.sick.used);
  document.getElementById('emp-stat-leaves').textContent = `${paidRem + sickRem} days`;

  // Attendance rate this month
  const rate = calcAttendanceRate(user.id);
  document.getElementById('emp-stat-rate').textContent = `${rate}%`;

  // Net salary
  const calc = State.calcPayroll(user.payroll);
  document.getElementById('emp-stat-salary').textContent = formatCurrency(calc.net);
}

function calcWeekHours(empId) {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const attendance = State.getAttendanceByEmp(empId);
  let totalMins = 0;

  attendance.forEach(a => {
    const d = new Date(a.date + 'T00:00:00');
    if (d >= weekStart && d <= today && a.checkIn && a.checkOut) {
      const [ih, im] = a.checkIn.split(':').map(Number);
      const [oh, om] = a.checkOut.split(':').map(Number);
      totalMins += (oh * 60 + om) - (ih * 60 + im);
    }
  });

  // Add today's ongoing session if checked in
  const todayAtt = State.getTodayAttendance(empId);
  if (todayAtt && todayAtt.checkIn && !todayAtt.checkOut) {
    const [ih, im] = todayAtt.checkIn.split(':').map(Number);
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    totalMins += Math.max(0, nowMins - (ih * 60 + im));
  }

  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}h ${padZ(m)}m`;
}

function calcAttendanceRate(empId) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  let workdays = 0;
  let present = 0;

  const cur = new Date(monthStart);
  while (cur <= now) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) workdays++;
    cur.setDate(cur.getDate() + 1);
  }

  const records = State.getAttendanceByEmp(empId).filter(a => {
    const d = new Date(a.date + 'T00:00:00');
    return d >= monthStart && d <= now;
  });
  present = records.length;

  if (workdays === 0) return 100;
  return Math.round((present / workdays) * 100);
}

function renderEmpRecentLeaves(empId) {
  const container = document.getElementById('emp-recent-leaves');
  if (!container) return;
  const leaves = State.getLeavesByEmp(empId).slice(-3).reverse();

  if (!leaves.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.8125rem;padding:0.5rem 0">No leave requests yet.</p>';
    return;
  }

  container.innerHTML = leaves.map(l => `
    <div class="leave-compact-item">
      <div class="leave-compact-info">
        <div class="leave-compact-type">${l.type} Leave</div>
        <div class="leave-compact-dates">${formatDateShort(l.from)} — ${formatDateShort(l.to)} · ${l.days} day${l.days > 1 ? 's' : ''}</div>
      </div>
      <span class="badge ${getStatusBadgeClass(l.status)}">${l.status}</span>
    </div>
  `).join('');
}

function renderEmpRecentAttendance(empId) {
  const container = document.getElementById('emp-recent-attendance');
  if (!container) return;
  const records = State.getAttendanceByEmp(empId).slice(-5).reverse();

  if (!records.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.8125rem;padding:0.5rem 0">No attendance records yet.</p>';
    return;
  }

  container.innerHTML = records.map(r => `
    <div class="att-compact-item">
      <span class="att-compact-date fw-600">${formatDateShort(r.date)}</span>
      <span class="att-compact-time">${formatTime12(r.checkIn)} — ${formatTime12(r.checkOut)}</span>
      <span class="att-compact-duration">${r.duration}</span>
      <span class="badge ${getStatusBadgeClass(r.status)}">${r.status}</span>
    </div>
  `).join('');
}

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function renderAdminDashboard(user) {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  document.getElementById('admin-greeting').textContent = `${greeting}, ${user.firstName}`;

  const allUsers = State.getUsers().filter(u => u.role === 'employee');
  const todayStr = toDateString(now);
  const pending  = State.getPendingLeaves();

  // Stats
  document.getElementById('admin-stat-total').textContent = allUsers.length;

  const presentToday = State.getAttendance().filter(a => a.date === todayStr).length;
  document.getElementById('admin-stat-present').textContent = presentToday;
  document.getElementById('admin-stat-absent').textContent  = Math.max(0, allUsers.length - presentToday);
  document.getElementById('admin-stat-pending').textContent = pending.length;

  // Total payroll
  const totalPayroll = allUsers.reduce((acc, u) => {
    const calc = State.calcPayroll(u.payroll);
    return acc + calc.net;
  }, 0);
  document.getElementById('admin-stat-payroll').textContent = formatCurrency(totalPayroll);

  // Employee overview table
  renderAdminEmpTable(allUsers, todayStr);

  // Pending approvals compact
  renderAdminPendingApprovals(pending);

  // Today's check-ins
  renderAdminTodaysCheckins(todayStr);
}

function renderAdminEmpTable(employees, todayStr) {
  const tbody = document.getElementById('admin-emp-tbody');
  if (!tbody) return;

  if (!employees.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="no-data">No employees found.</td></tr>';
    return;
  }

  tbody.innerHTML = employees.slice(0, 6).map(emp => {
    const hasCheckin = State.getAttendance().some(a => a.empId === emp.id && a.date === todayStr);
    const onLeave = State.getLeavesByEmp(emp.id).some(l =>
      l.status === 'Approved' && l.from <= todayStr && l.to >= todayStr
    );
    const attStatus = onLeave ? 'On Leave' : (hasCheckin ? 'Present' : 'Absent');
    const pendingLeave = State.getLeavesByEmp(emp.id).find(l => l.status === 'Pending');

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
        <td><span class="badge ${getStatusBadgeClass(attStatus)}">${attStatus}</span></td>
        <td>${pendingLeave
          ? `<span class="badge badge-pending">Pending</span>`
          : `<span class="text-muted" style="font-size:0.75rem">None</span>`}
        </td>
        <td>
          <div class="table-actions">
            <button class="btn btn-sm btn-secondary" onclick="adminViewEmployee('${emp.id}')">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="adminEditEmployee('${emp.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminPendingApprovals(pending) {
  const container = document.getElementById('admin-pending-approvals');
  if (!container) return;

  if (!pending.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.8125rem;padding:0.5rem 0">No pending approvals.</p>';
    return;
  }

  container.innerHTML = pending.slice(0, 4).map(l => {
    const emp = State.getUserById(l.empId);
    const empName = emp ? `${emp.firstName} ${emp.lastName}` : l.empId;
    return `
      <div class="leave-compact-item">
        <div class="leave-compact-info">
          <div class="leave-compact-type">${empName} — ${l.type} Leave</div>
          <div class="leave-compact-dates">${formatDateShort(l.from)} — ${formatDateShort(l.to)} · ${l.days} day${l.days > 1 ? 's' : ''}</div>
        </div>
        <button class="btn btn-sm btn-secondary" onclick="openApprovalModal('${l.id}')">Review</button>
      </div>
    `;
  }).join('');
}

function renderAdminTodaysCheckins(todayStr) {
  const container = document.getElementById('admin-todays-checkins');
  if (!container) return;
  const records = State.getAttendance().filter(a => a.date === todayStr);

  if (!records.length) {
    container.innerHTML = '<p class="text-muted" style="font-size:0.8125rem;padding:0.5rem 0">No check-ins yet today.</p>';
    return;
  }

  container.innerHTML = records.map(r => {
    const emp = State.getUserById(r.empId);
    const name = emp ? `${emp.firstName} ${emp.lastName}` : r.empId;
    return `
      <div class="att-compact-item" style="grid-template-columns:130px 1fr 1fr 80px">
        <span class="att-compact-date fw-600">${name}</span>
        <span class="att-compact-time">${formatTime12(r.checkIn)}</span>
        <span class="att-compact-duration">${r.checkOut ? formatTime12(r.checkOut) : '<span class="text-success">Active</span>'}</span>
        <span class="badge ${getStatusBadgeClass(r.status)}">${r.status}</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// ADMIN EMPLOYEE ACTIONS (called from dashboard table)
// ============================================================
window.adminViewEmployee = function(empId) {
  const emp = State.getUserById(empId);
  if (!emp) return;
  openViewEmployeeModal(emp);
};

window.adminEditEmployee = function(empId) {
  const emp = State.getUserById(empId);
  if (!emp) return;
  openProfileEditModal(emp, true);
};
