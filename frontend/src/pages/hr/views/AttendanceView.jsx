import React, { useState, useMemo } from 'react';
import * as Data from './DashboardData';
import { icons } from './Icons';

const AttendanceView = ({ handleViewAttendanceDetail, attendance = [], departments = [] }) => {
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const [attendanceSort, setAttendanceSort] = useState('department');
  const todayStr = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  // Source data - fallback to static if API didn't return anything yet
  const source = attendance && attendance.length ? attendance : Data.attendanceEmployees;

  // Filter and sort employees
  const filteredEmployees = useMemo(() => source.filter(emp => {
    if (attendanceFilter === 'all') return true;
    if (attendanceFilter === 'absent') return emp.status === 'absent';
    if (attendanceFilter === 'on-leave') return emp.status === 'on-leave';
    if (attendanceFilter === 'late') return emp.status === 'late';
    if (attendanceFilter === 'present') return emp.status === 'present';
    if (attendanceFilter === 'morning') return emp.shift === 'Morning';
    if (attendanceFilter === 'afternoon') return emp.shift === 'Afternoon';
    if (attendanceFilter === 'night') return emp.shift === 'Night';
    return emp.department === attendanceFilter;
  }).sort((a, b) => {
    if (attendanceSort === 'department') return (a.department || '').localeCompare(b.department || '');
    if (attendanceSort === 'name') return (a.name || '').localeCompare(b.name || '');
    if (attendanceSort === 'leaves') return (b.totalLeaves || 0) - (a.totalLeaves || 0);
    return 0;
  }), [source, attendanceFilter, attendanceSort]);

  const employeeLeaderboard = useMemo(() => {
    return [...source]
      .sort((a, b) => (a.totalLeaves || 0) - (b.totalLeaves || 0))
      .slice(0, 5);
  }, [source]);

  // Department rankings - derive from departments prop or fallback
  const departmentStats = departments && departments.length ? departments.map((d, i) => ({
    rank: i + 1,
    department: d.name,
    present: d.employees || 0,
    total: d.employees || 0,
    percentage: d.employees || 0,
    trend: 0
  })) : Data.departmentAttendanceStats;

  return (
    <div className="attendance-view">
      {/* Header */}
      
      <div className="section-header-main">
        <div>
          <h2>Attendance Management</h2>
          <p className="attendance-date">{todayStr}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="attendance-stats-grid">
        <div className="attendance-stat-card">
          <div className="stat-icon present-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value-large">{source.filter(s => s.status === 'present').length}</div>
            <div className="stat-label">Present Today</div>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="stat-icon absent-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value-large">{source.filter(s => s.status === 'absent').length}</div>
            <div className="stat-label">Absent</div>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="stat-icon leave-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value-large">{source.filter(s => s.status === 'on-leave').length}</div>
            <div className="stat-label">On Leave</div>
          </div>
        </div>

        <div className="attendance-stat-card">
          <div className="stat-icon late-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value-large">{source.filter(s => s.status === 'late').length}</div>
            <div className="stat-label">Late Arrivals</div>
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="leaderboards-container">
        {/* Department Rankings */}
        <div className="leaderboard-card">
          <h3>🏆 Department Attendance Rankings</h3>
          <div className="leaderboard-list">
            {departmentStats.map((dept) => (
              <div key={dept.department} className={`leaderboard-item rank-${dept.rank}`}>
                <div className="rank-badge">{dept.rank}</div>
                <div className="leaderboard-info">
                  <div className="leaderboard-name">{dept.department}</div>
                  <div className="leaderboard-meta">{dept.present}/{dept.total} employees</div>
                </div>
                <div className="leaderboard-score">
                  <div className="score-value">{dept.percentage}%</div>
                  {dept.trend !== 0 && (
                    <span className={`trend-mini ${dept.trend > 0 ? 'positive' : 'negative'}`}>
                      {dept.trend > 0 ? '↑' : '↓'} {Math.abs(dept.trend)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Employee Leaderboard */}
        <div className="leaderboard-card">
          <h3>⭐ Top Performers (Least Leaves)</h3>
          <div className="leaderboard-list">
            {employeeLeaderboard.map((emp, index) => (
              <div key={emp.id} className={`leaderboard-item rank-${index + 1}`}>
                <div className="rank-badge">{index + 1}</div>
                <div className="employee-avatar-mini">{Data.getInitials(emp.name)}</div>
                <div className="leaderboard-info">
                  <div className="leaderboard-name">{emp.name}</div>
                  <div className="leaderboard-meta">{emp.department}</div>
                </div>
                <div className="leaderboard-score">
                  <div className="score-value">{emp.totalLeaves}</div>
                  <div className="score-label">leaves</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="attendance-filters">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <div className="filter-buttons">
            <button className={attendanceFilter === 'all' ? 'active' : ''} onClick={() => setAttendanceFilter('all')}>All</button>
            <button className={attendanceFilter === 'present' ? 'active' : ''} onClick={() => setAttendanceFilter('present')}>Present</button>
            <button className={attendanceFilter === 'absent' ? 'active' : ''} onClick={() => setAttendanceFilter('absent')}>Absent</button>
            <button className={attendanceFilter === 'on-leave' ? 'active' : ''} onClick={() => setAttendanceFilter('on-leave')}>On Leave</button>
            <button className={attendanceFilter === 'late' ? 'active' : ''} onClick={() => setAttendanceFilter('late')}>Late</button>
          </div>
        </div>
        
        <div className="filter-group">
          <label>Filter by Shift:</label>
          <div className="filter-buttons">
            <button className={attendanceFilter === 'morning' ? 'active' : ''} onClick={() => setAttendanceFilter('morning')}>Morning</button>
            <button className={attendanceFilter === 'afternoon' ? 'active' : ''} onClick={() => setAttendanceFilter('afternoon')}>Afternoon</button>
            <button className={attendanceFilter === 'night' ? 'active' : ''} onClick={() => setAttendanceFilter('night')}>Night</button>
          </div>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={attendanceSort} onChange={(e) => setAttendanceSort(e.target.value)} className="sort-select">
            <option value="department">Department</option>
            <option value="name">Name</option>
            <option value="leaves">Most Leaves</option>
          </select>
        </div>
      </div>
            <div className="attendance-view">
    {/* Header */}
    <div className="section-header-main">
      <div>
        <h2>Attendance Management</h2>
        <p className="attendance-date">{todayStr}</p>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="attendance-stats-grid">
      <div className="attendance-stat-card">
        <div className="stat-icon present-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div className="stat-content">
          <div className="stat-value-large">{source.filter(s => s.status === 'present').length}</div>
          <div className="stat-label">Present Today</div>
        </div>
      </div>
      {/* ... (Repeat for Absent, On Leave, Late) ... */}
    </div>

    {/* NEW VISUAL ANALYSIS SECTION */}
    <div className="visual-analysis-container">
      {/* MULTI-LINE GRAPH */}
      <div className="analysis-card">
        <div className="card-header-flex">
          <h3>Performance Trend</h3>
          <div className="graph-legend">
            <span className="l-item"><i className="dot leaves"></i> Leaves</span>
            <span className="l-item"><i className="dot late"></i> Late</span>
            <span className="l-item"><i className="dot early"></i> Early</span>
          </div>
        </div>
        <div className="svg-container">
          <svg viewBox="0 0 600 200" className="multi-line-chart">
            {(() => {
              const data = Data.generateAttendanceTrend();
              const getX = (i) => 50 + i * 100;
              const getY = (val) => 160 - (val * 15);
              const renderPath = (key, color) => {
                const points = data.map((d, i) => `${getX(i)},${getY(d[key])}`).join(' ');
                return <polyline fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" points={points} />;
              };
              return (
                <g>
                  {renderPath('leaves', '#ef4444')}
                  {renderPath('late', '#f59e0b')}
                  {renderPath('early', '#3b82f6')}
                  {data.map((d, i) => (
                    <text key={i} x={getX(i)} y="190" textAnchor="middle" fontSize="12" fill="#94a3b8">{d.month}</text>
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* 3-MONTH CALENDAR */}
      <div className="analysis-card">
        <h3>Last 3 Months Activity</h3>
        
        <div className="three-month-grid">
          {Data.generateThreeMonthCalendar().map((month, mIdx) => (
            <div key={mIdx} className="calendar-mini-month">
              <span className="mini-month-name">{month.name}</span>
              <div className="mini-days-grid">
                {month.days.map((d, dIdx) => (
                  <div key={dIdx} className={`mini-day-cell ${d.status}`} title={d.status}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="calendar-legend-tiny">
          <span className="tag-p">Present</span>
          <span className="tag-l">Leave</span>
          <span className="tag-lt">Late</span>
        </div>
      </div>
    </div>

    {/* Filters and Employee Grid (rest remains exactly the same) */}
    <div className="attendance-filters">
       {/* ... existing filter code ... */}
    </div>

    <div className="attendance-employees-grid">
       {/* ... existing employee grid code ... */}
    </div>
  </div>
      {/* Employee Cards Grid */}
      <div className="attendance-employees-grid">
        {filteredEmployees.map(emp => (
          <div key={emp.id} className="attendance-employee-card" onClick={() => handleViewAttendanceDetail(emp)}>
            <div className="att-emp-header">
              <div className="employee-avatar-mini">{Data.getInitials(emp.name)}</div>
              <span className={`status-dot ${emp.status}`}></span>
            </div>
            
            <div className="att-emp-info">
              <div className="att-emp-name">{emp.name}</div>
              <div className="att-emp-meta">{emp.id} • {emp.department}</div>
              <div className="att-emp-shift">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {emp.shift} Shift
              </div>
            </div>

            <div className="att-emp-status">
              <span className={`status-badge-mini ${emp.status}`}>
                {emp.status === 'present' ? 'Present' : 
                 emp.status === 'absent' ? 'Absent' : 
                 emp.status === 'on-leave' ? 'On Leave' : 'Late'}
              </span>
              {emp.checkIn !== '-' && <div className="check-in-time">{emp.checkIn}</div>}
            </div>

            <div className="att-emp-stats">
              <div className="mini-stat">
                <span className="mini-stat-value">{emp.totalLeaves}</span>
                <span className="mini-stat-label">Leaves</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-value">{emp.lateArrivals}</span>
                <span className="mini-stat-label">Late</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-value">{emp.earlyLeaves}</span>
                <span className="mini-stat-label">Early</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default AttendanceView;