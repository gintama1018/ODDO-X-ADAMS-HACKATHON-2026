/**
 * HRMS — Attendance Module
 * Handles: Check-in/out, Calendar, Log Table
 */

let calendarYear  = new Date().getFullYear();
let calendarMonth = new Date().getMonth(); // 0-indexed

function renderAttendancePage() {
  const session = State.getSession();
  if (!session) return;

  renderCheckinWidget(session);
  renderAttendanceCalendar(session.id);
  renderAttendanceLog(session.id);
  populateAttMonthFilter(session.id);
}
window.renderAttendancePage = renderAttendancePage;

// ============================================================
// CHECK-IN WIDGET
// ============================================================
function renderCheckinWidget(session) {
  const todayAtt = State.getTodayAttendance(session.id);

  const checkinBtn    = document.getElementById('checkin-btn');
  const statusBadge   = document.getElementById('att-status-badge');
  const checkinVal    = document.getElementById('att-checkin-val');
  const checkoutVal   = document.getElementById('att-checkout-val');
  const durationVal   = document.getElementById('att-duration-val');

  if (!todayAtt) {
    // Not checked in
    checkinBtn.className = 'btn btn-primary btn-full btn-checkin';
    checkinBtn.innerHTML = '<i class="fa-solid fa-fingerprint"></i><span>Check In</span>';
    checkinBtn.disabled  = false;
    statusBadge.className = 'status-badge status-absent';
    statusBadge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i><span>Not Checked In</span>';
    checkinVal.textContent   = '--:--';
    checkoutVal.textContent  = '--:--';
    durationVal.textContent  = '--:--';

  } else if (todayAtt.checkIn && !todayAtt.checkOut) {
    // Checked in, not out
    checkinBtn.className = 'btn btn-primary btn-full btn-checkin btn-checkout';
    checkinBtn.innerHTML = '<i class="fa-solid fa-door-open"></i><span>Check Out</span>';
    checkinBtn.disabled  = false;
    statusBadge.className = 'status-badge status-present';
    statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Checked In — Working</span>';
    checkinVal.textContent   = formatTime12(todayAtt.checkIn);
    checkoutVal.textContent  = 'Ongoing';
    durationVal.textContent  = calcLiveDuration(todayAtt.checkIn);

    // Live duration update
    clearInterval(window._durationTimer);
    window._durationTimer = setInterval(() => {
      const v = document.getElementById('att-duration-val');
      if (v) v.textContent = calcLiveDuration(todayAtt.checkIn);
    }, 60000);

  } else {
    // Checked out
    checkinBtn.className = 'btn btn-ghost btn-full btn-checkin';
    checkinBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Done for Today</span>';
    checkinBtn.disabled  = true;
    statusBadge.className = 'status-badge status-checked-out';
    statusBadge.innerHTML = '<i class="fa-solid fa-clock"></i><span>Checked Out</span>';
    checkinVal.textContent   = formatTime12(todayAtt.checkIn);
    checkoutVal.textContent  = formatTime12(todayAtt.checkOut);
    durationVal.textContent  = todayAtt.duration || '--:--';
    clearInterval(window._durationTimer);
  }

  // Also update dashboard quick button
  const quickBtn = document.getElementById('emp-checkin-quick-btn');
  if (quickBtn) {
    if (todayAtt && todayAtt.checkOut) {
      quickBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Done for Today</span>';
      quickBtn.disabled = true;
    } else if (todayAtt && !todayAtt.checkOut) {
      quickBtn.innerHTML = '<i class="fa-solid fa-fingerprint"></i><span>Check Out</span>';
      quickBtn.disabled = false;
    } else {
      quickBtn.innerHTML = '<i class="fa-solid fa-fingerprint"></i><span>Check In</span>';
      quickBtn.disabled = false;
    }
  }
}

function calcLiveDuration(checkInStr) {
  const [ih, im] = checkInStr.split(':').map(Number);
  const now = new Date();
  const totalMins = (now.getHours() * 60 + now.getMinutes()) - (ih * 60 + im);
  if (totalMins < 0) return '0h 00m';
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h}h ${padZ(m)}m`;
}

// ============================================================
// CHECK-IN / CHECK-OUT BUTTON
// ============================================================
document.getElementById('checkin-btn').addEventListener('click', () => {
  const session = State.getSession();
  if (!session) return;

  const now = new Date();
  const todayStr = toDateString(now);
  const timeStr  = `${padZ(now.getHours())}:${padZ(now.getMinutes())}`;
  const todayAtt = State.getTodayAttendance(session.id);

  if (!todayAtt) {
    // Check In
    const record = {
      id:       `att-${session.id}-${todayStr}`,
      empId:    session.id,
      date:     todayStr,
      checkIn:  timeStr,
      checkOut: null,
      duration: null,
      status:   'Present'
    };
    State.upsertAttendance(record);
    Toast.success(`Checked in at ${formatTime12(timeStr)}`);

  } else if (todayAtt.checkIn && !todayAtt.checkOut) {
    // Check Out
    const [ih, im] = todayAtt.checkIn.split(':').map(Number);
    const [oh, om] = timeStr.split(':').map(Number);
    const durationMins = (oh * 60 + om) - (ih * 60 + im);
    const status = durationMins < 240 ? 'Half-Day' : 'Present';

    const updated = {
      ...todayAtt,
      checkOut: timeStr,
      duration: minsToHM(Math.max(0, durationMins)),
      status
    };
    State.upsertAttendance(updated);
    clearInterval(window._durationTimer);
    Toast.success(`Checked out at ${formatTime12(timeStr)}. Total: ${minsToHM(durationMins)}`);

  } else {
    Toast.info('You have already completed attendance for today.');
    return;
  }

  // Refresh widget, calendar, and dashboard stats
  renderCheckinWidget(session);
  renderAttendanceCalendar(session.id);
  renderAttendanceLog(session.id);
  if (Router.currentPage === 'dashboard') renderDashboard();
});

// ============================================================
// ATTENDANCE CALENDAR
// ============================================================
function renderAttendanceCalendar(empId) {
  const label = document.getElementById('cal-month-label');
  const grid  = document.getElementById('calendar-days');
  if (!label || !grid) return;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  label.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  const firstDay   = new Date(calendarYear, calendarMonth, 1);
  const lastDay    = new Date(calendarYear, calendarMonth + 1, 0);
  const startDow   = firstDay.getDay(); // 0=Sun

  const attendance = State.getAttendanceByEmp(empId);
  const leaves     = State.getLeavesByEmp(empId).filter(l => l.status === 'Approved');
  const todayStr   = toDateString(new Date());

  // Build attendance map
  const attMap = {};
  attendance.forEach(a => attMap[a.date] = a.status);

  // Build leave map
  const leaveMap = {};
  leaves.forEach(l => {
    const cur = new Date(l.from + 'T00:00:00');
    const end = new Date(l.to + 'T00:00:00');
    while (cur <= end) {
      leaveMap[toDateString(cur)] = true;
      cur.setDate(cur.getDate() + 1);
    }
  });

  let html = '';

  // Empty cells before first day
  for (let i = 0; i < startDow; i++) {
    html += `<div class="cal-day other-month"></div>`;
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr  = `${calendarYear}-${padZ(calendarMonth + 1)}-${padZ(d)}`;
    const date     = new Date(dateStr + 'T00:00:00');
    const dow      = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isFuture  = dateStr > todayStr;
    const isToday   = dateStr === todayStr;

    let classes = 'cal-day';
    if (isToday)   classes += ' today';
    if (isWeekend) classes += ' weekend';

    if (!isFuture && !isWeekend) {
      if (leaveMap[dateStr]) {
        classes += ' leave';
      } else if (attMap[dateStr] === 'Present') {
        classes += ' present';
      } else if (attMap[dateStr] === 'Half-Day') {
        classes += ' half';
      } else {
        classes += ' absent';
      }
    }

    html += `<div class="${classes}" style="cursor:pointer;" title="${dateStr}" onclick="handleCalendarDateClick('${dateStr}', ${isFuture})">${d}</div>`;
  }

  grid.innerHTML = html;
}

window.handleCalendarDateClick = function(dateStr, isFuture) {
  if (!isFuture) {
    Toast.info(`Selected past/present date: ${formatDateShort(dateStr)}`);
    return;
  }

  Modal.confirm(
    'Apply for Leave?',
    `Would you like to apply for a leave starting on ${formatDateShort(dateStr)}?`,
    () => {
      // Navigate to leaves page
      Router.navigate('leaves');

      // Pre-populate input fields
      document.getElementById('leave-from').value = dateStr;
      document.getElementById('leave-to').value = dateStr;
      
      // Calculate leave duration
      const display = document.getElementById('leave-duration-display');
      if (display) {
        display.style.color = '';
        display.textContent = `1 working day (${formatDateShort(dateStr)} to ${formatDateShort(dateStr)})`;
      }
      
      // Open application modal
      Modal.open('leave-modal');
    }
  );
};

// Calendar navigation
document.getElementById('cal-prev-btn').addEventListener('click', () => {
  calendarMonth--;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  const session = State.getSession();
  if (session) renderAttendanceCalendar(session.id);
});

document.getElementById('cal-next-btn').addEventListener('click', () => {
  calendarMonth++;
  if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  const session = State.getSession();
  if (session) renderAttendanceCalendar(session.id);
});

// ============================================================
// ATTENDANCE LOG TABLE
// ============================================================
function renderAttendanceLog(empId, monthFilter = '') {
  const tbody = document.getElementById('attendance-log-tbody');
  if (!tbody) return;

  let records = State.getAttendanceByEmp(empId)
    .filter(a => !monthFilter || a.date.startsWith(monthFilter))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!records.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">No attendance records found.</td></tr>';
    return;
  }

  tbody.innerHTML = records.map(r => `
    <tr>
      <td class="fw-600">${formatDateShort(r.date)}</td>
      <td>${getDayName(r.date)}</td>
      <td>${formatTime12(r.checkIn)}</td>
      <td>${r.checkOut ? formatTime12(r.checkOut) : '<span class="text-success">Active</span>'}</td>
      <td>${r.duration || '--'}</td>
      <td><span class="badge ${getStatusBadgeClass(r.status)}">${r.status}</span></td>
    </tr>
  `).join('');
}

// Month filter for attendance log
function populateAttMonthFilter(empId) {
  const select = document.getElementById('att-month-filter');
  if (!select) return;

  const months = new Set();
  State.getAttendanceByEmp(empId).forEach(a => {
    months.add(a.date.substring(0, 7));
  });

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const options = Array.from(months).sort().reverse().map(m => {
    const [y, mo] = m.split('-');
    return `<option value="${m}">${monthNames[parseInt(mo) - 1]} ${y}</option>`;
  });

  select.innerHTML = '<option value="">All Months</option>' + options.join('');
  select.onchange = () => {
    const session = State.getSession();
    if (session) renderAttendanceLog(session.id, select.value);
  };
}
