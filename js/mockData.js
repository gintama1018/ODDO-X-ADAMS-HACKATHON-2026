/**
 * HRMS — Mock Data & LocalStorage State Management
 * TechVision India Pvt. Ltd. — Indian HR System
 */

const STORAGE_KEY  = 'hrms_state';
const DATA_VERSION = 'india-v3'; // bump to force a data reset

// ============================================================
// SEED DATA — INDIA (12 Employees)
// ============================================================
const SEED_DATA = {
  users: [
    // ─── ADMIN ───────────────────────────────────────────────
    {
      id: 'EMP-001',
      email: 'admin@techvision.in',
      password: 'Admin@123',
      role: 'admin',
      firstName: 'Rajesh',
      lastName: 'Sharma',
      designation: 'HR Manager',
      department: 'Human Resources',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2019-04-01',
      workLocation: 'Head Office — Mumbai',
      manager: 'Board of Directors',
      phone: '+91 98765 00001',
      dob: '1982-03-22',
      gender: 'Male',
      address: 'Flat 301, Sharma Residency, Andheri West, Mumbai, Maharashtra — 400053',
      blood: 'O+',
      emergency: 'Sunita Sharma (Wife): +91 98765 00099',
      bank: 'SBI — XXXX XXXX 1001',
      pan: 'ABCRS1234A',
      payroll: { basic: 95000, hra: 38000, transport: 3500, medical: 2000, taxRate: 0.15, pfRate: 0.12, insuranceFlat: 1500 }
    },

    // ─── ENGINEERING ─────────────────────────────────────────
    {
      id: 'EMP-002',
      email: 'priya@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Priya',
      lastName: 'Mehta',
      designation: 'Software Engineer',
      department: 'Engineering',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2022-06-13',
      workLocation: 'Bangalore Office',
      manager: 'Rajesh Sharma',
      phone: '+91 91234 56789',
      dob: '1997-08-14',
      gender: 'Female',
      address: 'Flat 12B, Green Park Apartments, Koramangala, Bengaluru, Karnataka — 560034',
      blood: 'A+',
      emergency: 'Suresh Mehta (Father): +91 91234 56780',
      bank: 'HDFC Bank — XXXX XXXX 2202',
      pan: 'BCDPM5678B',
      payroll: { basic: 52000, hra: 20800, transport: 2400, medical: 1250, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 800 }
    },
    {
      id: 'EMP-005',
      email: 'arjun@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Arjun',
      lastName: 'Nair',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2020-08-17',
      workLocation: 'Bangalore Office',
      manager: 'Rajesh Sharma',
      phone: '+91 94456 78901',
      dob: '1993-05-29',
      gender: 'Male',
      address: '32, Indiranagar 12th Main, Bengaluru, Karnataka — 560038',
      blood: 'B+',
      emergency: 'Lakshmi Nair (Mother): +91 94456 78902',
      bank: 'Kotak Mahindra Bank — XXXX XXXX 5505',
      pan: 'EFGAN6789E',
      payroll: { basic: 72000, hra: 28800, transport: 3000, medical: 1500, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 1000 }
    },
    {
      id: 'EMP-006',
      email: 'sneha@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Sneha',
      lastName: 'Iyer',
      designation: 'Backend Developer',
      department: 'Engineering',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2023-01-09',
      workLocation: 'Chennai Office',
      manager: 'Arjun Nair',
      phone: '+91 87654 11223',
      dob: '1999-12-03',
      gender: 'Female',
      address: '5, Velachery Main Road, Velachery, Chennai, Tamil Nadu — 600042',
      blood: 'A-',
      emergency: 'Ramesh Iyer (Father): +91 87654 11200',
      bank: 'SBI — XXXX XXXX 6606',
      pan: 'FGHSI7890F',
      payroll: { basic: 44000, hra: 17600, transport: 1800, medical: 1000, taxRate: 0.05, pfRate: 0.12, insuranceFlat: 700 }
    },
    {
      id: 'EMP-007',
      email: 'vikram@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Vikram',
      lastName: 'Singh',
      designation: 'DevOps Engineer',
      department: 'IT Infrastructure',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2021-07-01',
      workLocation: 'Head Office — Mumbai',
      manager: 'Rajesh Sharma',
      phone: '+91 99001 22334',
      dob: '1995-02-17',
      gender: 'Male',
      address: '14/B, Sion East, Mumbai, Maharashtra — 400022',
      blood: 'O-',
      emergency: 'Kavita Singh (Wife): +91 99001 22335',
      bank: 'ICICI Bank — XXXX XXXX 7707',
      pan: 'GHIVS2345G',
      payroll: { basic: 65000, hra: 26000, transport: 2800, medical: 1500, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 1000 }
    },

    // ─── DESIGN ──────────────────────────────────────────────
    {
      id: 'EMP-003',
      email: 'rahul@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Rahul',
      lastName: 'Verma',
      designation: 'Senior UI/UX Designer',
      department: 'Design',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2021-02-15',
      workLocation: 'Remote — Delhi NCR',
      manager: 'Rajesh Sharma',
      phone: '+91 99887 76543',
      dob: '1994-11-30',
      gender: 'Male',
      address: '45, Sector 18, Noida, Uttar Pradesh — 201301',
      blood: 'B+',
      emergency: 'Anita Verma (Spouse): +91 99887 76500',
      bank: 'ICICI Bank — XXXX XXXX 3303',
      pan: 'CDERV9012C',
      payroll: { basic: 60000, hra: 24000, transport: 2800, medical: 1250, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 1000 }
    },
    {
      id: 'EMP-008',
      email: 'meera@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Meera',
      lastName: 'Krishnan',
      designation: 'Graphic Designer',
      department: 'Design',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2023-07-03',
      workLocation: 'Bangalore Office',
      manager: 'Rahul Verma',
      phone: '+91 73456 89012',
      dob: '2000-03-11',
      gender: 'Female',
      address: 'No. 7, 2nd Cross, Jayanagar 4th Block, Bengaluru, Karnataka — 560041',
      blood: 'O+',
      emergency: 'Krishnan P (Father): +91 73456 89000',
      bank: 'Axis Bank — XXXX XXXX 8808',
      pan: 'HIJMK3456H',
      payroll: { basic: 38000, hra: 15200, transport: 1500, medical: 900, taxRate: 0.05, pfRate: 0.12, insuranceFlat: 600 }
    },

    // ─── HUMAN RESOURCES ─────────────────────────────────────
    {
      id: 'EMP-004',
      email: 'anita@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Anita',
      lastName: 'Pillai',
      designation: 'HR Executive',
      department: 'Human Resources',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2023-03-06',
      workLocation: 'Head Office — Mumbai',
      manager: 'Rajesh Sharma',
      phone: '+91 87654 32100',
      dob: '1999-05-18',
      gender: 'Female',
      address: '78, Powai Lake View, Hiranandani Gardens, Mumbai, Maharashtra — 400076',
      blood: 'AB+',
      emergency: 'Thomas Pillai (Father): +91 87654 32199',
      bank: 'Axis Bank — XXXX XXXX 4404',
      pan: 'DEFAP3456D',
      payroll: { basic: 40000, hra: 16000, transport: 1600, medical: 1000, taxRate: 0.05, pfRate: 0.12, insuranceFlat: 600 }
    },

    // ─── FINANCE & ACCOUNTS ──────────────────────────────────
    {
      id: 'EMP-009',
      email: 'rohan@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Rohan',
      lastName: 'Desai',
      designation: 'Accounts Manager',
      department: 'Finance & Accounts',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2020-11-02',
      workLocation: 'Head Office — Mumbai',
      manager: 'Rajesh Sharma',
      phone: '+91 96543 21098',
      dob: '1990-09-25',
      gender: 'Male',
      address: '22, Prabhadevi Samarth Nagar, Mumbai, Maharashtra — 400025',
      blood: 'B-',
      emergency: 'Neha Desai (Wife): +91 96543 21099',
      bank: 'HDFC Bank — XXXX XXXX 9909',
      pan: 'IJKRD4567I',
      payroll: { basic: 68000, hra: 27200, transport: 2800, medical: 1500, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 1100 }
    },
    {
      id: 'EMP-010',
      email: 'divya@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Divya',
      lastName: 'Kapoor',
      designation: 'Financial Analyst',
      department: 'Finance & Accounts',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2022-01-24',
      workLocation: 'Head Office — Mumbai',
      manager: 'Rohan Desai',
      phone: '+91 88765 43210',
      dob: '1996-07-07',
      gender: 'Female',
      address: 'B-204, Rustomjee Paramount, Dahisar East, Mumbai, Maharashtra — 400068',
      blood: 'A+',
      emergency: 'Vikas Kapoor (Brother): +91 88765 43211',
      bank: 'Yes Bank — XXXX XXXX 1010',
      pan: 'JKLDK5678J',
      payroll: { basic: 50000, hra: 20000, transport: 2200, medical: 1200, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 850 }
    },

    // ─── SALES & MARKETING ───────────────────────────────────
    {
      id: 'EMP-011',
      email: 'kavya@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Kavya',
      lastName: 'Reddy',
      designation: 'Marketing Manager',
      department: 'Sales & Marketing',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2020-06-15',
      workLocation: 'Hyderabad Office',
      manager: 'Rajesh Sharma',
      phone: '+91 97890 12345',
      dob: '1991-04-14',
      gender: 'Female',
      address: 'Plot 88, Jubilee Hills, Hyderabad, Telangana — 500033',
      blood: 'AB-',
      emergency: 'Sunil Reddy (Husband): +91 97890 12346',
      bank: 'SBI — XXXX XXXX 1111',
      pan: 'KLMKR6789K',
      payroll: { basic: 75000, hra: 30000, transport: 3200, medical: 1800, taxRate: 0.1, pfRate: 0.12, insuranceFlat: 1200 }
    },
    {
      id: 'EMP-012',
      email: 'aditya@techvision.in',
      password: 'Employee@123',
      role: 'employee',
      firstName: 'Aditya',
      lastName: 'Joshi',
      designation: 'Business Development Executive',
      department: 'Sales & Marketing',
      status: 'Active',
      employmentType: 'Full-time',
      dateOfJoining: '2024-02-19',
      workLocation: 'Pune Office',
      manager: 'Kavya Reddy',
      phone: '+91 76543 21987',
      dob: '2001-08-22',
      gender: 'Male',
      address: '11, Baner Road, Aundh, Pune, Maharashtra — 411007',
      blood: 'O+',
      emergency: 'Sunanda Joshi (Mother): +91 76543 21900',
      bank: 'Kotak Mahindra Bank — XXXX XXXX 1212',
      pan: 'LMNAJ7890L',
      payroll: { basic: 32000, hra: 12800, transport: 1400, medical: 800, taxRate: 0.05, pfRate: 0.12, insuranceFlat: 500 }
    }
  ],

  attendance: generateSeedAttendance(),
  leaves: generateSeedLeaves(),
  leaveQuotas: generateSeedLeaveQuotas()
};

// ============================================================
// SEED GENERATORS
// ============================================================
function generateSeedAttendance() {
  const records = [];
  const empIds = [
    'EMP-001','EMP-002','EMP-003','EMP-004',
    'EMP-005','EMP-006','EMP-007','EMP-008',
    'EMP-009','EMP-010','EMP-011','EMP-012'
  ];
  const today = new Date();

  // Per-employee attendance patterns for realism
  const attProfiles = {
    'EMP-001': { presentRate: 0.97, lateRate: 0.05 },  // Admin — rarely absent
    'EMP-002': { presentRate: 0.92, lateRate: 0.10 },
    'EMP-003': { presentRate: 0.88, lateRate: 0.08 },
    'EMP-004': { presentRate: 0.94, lateRate: 0.06 },
    'EMP-005': { presentRate: 0.95, lateRate: 0.05 },
    'EMP-006': { presentRate: 0.90, lateRate: 0.12 },
    'EMP-007': { presentRate: 0.93, lateRate: 0.07 },
    'EMP-008': { presentRate: 0.89, lateRate: 0.15 },
    'EMP-009': { presentRate: 0.96, lateRate: 0.04 },
    'EMP-010': { presentRate: 0.91, lateRate: 0.09 },
    'EMP-011': { presentRate: 0.87, lateRate: 0.10 },  // Sales travels a lot
    'EMP-012': { presentRate: 0.85, lateRate: 0.20 },  // New joiner
  };

  empIds.forEach(empId => {
    const profile = attProfiles[empId] || { presentRate: 0.9, lateRate: 0.1 };

    for (let i = 60; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayOfWeek = date.getDay();
      const dateStr   = toDateString(date);

      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

      const rand = Math.random();
      if (rand > profile.presentRate) continue; // Absent

      // Check-in time: 8:30–10:30 AM (late comers skew later)
      const isLate  = Math.random() < profile.lateRate;
      const inHour  = isLate ? 10 : 8 + Math.floor(Math.random() * 2);
      const inMin   = Math.floor(Math.random() * 60);
      const outHour = 17 + Math.floor(Math.random() * 3); // 5 PM – 7 PM
      const outMin  = Math.floor(Math.random() * 60);

      const checkIn  = `${padZ(inHour)}:${padZ(inMin)}`;
      const checkOut = `${padZ(outHour)}:${padZ(outMin)}`;
      const durMins  = (outHour * 60 + outMin) - (inHour * 60 + inMin);
      const status   = durMins < 240 ? 'Half-Day' : 'Present';

      records.push({
        id:       `att-${empId}-${dateStr}`,
        empId,
        date:     dateStr,
        checkIn,
        checkOut,
        duration: minsToHM(Math.max(0, durMins)),
        status
      });
    }
  });

  return records;
}

function generateSeedLeaves() {
  const today      = new Date();
  const futureDate = days => { const d = new Date(today); d.setDate(d.getDate() + days); return toDateString(d); };
  const pastDate   = days => { const d = new Date(today); d.setDate(d.getDate() - days); return toDateString(d); };

  return [
    // ─── Approved (past) ──────────────────────────────────
    {
      id: 'LV-001', empId: 'EMP-002', type: 'Sick',
      from: pastDate(20), to: pastDate(18), days: 3,
      reason: 'Viral fever and throat infection. Doctor advised rest.',
      status: 'Approved', appliedOn: pastDate(21),
      adminComment: 'Take care. Approved.', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(20)
    },
    {
      id: 'LV-002', empId: 'EMP-003', type: 'Paid',
      from: pastDate(30), to: pastDate(29), days: 2,
      reason: "Brother's wedding ceremony in Agra — Anand Karaj ceremony.",
      status: 'Approved', appliedOn: pastDate(35),
      adminComment: 'Approved. Enjoy the celebrations!', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(32)
    },
    {
      id: 'LV-003', empId: 'EMP-005', type: 'Paid',
      from: pastDate(15), to: pastDate(12), days: 4,
      reason: 'Annual family vacation to Manali — pre-planned and approved by team.',
      status: 'Approved', appliedOn: pastDate(25),
      adminComment: 'Approved. Have a great trip!', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(22)
    },
    {
      id: 'LV-004', empId: 'EMP-009', type: 'Sick',
      from: pastDate(10), to: pastDate(9), days: 2,
      reason: 'Food poisoning after office event. Hospital certificate attached.',
      status: 'Approved', appliedOn: pastDate(10),
      adminComment: 'Wishing you a speedy recovery. Approved.', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(10)
    },
    {
      id: 'LV-005', empId: 'EMP-011', type: 'Paid',
      from: pastDate(8), to: pastDate(7), days: 2,
      reason: 'Attending cousin\'s engagement function in Vijayawada.',
      status: 'Approved', appliedOn: pastDate(12),
      adminComment: 'Approved.', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(11)
    },
    {
      id: 'LV-006', empId: 'EMP-007', type: 'Paid',
      from: pastDate(5), to: pastDate(3), days: 3,
      reason: 'Home renovation — plumbing and electrical work scheduled.',
      status: 'Approved', appliedOn: pastDate(10),
      adminComment: 'Approved.', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(8)
    },
    {
      id: 'LV-007', empId: 'EMP-010', type: 'Sick',
      from: pastDate(4), to: pastDate(3), days: 2,
      reason: 'Severe migraine. Physician advised two days of bed rest.',
      status: 'Approved', appliedOn: pastDate(4),
      adminComment: 'Approved. Rest well.', reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(4)
    },

    // ─── Rejected ──────────────────────────────────────────
    {
      id: 'LV-008', empId: 'EMP-004', type: 'Unpaid',
      from: pastDate(5), to: pastDate(4), days: 2,
      reason: 'Personal work — bank documentation and Aadhaar update.',
      status: 'Rejected', appliedOn: pastDate(7),
      adminComment: 'Short notice. Please apply at least 3 working days in advance.',
      reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(5)
    },
    {
      id: 'LV-009', empId: 'EMP-012', type: 'Paid',
      from: pastDate(3), to: pastDate(2), days: 2,
      reason: 'Going home to Nashik for a festival.',
      status: 'Rejected', appliedOn: pastDate(3),
      adminComment: 'Cannot approve on such short notice during quarter-end.',
      reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(3)
    },
    {
      id: 'LV-010', empId: 'EMP-008', type: 'Unpaid',
      from: pastDate(6), to: pastDate(6), days: 1,
      reason: 'Had to accompany parent for a hospital check-up.',
      status: 'Rejected', appliedOn: pastDate(6),
      adminComment: 'Please use sick leave for medical-related reasons next time.',
      reviewedBy: 'Rajesh Sharma', reviewedOn: pastDate(6)
    },

    // ─── Pending ───────────────────────────────────────────
    {
      id: 'LV-011', empId: 'EMP-002', type: 'Paid',
      from: futureDate(5), to: futureDate(7), days: 3,
      reason: 'Family trip to Goa — annual vacation planned with spouse.',
      status: 'Pending', appliedOn: toDateString(today),
      adminComment: '', reviewedBy: '', reviewedOn: ''
    },
    {
      id: 'LV-012', empId: 'EMP-003', type: 'Sick',
      from: toDateString(today), to: toDateString(today), days: 1,
      reason: 'Severe headache and fever since morning. Unable to work from home.',
      status: 'Pending', appliedOn: toDateString(today),
      adminComment: '', reviewedBy: '', reviewedOn: ''
    },
    {
      id: 'LV-013', empId: 'EMP-006', type: 'Paid',
      from: futureDate(3), to: futureDate(5), days: 3,
      reason: 'Attending elder sister\'s marriage in Madurai. Tickets already booked.',
      status: 'Pending', appliedOn: toDateString(today),
      adminComment: '', reviewedBy: '', reviewedOn: ''
    },
    {
      id: 'LV-014', empId: 'EMP-010', type: 'Paid',
      from: futureDate(10), to: futureDate(14), days: 5,
      reason: 'Pre-planned honeymoon trip to Kerala — booked well in advance.',
      status: 'Pending', appliedOn: toDateString(today),
      adminComment: '', reviewedBy: '', reviewedOn: ''
    },
    {
      id: 'LV-015', empId: 'EMP-012', type: 'Sick',
      from: pastDate(1), to: toDateString(today), days: 2,
      reason: 'Stomach bug — visited local clinic, prescribed 2 days rest.',
      status: 'Pending', appliedOn: pastDate(1),
      adminComment: '', reviewedBy: '', reviewedOn: ''
    }
  ];
}

function generateSeedLeaveQuotas() {
  return {
    'EMP-001': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
    'EMP-002': { paid: { total: 18, used: 3  }, sick: { total: 12, used: 3  }, unpaid: { total: 6, used: 0 } },
    'EMP-003': { paid: { total: 18, used: 2  }, sick: { total: 12, used: 1  }, unpaid: { total: 6, used: 0 } },
    'EMP-004': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 2 } },
    'EMP-005': { paid: { total: 18, used: 4  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
    'EMP-006': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
    'EMP-007': { paid: { total: 18, used: 3  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
    'EMP-008': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 1 } },
    'EMP-009': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 2  }, unpaid: { total: 6, used: 0 } },
    'EMP-010': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 2  }, unpaid: { total: 6, used: 0 } },
    'EMP-011': { paid: { total: 18, used: 2  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
    'EMP-012': { paid: { total: 18, used: 0  }, sick: { total: 12, used: 0  }, unpaid: { total: 6, used: 0 } },
  };
}

// ============================================================
// STATE MANAGEMENT
// ============================================================
const State = {
  get() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  set(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
    catch (e) { console.error('State save error:', e); }
  },

  init() {
    const existing      = this.get();
    const storedVersion = localStorage.getItem(STORAGE_KEY + '_version');

    // Force re-seed when data version changes
    if (!existing || !existing.users || storedVersion !== DATA_VERSION) {
      this.set(JSON.parse(JSON.stringify(SEED_DATA)));
      localStorage.setItem(STORAGE_KEY + '_version', DATA_VERSION);
      console.log('[HRMS] Seeded Indian data — v3 (12 employees).');
    } else {
      const current = existing;
      if (!current.leaveQuotas) current.leaveQuotas = SEED_DATA.leaveQuotas;
      this.set(current);
    }
  },

  // ── Users ─────────────────────────────────────────────────
  getUsers()            { return this.get()?.users || []; },
  getUserById(id)       { return this.getUsers().find(u => u.id === id) || null; },
  getUserByEmail(email) { return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null; },

  addUser(user) {
    const state = this.get(); state.users.push(user); this.set(state);
  },

  updateUser(id, updates) {
    const state = this.get();
    const idx = state.users.findIndex(u => u.id === id);
    if (idx !== -1) state.users[idx] = { ...state.users[idx], ...updates };
    this.set(state);
  },

  generateEmployeeId() {
    const nums = this.getUsers().map(u => parseInt(u.id.replace('EMP-', '')) || 0);
    return `EMP-${String(Math.max(...nums, 0) + 1).padStart(3, '0')}`;
  },

  // ── Attendance ────────────────────────────────────────────
  getAttendance()            { return this.get()?.attendance || []; },
  getAttendanceByEmp(empId)  { return this.getAttendance().filter(a => a.empId === empId); },

  getTodayAttendance(empId) {
    const today = toDateString(new Date());
    return this.getAttendance().find(a => a.empId === empId && a.date === today) || null;
  },

  upsertAttendance(record) {
    const state = this.get();
    const idx = state.attendance.findIndex(a => a.id === record.id);
    if (idx !== -1) state.attendance[idx] = record;
    else state.attendance.push(record);
    this.set(state);
  },

  // ── Leaves ────────────────────────────────────────────────
  getLeaves()            { return this.get()?.leaves || []; },
  getLeavesByEmp(empId)  { return this.getLeaves().filter(l => l.empId === empId); },
  getLeaveById(id)       { return this.getLeaves().find(l => l.id === id) || null; },
  getPendingLeaves()     { return this.getLeaves().filter(l => l.status === 'Pending'); },

  addLeave(leave) {
    const state = this.get();
    leave.id = 'LV-' + String(state.leaves.length + 1).padStart(3, '0') + '-' + Date.now();
    state.leaves.push(leave);
    this.set(state);
    return leave;
  },

  updateLeave(id, updates) {
    const state = this.get();
    const idx = state.leaves.findIndex(l => l.id === id);
    if (idx !== -1) state.leaves[idx] = { ...state.leaves[idx], ...updates };
    this.set(state);
  },

  removeLeave(id) {
    const state = this.get();
    state.leaves = state.leaves.filter(l => l.id !== id);
    this.set(state);
  },

  // ── Leave Quotas ──────────────────────────────────────────
  getLeaveQuota(empId) {
    return this.get()?.leaveQuotas?.[empId] || {
      paid:   { total: 18, used: 0 },
      sick:   { total: 12, used: 0 },
      unpaid: { total: 6,  used: 0 }
    };
  },

  updateLeaveQuota(empId, type, usedDelta) {
    const state = this.get();
    if (!state.leaveQuotas) state.leaveQuotas = {};
    if (!state.leaveQuotas[empId]) {
      state.leaveQuotas[empId] = {
        paid:   { total: 18, used: 0 },
        sick:   { total: 12, used: 0 },
        unpaid: { total: 6,  used: 0 }
      };
    }
    const key = type.toLowerCase();
    if (state.leaveQuotas[empId][key]) {
      state.leaveQuotas[empId][key].used =
        Math.max(0, state.leaveQuotas[empId][key].used + usedDelta);
    }
    this.set(state);
  },

  // ── Payroll ───────────────────────────────────────────────
  /**
   * Indian payroll calculation:
   *   Gross = Basic + HRA + Conveyance + Medical
   *   TDS   = Basic × taxRate   (simplified TDS on basic)
   *   EPF   = Basic × 12%       (employee EPF contribution)
   *   ESIC  = flat insurance amount
   *   Net   = Gross − TDS − EPF − ESIC
   */
  calcPayroll(payroll) {
    const { basic, hra, transport, medical, taxRate, pfRate, insuranceFlat } = payroll;
    const gross           = basic + hra + transport + medical;
    const tax             = Math.round(basic * (taxRate || 0));
    const pf              = Math.round(basic * (pfRate  || 0.12));
    const insurance       = insuranceFlat || 0;
    const totalDeductions = tax + pf + insurance;
    const net             = gross - totalDeductions;
    return { gross, tax, pf, insurance, totalDeductions, net };
  },

  updatePayroll(empId, payrollUpdates) {
    const state = this.get();
    const idx = state.users.findIndex(u => u.id === empId);
    if (idx !== -1) state.users[idx].payroll = { ...state.users[idx].payroll, ...payrollUpdates };
    this.set(state);
  },

  // ── Session ───────────────────────────────────────────────
  getSession() {
    try { const s = sessionStorage.getItem('hrms_session'); return s ? JSON.parse(s) : null; }
    catch { return null; }
  },
  setSession(user)  { sessionStorage.setItem('hrms_session', JSON.stringify(user)); },
  clearSession()    { sessionStorage.removeItem('hrms_session'); }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function toDateString(date) {
  return `${date.getFullYear()}-${padZ(date.getMonth() + 1)}-${padZ(date.getDate())}`;
}

function padZ(n) { return String(n).padStart(2, '0'); }

function minsToHM(mins) {
  return `${Math.floor(mins / 60)}h ${padZ(mins % 60)}m`;
}

function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '--';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...opts });
}

function formatDateShort(dateStr) {
  return formatDate(dateStr, { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysBetween(from, to) {
  if (!from || !to) return 0;
  const d1 = new Date(from + 'T00:00:00');
  const d2 = new Date(to   + 'T00:00:00');
  let count = 0;
  const cur = new Date(d1);
  while (cur <= d2) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function getInitials(firstName, lastName) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

/** Indian Rupee format — uses en-IN locale (1,85,000 style) */
function formatCurrency(amount) {
  return '₹' + (Number(amount) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function formatTime12(timeStr) {
  if (!timeStr || timeStr === '--:--') return '--:--';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12  = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${padZ(m)} ${ampm}`;
}

function getDayName(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
}

function getLeaveTypeBadgeClass(type) {
  switch ((type || '').toLowerCase()) {
    case 'paid':   return 'badge-approved';
    case 'sick':   return 'badge-leave';
    case 'unpaid': return 'badge-absent';
    default:       return 'badge-leave';
  }
}

function getStatusBadgeClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'approved':  return 'badge-approved';
    case 'rejected':  return 'badge-rejected';
    case 'pending':   return 'badge-pending';
    case 'present':   return 'badge-present';
    case 'absent':    return 'badge-absent';
    case 'half-day':  return 'badge-half';
    case 'on leave':  return 'badge-leave';
    case 'active':    return 'badge-active';
    case 'inactive':  return 'badge-inactive';
    default:          return 'badge-active';
  }
}

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ── Global Exports ─────────────────────────────────────────
window.State             = State;
window.toDateString      = toDateString;
window.padZ              = padZ;
window.minsToHM          = minsToHM;
window.formatDate        = formatDate;
window.formatDateShort   = formatDateShort;
window.daysBetween       = daysBetween;
window.getInitials       = getInitials;
window.formatCurrency    = formatCurrency;
window.formatTime12      = formatTime12;
window.getDayName        = getDayName;
window.getLeaveTypeBadgeClass = getLeaveTypeBadgeClass;
window.getStatusBadgeClass    = getStatusBadgeClass;
window.generateOTP       = generateOTP;

// Init on load
State.init();
