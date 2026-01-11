import apiFetch from './api';

export const getEmployees = () => apiFetch('/api/hr/employees', { method: 'GET' });
export const getDepartments = () => apiFetch('/api/hr/departments', { method: 'GET' });
export const getAttendance = () => apiFetch('/api/hr/attendance', { method: 'GET' });
export const getLeaveRequests = () => apiFetch('/api/hr/leave-requests', { method: 'GET' });
export const getStats = () => apiFetch('/api/hr/stats', { method: 'GET' });
