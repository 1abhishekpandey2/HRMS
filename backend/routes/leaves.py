from flask import Blueprint, request, jsonify
from models import db
from sqlalchemy import text
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
	allowed = ("Approved", "Rejected", "Pending")
	if not status or status.capitalize() not in allowed:
		return jsonify({"error": "Invalid or missing status. Allowed: Approved, Rejected, Pending"}), 400
	status = status.capitalize()

	try:
		stmt = text("UPDATE leave_requests SET status = :status WHERE id = :id")
		res = db.session.execute(stmt, {"status": status, "id": leave_id})
		if res.rowcount == 0:
			db.session.rollback()
			return jsonify({"error": "Leave request not found"}), 404
		db.session.commit()
		row = db.session.execute(
			text("SELECT * FROM leave_requests WHERE id = :id"),
			{"id": leave_id}
		).fetchone()
		return jsonify({"leave": dict(row._mapping)}), 200
	except SQLAlchemyError as e:
		db.session.rollback()
		return jsonify({"error": "Database error", "detail": str(e)}), 500

@leaves_bp.route("/leaves", methods=["GET"])
def get_leaves():
    try:
        rows = db.session.execute(text("SELECT * FROM leave_requests")).fetchall()
        leaves = [dict(row._mapping) for row in rows]
        return jsonify({"leaves": leaves}), 200
    except SQLAlchemyError as e:
        return jsonify({"error": "Database error", "detail": str(e)}), 500
