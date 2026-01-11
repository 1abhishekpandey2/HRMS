from flask import Blueprint, request, jsonify, session
from models import db, LeaveRequest, Employee
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError

leaves_bp = Blueprint("leaves", __name__, url_prefix="/api")

@leaves_bp.route("/leaves/<int:leave_id>", methods=["GET", "PATCH"])
def leave_detail(leave_id):
	# GET: return single leave request
	if request.method == "GET":
		row = db.session.execute(
			text("SELECT * FROM leave_requests WHERE id = :id"),
			{"id": leave_id}
		).fetchone()
		if not row:
			return jsonify({"error": "Leave request not found"}), 404
		return jsonify({"leave": dict(row._mapping)}), 200

	# PATCH: update status of leave request
	data = request.get_json(silent=True) or {}
	status = data.get("status")
	if not status or str(status).strip().lower() not in ("approved", "rejected", "pending"):
		return jsonify({"error": "Invalid or missing status. Allowed: approved, rejected, pending"}), 400
	status = str(status).strip().lower()

	try:
		lr = LeaveRequest.query.get(leave_id)
		if not lr:
			return jsonify({"error": "Leave request not found"}), 404
		# update fields
		lr.status = status
		if status == 'approved':
			lr.approved_at = datetime.utcnow()
			lr.approved_by = session.get('user_id') if 'user_id' in session else None
			# mark employee on leave
			emp = Employee.query.get(lr.employee_id)
			if emp:
				emp.status = 'on-leave'
		elif status == 'rejected':
			lr.rejection_reason = data.get('rejection_reason') or lr.rejection_reason
		db.session.commit()
		return jsonify({"leave": {"id": lr.id, "employee_id": lr.employee_id, "status": lr.status, "approved_by": lr.approved_by, "approved_at": lr.approved_at.isoformat() if lr.approved_at else None}}), 200
	except SQLAlchemyError as e:
		db.session.rollback()
		return jsonify({"error": "Database error", "detail": str(e)}), 500