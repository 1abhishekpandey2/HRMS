import apiFetch from './api';

export const getEmployees = () => apiFetch('/api/hr/employees', { method: 'GET' });
export const getDepartments = () => apiFetch('/api/hr/departments', { method: 'GET' });
export const getAttendance = () => apiFetch('/api/hr/attendance', { method: 'GET' });
export const getLeaveRequests = () => apiFetch('/api/hr/leave-requests', { method: 'GET' });
export const getStats = () => apiFetch('/api/hr/stats', { method: 'GET' });

/**
 * Update the status of a leave request.
 * Backend should accept PATCH /api/leaves/:id { status: 'approved' | 'rejected' }
 */
export async function updateLeaveRequestStatus(id, status) {
	// adjust endpoint to match your backend routes if different
	const res = await fetch(`/api/leaves/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status }),
	});

	if (!res.ok) {
		const errText = await res.text().catch(() => '');
		throw new Error(`Failed to update leave request: ${res.status} ${errText}`);
	}

	return res.json(); // should return updated leave (or full list) per backend contract
}

export async function approveLeaveRequest(id) {
	return updateLeaveRequestStatus(id, 'approved');
}

export async function rejectLeaveRequest(id) {
	return updateLeaveRequestStatus(id, 'rejected');
}