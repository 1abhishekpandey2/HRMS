import React, { useState, useEffect } from 'react';
import './style.css';
import * as Data from './views/DashboardData';
import { icons } from './views/Icons';
// Import View Components
import DashboardView from './views/DashboardView';
import EmployeesView from './views/EmployeesView';
import DepartmentsView from './views/DepartmentsView';
import AttendanceView from './views/AttendanceView';
import LeaveView from './views/LeaveView';
import AttendanceDetailModal from './views/AttendanceDetailModal';
import { getCurrentUser, getHRUser } from '../../services/auth';
import { approveLeaveRequest, rejectLeaveRequest, getStats as fetchStats } from '../../services/hr'; // NEW IMPORT

const HRDashboard = () => {
  // ============================================
  // UI STATE MANAGEMENT
  // ============================================
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEmployeeDetail, setShowEmployeeDetail] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ============================================
  // DATA STATE MANAGEMENT
  // ============================================
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);

  // Current logged-in user (fetched from backend)
  const [currentUser, setCurrentUser] = useState(Data.currentUser);
  // HR user (fetched from users table where role = 'hr')
  const [hrUser, setHrUser] = useState(null);

  // Track which leave request is being updated to disable buttons while processing
  const [processingLeaveId, setProcessingLeaveId] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        if (res && res.user) setCurrentUser(res.user);
      })
      .catch(err => {
        console.error('Failed to fetch current user', err);
      });

    // Fetch the HR user and update UI (replace any sample 'Sarah Johnson' employee name)
    getHRUser()
      .then(res => {
        if (res && res.user) {
          setHrUser(res.user);
        }
      })
      .catch(err => {
        console.error('Failed to fetch hr user', err);
      });

    // Fetch dynamic HR data
    import('../../services/hr').then(module => {
      module.getEmployees().then(resp => setEmployees(resp.employees || [])).catch(console.error);
      module.getLeaveRequests().then(resp => setLeaveRequests(resp.leaveRequests || [])).catch(console.error);
      module.getDepartments().then(resp => setDepartments(resp.departments || [])).catch(console.error);
      module.getAttendance().then(resp => setAttendance(resp.attendance || [])).catch(console.error);
      module.getStats().then(resp => setStats(resp)).catch(console.error);
    }).catch(err => console.error('Failed to load HR services', err));

  }, []);

  // ============================================
  // ATTENDANCE MODAL STATE
  // ============================================
  const [selectedAttendanceEmployee, setSelectedAttendanceEmployee] = useState(null);
  const [showAttendanceDetail, setShowAttendanceDetail] = useState(false);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  // Replace local-only handler with an async, backend-updating version
  const handleLeaveAction = async (id, action) => {
    // action expected to be 'approved' or 'rejected' (case-insensitive)
    try {
      setProcessingLeaveId(id);
      // normalize action for case-insensitive callers
      const normalized = String(action).toLowerCase();
      // call the appropriate service and capture server response
      const result = (normalized === 'approved') ? await approveLeaveRequest(id) : await rejectLeaveRequest(id);

      // use server response where available to find affected employee
      const employeePk = result?.leave?.employee_id || result?.leave?.employeeId || null;

      // update local UI after successful backend update (store normalized lowercase status)
      setLeaveRequests(prev => prev.map(req => (req.id === id ? { ...req, status: normalized } : req)));

      if (employeePk) {
        setEmployees(prev => prev.map(emp => {
          if (emp.pk !== employeePk) return emp;
          const newStatus = normalized === 'approved' ? 'on-leave' : (normalized === 'rejected' ? 'active' : emp.status);
          return { ...emp, status: newStatus };
        }));
      }

      // refresh stats to reflect counts (best-effort)
      try {
        const statsResp = await fetchStats();
        setStats(statsResp);
      } catch (e) { /* ignore stats refresh errors */ }

    } catch (err) {
      console.error('Failed to update leave request', err);
      alert('Failed to update leave request. Please try again.');
      // optionally refetch leave requests or revert optimistic UI
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetail(true);
  };

  const handleViewAttendanceDetail = (employee) => {
    setSelectedAttendanceEmployee(employee);
    setShowAttendanceDetail(true);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // ============================================
  // FILTERED DATA
  // ============================================
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================
  // NAVIGATION ITEMS
  // ============================================
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'employees', label: 'Employees', icon: icons.employees },
    { id: 'departments', label: 'Departments', icon: icons.departments },
    { id: 'attendance', label: 'Attendance', icon: icons.attendance },
    { id: 'leave', label: 'Leave Requests', icon: icons.leave },
    { id: 'payroll', label: 'Payroll', icon: icons.payroll },
    { id: 'recruitment', label: 'Recruitment', icon: icons.recruitment },
    { id: 'performance', label: 'Performance', icon: icons.performance },
    { id: 'reports', label: 'Reports', icon: icons.reports },
    { id: 'settings', label: 'Settings', icon: icons.settings }
  ];

  return (
    <div className={`hr-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="8" fill="#2563eb" />
                <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="white" />
              </svg>
            </div>
            <div className="org-info">
              <h1>Municipal HR</h1>
              <p>Government Services</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="profile-avatar">{Data.getInitials(hrUser?.name || currentUser?.name || Data.currentUser.name)}</div>
          <div className="profile-info">
            <div className="profile-name">{hrUser?.name || currentUser?.name || Data.currentUser.name}</div>
            <div className="profile-role">{hrUser?.role || currentUser?.role || Data.currentUser.role}</div>
          </div>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="main-content">
        {/* TOP NAVIGATION BAR */}
        <header className="topbar">
          <div className="search-container">
            <span className="search-icon">{icons.search}</span>
            <input
              type="text"
              placeholder="Search employees, IDs, departments..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-actions">
            {/* Dark Mode Toggle */}
            <button className="icon-btn" onClick={handleToggleDarkMode} title="Toggle Dark Mode">
              {isDarkMode ? icons.sun : icons.moon}
            </button>

            {/* Notifications */}
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              {icons.bell}
              {Data.notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">
                  {Data.notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Quick Add Button */}
            <button className="quick-add-btn" onClick={() => setShowAddEmployee(true)}>
              {icons.plus}
              <span>Quick Add</span>
            </button>

            {/* Profile Menu */}
            <div className="profile-menu">
              <button className="profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
                <div className="profile-avatar small">{Data.getInitials(hrUser?.name || currentUser?.name || Data.currentUser.name)}</div>
              </button>

              {showProfileDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <strong>{hrUser?.name || currentUser?.name || Data.currentUser.name}</strong>
                      <span>{hrUser?.role || currentUser?.role || Data.currentUser.role}</span>
                    </div>
                  </div>
                  <button className="dropdown-item">View Profile</button>
                  <button className="dropdown-item">Upload Photo</button>
                  <button className="dropdown-item">Account Settings</button>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item danger"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      setShowLogoutConfirm(true);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ============================================ */}
        {/* VIEW ROUTER */}
        {/* ============================================ */}
        <div className="content-area">
          {/* Dashboard View */}
          {activeSection === 'dashboard' && (
            <DashboardView
              employees={employees}
              leaveRequests={leaveRequests}
              stats={stats}
              attendance={attendance}
              departments={departments}
              handleViewEmployee={handleViewEmployee}
              handleLeaveAction={handleLeaveAction}
              processingLeaveId={processingLeaveId} // NEW PROP
              setActiveSection={setActiveSection}
              currentUser={currentUser}
              hrUser={hrUser}
            />
          )}

          {/* Employees View */}
          {activeSection === 'employees' && (
            <EmployeesView
              filteredEmployees={filteredEmployees}
              handleViewEmployee={handleViewEmployee}
              setShowAddEmployee={setShowAddEmployee}
            />
          )}

          {/* Departments View */}
          {activeSection === 'departments' && (
            <DepartmentsView departments={departments} />
          )}

          {/* Attendance View */}
          {activeSection === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              departments={departments}
              handleViewAttendanceDetail={handleViewAttendanceDetail}
            />
          )}

          {/* Leave View */}
          {activeSection === 'leave' && (
            <LeaveView
              leaveRequests={leaveRequests}
              handleLeaveAction={handleLeaveAction}
              processingLeaveId={processingLeaveId} // NEW PROP
            />
          )}

          {/* Fallback for Under Development Sections */}
          {['payroll', 'recruitment', 'performance', 'reports', 'settings'].includes(activeSection) && (
            <div className="section-content">
              <div className="under-development">
                <div className="construction-icon">🚧</div>
                <h2>{navItems.find(n => n.id === activeSection)?.label}</h2>
                <p className="section-description">
                  This section is currently under development. Check back soon for updates!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================ */}
      {/* GLOBAL MODALS */}
      {/* ============================================ */}

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          <div className="modal-overlay" onClick={() => setShowNotifications(false)}></div>
          <div className="notifications-panel">
            <div className="panel-header">
              <h3>Notifications</h3>
              <button className="close-btn" onClick={() => setShowNotifications(false)}>
                {icons.x}
              </button>
            </div>
            <div className="notifications-list">
              {Data.notifications.map(notif => (
                <div key={notif.id} className={`notification-item ${notif.read ? 'read' : ''}`}>
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-time">{notif.time}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <>
          <div className="modal-overlay" onClick={() => setShowAddEmployee(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Employee</h3>
              <button className="close-btn" onClick={() => setShowAddEmployee(false)}>
                {icons.x}
              </button>
            </div>
            <div className="modal-body">
              <p>Employee form will be implemented here...</p>
            </div>
          </div>
        </>
      )}

      {/* Employee Detail Modal - UPDATED */}
      {showEmployeeDetail && selectedEmployee && (
        <>
          <div className="modal-overlay" onClick={() => setShowEmployeeDetail(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>Employee Details</h3>
              <button className="close-btn" onClick={() => setShowEmployeeDetail(false)}>{icons.x}</button>
            </div>
            <div className="modal-body">
              <div className="employee-detail">
                <div className="employee-avatar large">{Data.getInitials(selectedEmployee.name)}</div>
                <h4>{selectedEmployee.name}</h4>
                <span className={`status-badge ${selectedEmployee.status?.toLowerCase().replace(' ', '-') || 'active'}`}>
                  {selectedEmployee.status}
                </span>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Employee ID</label>
                    <div>{selectedEmployee.id}</div>
                  </div>
                  <div className="detail-item">
                    <label>Department</label>
                    <div>{selectedEmployee.department}</div>
                  </div>
                  <div className="detail-item">
                    <label>Role</label>
                    <div>{selectedEmployee.role || 'Employee'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <div>{selectedEmployee.email || `${selectedEmployee.name.toLowerCase().replace(' ', '.')}@municipal.gov`}</div>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <div>{selectedEmployee.phone || '+1 (555) 123-4567'}</div>
                  </div>
                  <div className="detail-item">
                    <label>Joined Date</label>
                    <div>{selectedEmployee.joinedDate || 'Jan 15, 2024'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowEmployeeDetail(false)}>Close</button>
              <button className="primary-btn">Edit Employee</button>
            </div>
          </div>
        </>
      )}

      {/* Attendance Detail Modal */}
      {showAttendanceDetail && selectedAttendanceEmployee && (
        <AttendanceDetailModal
          employee={selectedAttendanceEmployee}
          isOpen={showAttendanceDetail}
          onClose={() => setShowAttendanceDetail(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="modal small">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to logout from the HR Management System?</p>
            </div>
            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowLogoutConfirm(false)}>
                Cancel
              </button>
              <button className="danger-btn" onClick={() => alert('Logged out successfully')}>
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HRDashboard;