/**
 * HRMS — Leave Management Module
 * Handles: Apply Leave, Leave Table, Admin Approvals
 */

// ============================================================
// RENDER LEAVE PAGE
// ============================================================
function renderLeavePage() {
  const session = State.getSession();
  if (!session) return;

  renderLeaveQuotas(session.id);
  renderLeaveRequests(session.id);
}
window.renderLeavePage = renderLeavePage;

// ============================================================
// LEAVE QUOTAS
// ============================================================
function renderLeaveQuotas(empId) {
  const quota = State.getLeaveQuota(empId);

  const types = ['paid', 'sick', 'unpaid'];
  types.forEach(t => {
    const used  = quota[t]?.used  || 0;
    const total = quota[t]?.total || 0;
    const rem   = total - used;
    const pct   = total > 0 ? Math.min(100, (used / total) * 100) : 0;

    const usedEl  = document.getElementById(`leave-${t}-used`);
    const totalEl = document.getElementById(`leave-${t}-total`);
    const remEl   = document.getElementById(`leave-${t}-rem`);
    const fillEl  = document.getElementById(`leave-${t}-fill`);

    if (usedEl)  usedEl.textContent  = used;
    if (totalEl) totalEl.textContent = total;
    if (remEl)   remEl.textContent   = rem;
    if (fillEl)  fillEl.style.width  = pct + '%';
  });
}

// ============================================================
// LEAVE REQUESTS TABLE
// ============================================================
function renderLeaveRequests(empId, statusFilter = '') {
  const tbody = document.getElementById('leave-requests-tbody');
  if (!tbody) return;

  let leaves = State.getLeavesByEmp(empId)
    .filter(l => !statusFilter || l.status === statusFilter)
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  if (!leaves.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">No leave requests found.</td></tr>';
    return;
  }

  tbody.innerHTML = leaves.map(l => {
    const canCancel = l.status === 'Pending';
    const badgeClass = getStatusBadgeClass(l.status);
    const leaveClass = getLeaveTypeBadgeClass(l.type);

    return `
      <tr>
        <td><span class="badge ${leaveClass}">${l.type}</span></td>
        <td class="fw-600">${formatDateShort(l.from)}</td>
        <td class="fw-600">${formatDateShort(l.to)}</td>
        <td>${l.days} day${l.days !== 1 ? 's' : ''}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${l.reason}">${l.reason}</td>
        <td><span class="badge ${badgeClass}">${l.status}</span></td>
        <td>
          <div class="table-actions">
            ${canCancel
              ? `<button class="btn btn-sm btn-danger" onclick="confirmCancelLeave('${l.id}')">
                   <i class="fa-solid fa-xmark"></i> Cancel
                 </button>`
              : `<button class="btn btn-sm btn-ghost" onclick="viewLeaveDetails('${l.id}')" title="View details">
                   <i class="fa-regular fa-eye"></i>
                 </button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ============================================================
// STATUS FILTER
// ============================================================
document.getElementById('leave-status-filter').addEventListener('change', (e) => {
  const session = State.getSession();
  if (session) renderLeaveRequests(session.id, e.target.value);
});

// ============================================================
// APPLY LEAVE MODAL
// ============================================================
document.getElementById('apply-leave-btn').addEventListener('click', () => {
  document.getElementById('leave-apply-form').reset();
  document.querySelectorAll('#leave-apply-form .field-error').forEach(e => e.textContent = '');
  document.getElementById('leave-duration-display').textContent = 'Select dates to calculate duration';
  leaveRangeStart = null;
  leaveRangeEnd = null;
  leaveCalMonth = new Date().getMonth();
  leaveCalYear = new Date().getFullYear();
  document.getElementById('leave-from').value = '';
  document.getElementById('leave-to').value = '';
  document.getElementById('leave-from-display').textContent = 'Select a date';
  document.getElementById('leave-to-display').textContent = 'Select a date';
  renderLeaveMiniCalendar();
  Modal.open('leave-modal');
});

document.getElementById('leave-modal-close').addEventListener('click', () => Modal.close('leave-modal'));
document.getElementById('leave-cancel-btn').addEventListener('click',   () => Modal.close('leave-modal'));

// ============================================================
// LEAVE APPLY — MINI CALENDAR RANGE PICKER
// ============================================================
let leaveRangeStart = null;
let leaveRangeEnd   = null;
let leaveCalMonth   = new Date().getMonth();
let leaveCalYear    = new Date().getFullYear();

function renderLeaveMiniCalendar() {
  const label = document.getElementById('leave-cal-month-label');
  const grid  = document.getElementById('leave-cal-days');
  if (!label || !grid) return;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  label.textContent = `${monthNames[leaveCalMonth]} ${leaveCalYear}`;

  const firstDay = new Date(leaveCalYear, leaveCalMonth, 1);
  const lastDay  = new Date(leaveCalYear, leaveCalMonth + 1, 0);
  const startDow = firstDay.getDay();
  const todayStr = toDateString(new Date());

  let html = '';
  for (let i = 0; i < startDow; i++) {
    html += `<div class="cal-day other-month"></div>`;
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${leaveCalYear}-${padZ(leaveCalMonth + 1)}-${padZ(d)}`;
    const isPast  = dateStr < todayStr;

    let classes = 'cal-day';
    if (dateStr === todayStr) classes += ' today';
    if (isPast) classes += ' disabled-day';

    if (leaveRangeStart && dateStr === leaveRangeStart) classes += ' range-start';
    if (leaveRangeEnd && dateStr === leaveRangeEnd) classes += ' range-end';
    if (leaveRangeStart && leaveRangeEnd && dateStr > leaveRangeStart && dateStr < leaveRangeEnd) classes += ' in-range';

    html += `<div class="${classes}" title="${dateStr}" onclick="handleLeaveCalClick('${dateStr}', ${isPast})">${d}</div>`;
  }

  grid.innerHTML = html;
}

window.handleLeaveCalClick = function(dateStr, isPast) {
  if (isPast) return;

  if (!leaveRangeStart || (leaveRangeStart && leaveRangeEnd)) {
    // Start a fresh selection
    leaveRangeStart = dateStr;
    leaveRangeEnd = null;
  } else if (dateStr < leaveRangeStart) {
    // Clicked before the start — becomes the new start
    leaveRangeStart = dateStr;
    leaveRangeEnd = null;
  } else {
    leaveRangeEnd = dateStr;
  }

  document.getElementById('leave-from').value = leaveRangeStart || '';
  document.getElementById('leave-to').value = leaveRangeEnd || leaveRangeStart || '';
  document.getElementById('leave-from-display').textContent = leaveRangeStart ? formatDateShort(leaveRangeStart) : 'Select a date';
  document.getElementById('leave-to-display').textContent = (leaveRangeEnd || leaveRangeStart) ? formatDateShort(leaveRangeEnd || leaveRangeStart) : 'Select a date';

  const hint = document.getElementById('leave-cal-hint');
  hint.textContent = leaveRangeStart && !leaveRangeEnd
    ? 'Now click an end date.'
    : 'Click a start date, then an end date.';

  renderLeaveMiniCalendar();
  updateLeaveDuration();
};

// Bind calendar navigation buttons on load
setTimeout(() => {
  document.getElementById('leave-cal-prev-btn')?.addEventListener('click', () => {
    leaveCalMonth--;
    if (leaveCalMonth < 0) { leaveCalMonth = 11; leaveCalYear--; }
    renderLeaveMiniCalendar();
  });

  document.getElementById('leave-cal-next-btn')?.addEventListener('click', () => {
    leaveCalMonth++;
    if (leaveCalMonth > 11) { leaveCalMonth = 0; leaveCalYear++; }
    renderLeaveMiniCalendar();
  });
}, 500);

function updateLeaveDuration() {
  const from = document.getElementById('leave-from').value;
  const to   = document.getElementById('leave-to').value;
  const display = document.getElementById('leave-duration-display');

  if (!from || !to) {
    display.textContent = 'Select dates to calculate duration';
    return;
  }

  if (to < from) {
    display.textContent = 'End date must be on or after start date';
    display.style.color = 'var(--crimson-500)';
    return;
  }

  display.style.color = '';
  const days = daysBetween(from, to);
  display.textContent = `${days} working day${days !== 1 ? 's' : ''} (${formatDateShort(from)} to ${formatDateShort(to)})`;
}

// Submit leave
document.getElementById('leave-submit-btn').addEventListener('click', () => {
  submitLeaveApplication();
});

function submitLeaveApplication() {
  const session = State.getSession();
  if (!session) return;

  // Clear errors
  document.querySelectorAll('#leave-apply-form .field-error').forEach(e => e.textContent = '');

  const type   = document.getElementById('leave-type-select').value;
  const from   = document.getElementById('leave-from').value;
  const to     = document.getElementById('leave-to').value;
  const reason = document.getElementById('leave-reason').value.trim();
  let valid = true;

  if (!type) {
    document.getElementById('leave-type-error').textContent = 'Please select a leave type.';
    valid = false;
  }
  if (!from) {
    document.getElementById('leave-from-error').textContent = 'Please select a start date.';
    valid = false;
  }
  if (!to) {
    document.getElementById('leave-to-error').textContent = 'Please select an end date.';
    valid = false;
  }
  if (from && to && to < from) {
    document.getElementById('leave-to-error').textContent = 'End date must be on or after start date.';
    valid = false;
  }
  if (!reason) {
    document.getElementById('leave-reason-error').textContent = 'Please provide a reason.';
    valid = false;
  }

  if (!valid) return;

  const days = daysBetween(from, to);
  const quota = State.getLeaveQuota(session.id);
  const key   = type.toLowerCase();
  const remaining = (quota[key]?.total || 0) - (quota[key]?.used || 0);

  if (days > remaining) {
    document.getElementById('leave-type-error').textContent =
      `Insufficient ${type} leave balance. You have ${remaining} day(s) remaining.`;
    return;
  }

  const leave = {
    empId:       session.id,
    type,
    from,
    to,
    days,
    reason,
    status:      'Pending',
    appliedOn:   toDateString(new Date()),
    adminComment: '',
    reviewedBy:  '',
    reviewedOn:  ''
  };

  State.addLeave(leave);
  Modal.close('leave-modal');
  Toast.success('Leave request submitted successfully!');
  renderLeavePage();
  updateBadges();
}

// ============================================================
// CANCEL LEAVE
// ============================================================
window.confirmCancelLeave = function(leaveId) {
  document.getElementById('leave-cancel-modal').style.display = 'flex';

  const yesBtn = document.getElementById('leave-cancel-yes');
  const noBtn  = document.getElementById('leave-cancel-no');
  const close  = document.getElementById('leave-cancel-modal-close');

  const cleanup = () => {
    document.getElementById('leave-cancel-modal').style.display = 'none';
    document.body.style.overflow = '';
  };

  const doCancel = () => {
    cleanup();
    State.removeLeave(leaveId);
    Toast.success('Leave request cancelled.');
    renderLeavePage();
    updateBadges();
  };

  // Replace to avoid stacking listeners
  const newYes = yesBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  newYes.addEventListener('click', doCancel, { once: true });
  noBtn.addEventListener('click', cleanup, { once: true });
  close.addEventListener('click', cleanup, { once: true });
};

// ============================================================
// VIEW LEAVE DETAILS
// ============================================================
window.viewLeaveDetails = function(leaveId) {
  const leave = State.getLeaveById(leaveId);
  if (!leave) return;

  Modal.confirm(
    `${leave.type} Leave — ${leave.status}`,
    `From: ${formatDateShort(leave.from)}\nTo: ${formatDateShort(leave.to)}\nDays: ${leave.days}\nReason: ${leave.reason}${leave.adminComment ? '\nAdmin Comment: ' + leave.adminComment : ''}`,
    () => {}
  );
  // Change confirm button label
  const yesBtn = document.getElementById('confirm-yes');
  yesBtn.textContent = 'Close';
  yesBtn.className = 'btn btn-ghost';
  document.getElementById('confirm-no').style.display = 'none';
};

// ============================================================
// ADMIN APPROVALS PAGE
// ============================================================
function renderApprovalsPage() {
  const statusFilter = document.getElementById('approval-status-filter').value;
  renderApprovalsTable(statusFilter);
}
window.renderApprovalsPage = renderApprovalsPage;

function renderApprovalsTable(statusFilter = 'Pending') {
  const tbody = document.getElementById('approvals-tbody');
  if (!tbody) return;

  let leaves = State.getLeaves()
    .filter(l => !statusFilter || l.status === statusFilter)
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  if (!leaves.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="no-data">No ${statusFilter.toLowerCase()} leave requests.</td></tr>`;
    return;
  }

  tbody.innerHTML = leaves.map(l => {
    const emp = State.getUserById(l.empId);
    const empName = emp ? `${emp.firstName} ${emp.lastName}` : l.empId;
    const initials = emp ? getInitials(emp.firstName, emp.lastName) : '??';
    const badgeClass = getStatusBadgeClass(l.status);
    const typeClass  = getLeaveTypeBadgeClass(l.type);

    return `
      <tr>
        <td>
          <div class="table-emp-cell">
            <div class="table-avatar">${initials}</div>
            <div>
              <div class="table-emp-name">${empName}</div>
              <div class="table-emp-id">${l.empId}</div>
            </div>
          </div>
        </td>
        <td><span class="badge ${typeClass}">${l.type}</span></td>
        <td class="fw-600">${formatDateShort(l.from)}</td>
        <td class="fw-600">${formatDateShort(l.to)}</td>
        <td>${l.days}</td>
        <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${l.reason}">${l.reason}</td>
        <td>${formatDateShort(l.appliedOn)}</td>
        <td><span class="badge ${badgeClass}">${l.status}</span></td>
        <td>
          <div class="table-actions">
            ${l.status === 'Pending'
              ? `<button class="btn btn-sm btn-primary" onclick="openApprovalModal('${l.id}')">
                   <i class="fa-solid fa-gavel"></i> Review
                 </button>`
              : `<span class="text-muted" style="font-size:0.75rem">${l.reviewedBy || '--'}</span>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

document.getElementById('approval-status-filter').addEventListener('change', (e) => {
  renderApprovalsTable(e.target.value);
});

// ============================================================
// APPROVAL MODAL
// ============================================================
let activeApprovalId = null;

window.openApprovalModal = function(leaveId) {
  const leave = State.getLeaveById(leaveId);
  if (!leave) return;

  activeApprovalId = leaveId;
  const emp = State.getUserById(leave.empId);
  const empName = emp ? `${emp.firstName} ${emp.lastName}` : leave.empId;

  document.getElementById('approval-detail-grid').innerHTML = `
    <div class="approval-detail-item">
      <span class="approval-detail-label">Employee</span>
      <span class="approval-detail-val">${empName}</span>
    </div>
    <div class="approval-detail-item">
      <span class="approval-detail-label">Leave Type</span>
      <span class="approval-detail-val">${leave.type} Leave</span>
    </div>
    <div class="approval-detail-item">
      <span class="approval-detail-label">From</span>
      <span class="approval-detail-val">${formatDateShort(leave.from)}</span>
    </div>
    <div class="approval-detail-item">
      <span class="approval-detail-label">To</span>
      <span class="approval-detail-val">${formatDateShort(leave.to)}</span>
    </div>
    <div class="approval-detail-item">
      <span class="approval-detail-label">Duration</span>
      <span class="approval-detail-val">${leave.days} working day${leave.days !== 1 ? 's' : ''}</span>
    </div>
    <div class="approval-detail-item">
      <span class="approval-detail-label">Applied On</span>
      <span class="approval-detail-val">${formatDateShort(leave.appliedOn)}</span>
    </div>
    <div class="approval-detail-item" style="grid-column:1/-1">
      <span class="approval-detail-label">Reason</span>
      <span class="approval-detail-val">${leave.reason}</span>
    </div>
  `;

  document.getElementById('approval-comment').value = '';
  Modal.open('approval-modal');
};

document.getElementById('approval-modal-close').addEventListener('click', () => Modal.close('approval-modal'));
document.getElementById('approval-cancel-btn').addEventListener('click',  () => Modal.close('approval-modal'));

document.getElementById('approval-approve-btn').addEventListener('click', () => {
  processApproval('Approved');
});
document.getElementById('approval-reject-btn').addEventListener('click', () => {
  processApproval('Rejected');
});

function processApproval(decision) {
  if (!activeApprovalId) return;

  const session = State.getSession();
  const leave   = State.getLeaveById(activeApprovalId);
  if (!leave) return;

  const comment = document.getElementById('approval-comment').value.trim();
  const reviewer = session ? `${session.firstName} ${session.lastName}` : 'Admin';

  // Update leave record
  State.updateLeave(activeApprovalId, {
    status:      decision,
    adminComment: comment,
    reviewedBy:  reviewer,
    reviewedOn:  toDateString(new Date())
  });

  // Update leave quota if approved
  if (decision === 'Approved') {
    State.updateLeaveQuota(leave.empId, leave.type, leave.days);
  }

  Modal.close('approval-modal');
  Toast.success(`Leave ${decision.toLowerCase()} successfully.`);
  renderApprovalsPage();
  updateBadges();

  // Refresh dashboard if visible
  if (Router.currentPage === 'dashboard') renderDashboard();
}
