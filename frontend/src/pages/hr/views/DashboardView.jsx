import React from 'react';
import * as Data from './DashboardData';
import { icons } from './Icons';

const DashboardView = ({ 
  employees, 
  leaveRequests, 
  stats,
  attendance,
  departments,
  handleViewEmployee, 
  handleLeaveAction,
  setActiveSection,
  currentUser,
  hrUser
}) => {
  return (
    <div className="dashboard-view">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div>
          <h2>Welcome back, {(hrUser?.name || currentUser?.name || Data.currentUser.name).split(' ')[0]} ✨</h2>
          <p>Here's your HR overview for Sunday, January 11, 2026</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats ? (
          <>
            <div className="stat-card">
              <div className="stat-header"><span className="stat-label">Total Employees</span></div>
              <div className="stat-value">{stats.totalEmployees}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span className="stat-label">Present Today</span></div>
              <div className="stat-value">{stats.presentToday}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span className="stat-label">On Leave</span></div>
              <div className="stat-value">{stats.onLeave}</div>
            </div>
            <div className="stat-card">
              <div className="stat-header"><span className="stat-label">Departments</span></div>
              <div className="stat-value">{stats.departments}</div>
            </div>
          </>
        ) : (
          // Fallback to static quick stats while loading
          Object.entries(Data.stats).map(([key, stat]) => (
            <div key={key} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                {stat.trend !== 0 && (
                  <span className={`trend ${stat.trend > 0 ? 'positive' : 'negative'}`}>
                    {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                  </span>
                )}
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))
        )}
      </div>

      {/* Quick Content */}
      <div className="dashboard-grid">
        <div className="employees-section card">
          <div className="section-header">
            <h3>Recent Employees</h3>
            <button className="link-btn" onClick={() => setActiveSection('employees')}>
              View All
            </button>
          </div>
          <div className="employee-cards">
            {employees.slice(0, 4).map(emp => (
              <div key={emp.id} className="employee-card" onClick={() => handleViewEmployee(emp)}>
                <div className="employee-avatar">{Data.getInitials(emp.name)}</div>
                <div className="employee-info">
                  <div className="employee-name">{emp.name}</div>
                  <div className="employee-meta">{emp.department} • {emp.id}</div>
                </div>
                <span className={`status-badge ${emp.status.toLowerCase().replace(' ', '-')}`}>
                  {emp.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="leave-section card">
          <div className="section-header">
            <h3>Pending Leave Requests</h3>
            <span className="badge">
              {leaveRequests.filter(r => r.status === 'pending').length}
            </span>
          </div>
          {leaveRequests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="empty-state">No pending leave requests</p>
          ) : (
            <div className="leave-requests">
              {leaveRequests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="leave-request">
                  <div className="leave-info">
                    <div className="leave-employee">{req.employeeName}</div>
                    <div className="leave-details">
                      <span className="leave-type">{req.leaveType}</span>
                      <span className="leave-dates">
                        {req.startDate} to {req.endDate}
                      </span>
                    </div>
                  </div>
                  <div className="leave-actions">
                    <button 
                      className="action-btn approve" 
                      onClick={() => handleLeaveAction(req.id, 'approved')}
                    >
                      ✓
                    </button>
                    <button 
                      className="action-btn reject" 
                      onClick={() => handleLeaveAction(req.id, 'rejected')}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;