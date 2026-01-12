// DashboardData.js

// --- USER DATA ---

export const currentUser = {
  name: '',
  role: 'HR Manager',
  avatar: null
};


// Current logged-in user

// --- ICONS (SVG) ---
// We export these as simple objects or functions to keep JSX clean
export const icons = {
  dashboard: 'dashboard', // Mapped in UI or passed as strings if using an icon library
  // For this refactor, we will keep SVGs in the View or a separate Icons.js 
  // to avoid JSX in .js files if you aren't using a transpiler that supports it easily.
  // However, since we are in React, we can return JSX here if permitted, 
  // but standard practice for "Data" files is raw data. 
  // *Decision*: I will keep raw data here. Icons remain in JSX for now 
  // to ensure your build process doesn't break, 
  // or we can move them to a separate component.
};

// --- EMPLOYEES ---
export const initialEmployees = [
  { id: 'EMP001', name: 'John Anderson', department: 'Public Works', status: 'Active', position: 'Engineer', email: 'j.anderson@municipal.gov', phone: '555-0101' },
  { id: 'EMP002', name: 'Maria Garcia', department: 'Finance', status: 'Active', position: 'Accountant', email: 'm.garcia@municipal.gov', phone: '555-0102' },
  { id: 'EMP003', name: 'David Chen', department: 'Administration', status: 'On Leave', position: 'Clerk', email: 'd.chen@municipal.gov', phone: '555-0103' },
  { id: 'EMP004', name: 'Emily Brown', department: 'Health Services', status: 'Active', position: 'Nurse', email: 'e.brown@municipal.gov', phone: '555-0104' },
  { id: 'EMP005', name: 'Michael Wilson', department: 'Parks & Recreation', status: 'Active', position: 'Supervisor', email: 'm.wilson@municipal.gov', phone: '555-0105' },
];

// --- LEAVE REQUESTS ---
export const initialLeaveRequests = [];

// --- DEPARTMENTS ---
export const departments = [
  { name: 'Public Works', employees: 45, color: '#2563eb' },
  { name: 'Finance', employees: 32, color: '#059669' },
  { name: 'Administration', employees: 38, color: '#d97706' },
  { name: 'Health Services', employees: 52, color: '#dc2626' },
  { name: 'Parks & Recreation', employees: 28, color: '#7c3aed' },
  { name: 'Education', employees: 34, color: '#0891b2' },
  { name: 'Public Safety', employees: 12, color: '#ea580c' },
  { name: 'Community Development', employees: 6, color: '#4f46e5' }
];

// --- ATTENDANCE RECORDS ---
export const attendanceEmployees = [
  { id: 'EMP001', name: 'John Anderson', department: 'Public Works', shift: 'Morning', status: 'present', checkIn: '08:45 AM', totalLeaves: 8, lateArrivals: 2, earlyLeaves: 1 },
  { id: 'EMP002', name: 'Maria Garcia', department: 'Finance', shift: 'Morning', status: 'present', checkIn: '09:00 AM', totalLeaves: 4, lateArrivals: 0, earlyLeaves: 0 },
  { id: 'EMP003', name: 'David Chen', department: 'Administration', shift: 'Morning', status: 'on-leave', checkIn: '-', totalLeaves: 12, lateArrivals: 5, earlyLeaves: 3 },
  { id: 'EMP004', name: 'Emily Brown', department: 'Health Services', shift: 'Afternoon', status: 'present', checkIn: '01:15 PM', totalLeaves: 3, lateArrivals: 1, earlyLeaves: 0 },
  { id: 'EMP005', name: 'Michael Wilson', department: 'Parks & Recreation', shift: 'Morning', status: 'late', checkIn: '09:30 AM', totalLeaves: 10, lateArrivals: 8, earlyLeaves: 4 },
  { id: 'EMP006', name: 'Lisa Martinez', department: 'Finance', shift: 'Morning', status: 'absent', checkIn: '-', totalLeaves: 15, lateArrivals: 6, earlyLeaves: 5 },
  { id: 'EMP007', name: 'Robert Taylor', department: 'Education', shift: 'Afternoon', status: 'present', checkIn: '01:00 PM', totalLeaves: 5, lateArrivals: 1, earlyLeaves: 1 },
  { id: 'EMP008', name: 'HR Representative', department: 'Public Works', shift: 'Morning', status: 'present', checkIn: '08:30 AM', totalLeaves: 2, lateArrivals: 0, earlyLeaves: 0 },
  { id: 'EMP009', name: 'James Lee', department: 'Health Services', shift: 'Night', status: 'present', checkIn: '10:00 PM', totalLeaves: 6, lateArrivals: 3, earlyLeaves: 2 },
  { id: 'EMP010', name: 'Jennifer White', department: 'Administration', shift: 'Morning', status: 'present', checkIn: '08:50 AM', totalLeaves: 7, lateArrivals: 2, earlyLeaves: 1 },
];

export const departmentAttendanceStats = [
  { rank: 1, department: 'Finance', present: 30, total: 32, percentage: 93.8, trend: 2 },
  { rank: 2, department: 'Health Services', present: 48, total: 52, percentage: 92.3, trend: 1 },
  { rank: 3, department: 'Public Works', present: 41, total: 45, percentage: 91.1, trend: -1 },
  { rank: 4, department: 'Education', present: 30, total: 34, percentage: 88.2, trend: 0 },
  { rank: 5, department: 'Administration', present: 33, total: 38, percentage: 86.8, trend: -2 },
  { rank: 6, department: 'Parks & Recreation', present: 24, total: 28, percentage: 85.7, trend: 1 },
  { rank: 7, department: 'Public Safety', present: 10, total: 12, percentage: 83.3, trend: -1 },
  { rank: 8, department: 'Community Development', present: 5, total: 6, percentage: 83.3, trend: 0 },
];

export const notifications = [
  { id: 1, message: 'New leave request from David Chen', time: '10 minutes ago', read: false },
  { id: 2, message: 'Payroll processing completed for December', time: '2 hours ago', read: false },
  { id: 3, message: 'Performance review cycle starting next week', time: '1 day ago', read: true },
  { id: 4, message: '5 new job applications received', time: '2 days ago', read: true },
];

export const stats = {
  totalEmployees: { value: 247, trend: 5, label: 'Total Employees' },
  presentToday: { value: 231, trend: 2, label: 'Present Today' },
  onLeave: { value: 12, trend: -3, label: 'On Leave' },
  departments: { value: 8, trend: 0, label: 'Departments' }
};

// --- HELPER FUNCTIONS ---

export const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const calculatePieSegments = (depts) => {
  const total = depts.reduce((sum, d) => sum + d.employees, 0);
  let currentAngle = -90;
  return depts.map(dept => {
    const percentage = (dept.employees / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    return { ...dept, percentage, startAngle, endAngle };
  });
};

export const generateEmployeeCalendar = (employee) => {
  const calendar = [];
  const today = new Date();
  for (let month = 2; month >= 0; month--) {
    const currentDate = new Date(today.getFullYear(), today.getMonth() - month, 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const monthData = {
      month: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
      days: []
    };
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayOfWeek = date.getDay();
      let status = 'present';
      if (dayOfWeek === 0 || dayOfWeek === 6) status = 'weekend';
      else if (Math.random() < employee.totalLeaves / 200) status = 'leave';
      else if (Math.random() < employee.lateArrivals / 150) status = 'late';
      else if (Math.random() < employee.earlyLeaves / 200) status = 'early-leave';
      monthData.days.push({ day, status });
    }
    calendar.push(monthData);
  }
  return calendar;
};

export const generateAttendanceTrend = (employee) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  return months.map(month => ({
    month,
    leaves: Math.floor(Math.random() * 4),
    lateArrivals: Math.floor(Math.random() * 3),
    earlyLeaves: Math.floor(Math.random() * 2),
  }));
};

// ... (Keep existing imports and exports)

// --- NEW: AI INSIGHTS DATA ---
export const aiInsights = [
  { id: 1, type: 'warning', text: "Finance Dept attendance dropped 15% today vs last Monday." },
  { id: 2, type: 'tip', text: "5 employees are approaching their leave quota. Send reminders?" },
  { id: 3, type: 'prediction', text: "Rainy forecast tomorrow: Expect 12% increase in late arrivals." },
  { id: 4, type: 'success', text: "Public Works has achieved a 7-day perfect attendance streak! ðŸ†" }
];

// --- NEW: RADAR CHART DATA ---
// We compare departments on 4 axes: Attendance, Punctuality, Task Completion, Satisfaction
export const radarData = {
  labels: ['Attendance', 'Punctuality', 'Tasks', 'Satisfaction'],
  departments: [
    { name: 'Finance', values: [95, 90, 85, 88], color: '#059669' },
    { name: 'Engineering', values: [80, 75, 95, 90], color: '#2563eb' }
  ]
};

// --- NEW: REAL-TIME ACTIVITY FEED GENERATOR ---
const activities = [
  "checked in at", "submitted leave request", "completed training", "updated profile", "marked task as done"
];
const names = ["John Anderson", "Maria Garcia", "David Chen", "Emily Brown", "Michael Wilson", "Lisa Martinez"];

export const getRandomActivity = () => {
  const name = names[Math.floor(Math.random() * names.length)];
  const activity = activities[Math.floor(Math.random() * activities.length)];
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return {
    id: Date.now(),
    text: `${name} ${activity} ${time}`,
    type: activity.includes("leave") ? "alert" : "neutral",
    time: "Just now"
  };
};

// --- NEW: RADAR CHART MATH HELPER --- 
export const getRadarCoordinates = (values, maxVal = 100, center = 100, radius = 80) => {
  const angleSlice = (Math.PI * 2) / values.length;
  const points = values.map((val, i) => {
    const angle = i * angleSlice - Math.PI / 2; // Start from top
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');
  return points;
};

