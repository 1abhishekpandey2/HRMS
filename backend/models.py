"""
models.py
---------
This file defines DATABASE STRUCTURE using SQLAlchemy ORM.

IMPORTANT:
- No Flask app creation here
- No routes here
- Only table definitions

Note: These models aim to reflect the existing SQLite schema in
`backend/instance/database.db`. If you want smaller models or
additional relationships/validations, tell me and I'll refine them.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Database object
# This is initialized in app.py
db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String, nullable=False)  # candidate / admin / hr
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String, nullable=False)

    # Additional columns present in DB
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    verified = db.Column(db.String, default='pending')
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    # relationships
    candidate_profile = db.relationship('CandidateProfile', backref='user', uselist=False)
    employee = db.relationship('Employee', backref='user', uselist=False)


class CandidateProfile(db.Model):
    __tablename__ = 'candidate_profiles'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    dob = db.Column(db.Date)
    address = db.Column(db.Text)
    category = db.Column(db.String)
    education = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    department = db.Column(db.String, nullable=False)
    location = db.Column(db.String)
    vacancies = db.Column(db.Integer)
    eligibility_rules = db.Column(db.Text)   # stored as JSON string
    status = db.Column(db.String, default='open')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    applications = db.relationship('Application', backref='job')


class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate_profiles.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    status = db.Column(db.String, default='applied')
    eligibility_reason = db.Column(db.Text)
    applied_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    candidate = db.relationship('CandidateProfile', backref='applications')


class Department(db.Model):
    __tablename__ = 'departments'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String)
    color = db.Column(db.String)  # UI color for charts and badges
    head_employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))
    budget = db.Column(db.Numeric(12, 2))
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    head = db.relationship('Employee', backref='headed_department', foreign_keys=[head_employee_id])


class Employee(db.Model):
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    # Store external employee code but map to existing DB column named 'employee_id'
    employee_code = db.Column('employee_id', db.String, unique=True, nullable=False)  # EMP001 etc.
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    phone = db.Column(db.String)
    date_of_birth = db.Column(db.Date)
    gender = db.Column(db.String)
    address = db.Column(db.Text)

    # Keep normalized department_id for relations but also expose a simple 'department' string
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'), nullable=False)
    department = db.Column(db.String)  # e.g., 'Finance' - used by frontend and routes

    position = db.Column(db.String, nullable=False)
    employment_type = db.Column(db.String, default='permanent')
    shift_id = db.Column(db.Integer, db.ForeignKey('shifts.id'))
    manager_id = db.Column(db.Integer, db.ForeignKey('employees.id'))

    status = db.Column(db.String, default='active')
    joining_date = db.Column(db.Date)
    termination_date = db.Column(db.Date)
    basic_salary = db.Column(db.Numeric(10, 2))

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    # Relationship to departments via department_id (avoid naming collision with `department` string)
    department_obj = db.relationship('Department', backref='employees', foreign_keys=[department_id])
    shift = db.relationship('Shift', backref='employees')
    manager = db.relationship('Employee', remote_side=[id], backref='subordinates')


class Transfer(db.Model):
    __tablename__ = 'transfers'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    from_department = db.Column(db.String)
    from_location = db.Column(db.String)
    to_department = db.Column(db.String, nullable=False)
    to_location = db.Column(db.String)
    effective_date = db.Column(db.Date, nullable=False)
    order_number = db.Column(db.String)
    reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    employee = db.relationship('Employee', backref='transfers')


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    doc_type = db.Column(db.String)
    file_path = db.Column(db.String)
    extracted_data = db.Column(db.Text)
    verified = db.Column(db.String, default='pending')
    uploaded_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref='documents')


class Shift(db.Model):
    __tablename__ = 'shifts'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    grace_period_minutes = db.Column(db.Integer, default=15)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    shift_id = db.Column(db.Integer, db.ForeignKey('shifts.id'))

    check_in_time = db.Column(db.DateTime)
    check_out_time = db.Column(db.DateTime)
    total_hours = db.Column(db.Numeric(4, 2))
    status = db.Column(db.String, nullable=False)  # present, absent, late, etc.

    is_late = db.Column(db.Boolean, default=False)
    late_by_minutes = db.Column(db.Integer, default=0)
    is_early_leave = db.Column(db.Boolean, default=False)
    early_by_minutes = db.Column(db.Integer, default=0)

    location = db.Column(db.String)

    verified_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    verified_at = db.Column(db.DateTime)
    remarks = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('employee_id', 'date', name='u_employee_date'),)

    employee = db.relationship('Employee', backref='attendance_records')
    verifier = db.relationship('User', backref='verified_attendance', foreign_keys=[verified_by])


class AttendanceRegularization(db.Model):
    __tablename__ = 'attendance_regularization'

    id = db.Column(db.Integer, primary_key=True)
    attendance_id = db.Column(db.Integer, db.ForeignKey('attendance.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)

    original_check_in = db.Column(db.DateTime)
    original_check_out = db.Column(db.DateTime)
    requested_check_in = db.Column(db.DateTime)
    requested_check_out = db.Column(db.DateTime)

    reason = db.Column(db.Text, nullable=False)
    status = db.Column(db.String, default='pending')

    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    reviewed_at = db.Column(db.DateTime)
    review_comments = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    attendance = db.relationship('Attendance', backref='regularizations')
    reviewer = db.relationship('User', foreign_keys=[reviewed_by])


class AttendanceSummary(db.Model):
    __tablename__ = 'attendance_summary'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)

    total_working_days = db.Column(db.Integer)
    days_present = db.Column(db.Integer)
    days_absent = db.Column(db.Integer)
    days_half_day = db.Column(db.Integer)
    days_on_leave = db.Column(db.Integer)
    days_late = db.Column(db.Integer)
    days_early_leave = db.Column(db.Integer)

    total_hours_worked = db.Column(db.Numeric(6, 2))
    overtime_hours = db.Column(db.Numeric(6, 2))
    attendance_percentage = db.Column(db.Numeric(5, 2))

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('employee_id', 'month', 'year', name='u_employee_month_year'),)


class LeaveType(db.Model):
    __tablename__ = 'leave_types'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    code = db.Column(db.String, nullable=False)
    max_days_per_year = db.Column(db.Integer)
    carry_forward = db.Column(db.Boolean, default=False)
    requires_medical_certificate = db.Column(db.Boolean, default=False)
    is_paid = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)


class LeaveBalance(db.Model):
    __tablename__ = 'leave_balances'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    leave_type_id = db.Column(db.Integer, db.ForeignKey('leave_types.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)

    total_allocated = db.Column(db.Numeric(4, 1))
    used = db.Column(db.Numeric(4, 1), default=0)
    pending = db.Column(db.Numeric(4, 1), default=0)
    balance = db.Column(db.Numeric(4, 1))

    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('employee_id', 'leave_type_id', 'year', name='u_employee_leave_year'),)


class LeaveRequest(db.Model):
    __tablename__ = 'leave_requests'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    leave_type_id = db.Column(db.Integer, db.ForeignKey('leave_types.id'), nullable=False)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    total_days = db.Column(db.Numeric(4, 1), nullable=False)

    reason = db.Column(db.Text, nullable=False)
    contact_during_leave = db.Column(db.String)

    status = db.Column(db.String, default='pending')

    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_at = db.Column(db.DateTime)
    rejection_reason = db.Column(db.Text)

    medical_certificate_path = db.Column(db.String)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    approver = db.relationship('User', foreign_keys=[approved_by])


class SalaryComponent(db.Model):
    __tablename__ = 'salary_components'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)  # earning / deduction
    is_fixed = db.Column(db.Boolean, default=True)
    calculation_type = db.Column(db.String)
    description = db.Column(db.Text)


class EmployeeSalaryStructure(db.Model):
    __tablename__ = 'employee_salary_structure'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    component_id = db.Column(db.Integer, db.ForeignKey('salary_components.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    effective_from = db.Column(db.Date, nullable=False)
    effective_to = db.Column(db.Date)


class Payroll(db.Model):
    __tablename__ = 'payroll'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    month = db.Column(db.Integer, nullable=False)
    year = db.Column(db.Integer, nullable=False)

    basic_salary = db.Column(db.Numeric(10, 2))
    allowances = db.Column(db.Numeric(10, 2))
    overtime_pay = db.Column(db.Numeric(10, 2))
    bonus = db.Column(db.Numeric(10, 2))
    gross_salary = db.Column(db.Numeric(10, 2))

    tax = db.Column(db.Numeric(10, 2))
    provident_fund = db.Column(db.Numeric(10, 2))
    other_deductions = db.Column(db.Numeric(10, 2))
    total_deductions = db.Column(db.Numeric(10, 2))

    net_salary = db.Column(db.Numeric(10, 2))

    days_worked = db.Column(db.Integer)
    days_absent = db.Column(db.Integer)
    leave_deduction = db.Column(db.Numeric(10, 2))

    status = db.Column(db.String, default='draft')
    payment_date = db.Column(db.Date)
    payment_method = db.Column(db.String)
    transaction_reference = db.Column(db.String)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))

    __table_args__ = (db.UniqueConstraint('employee_id', 'month', 'year', name='u_payroll_employee_month_year'),)


class PerformanceReview(db.Model):
    __tablename__ = 'performance_reviews'

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)
    review_period_start = db.Column(db.Date)
    review_period_end = db.Column(db.Date)

    technical_skills = db.Column(db.Integer)
    communication = db.Column(db.Integer)
    teamwork = db.Column(db.Integer)
    punctuality = db.Column(db.Integer)
    overall_rating = db.Column(db.Numeric(3, 2))

    strengths = db.Column(db.Text)
    areas_for_improvement = db.Column(db.Text)
    goals_next_period = db.Column(db.Text)
    comments = db.Column(db.Text)

    status = db.Column(db.String, default='draft')
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


class Schedule(db.Model):
    __tablename__ = 'schedules'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'))
    stage = db.Column(db.String)
    date = db.Column(db.Date)
    time = db.Column(db.Time)
    location = db.Column(db.String)


class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey('applications.id'))
    stage = db.Column(db.String)
    marks = db.Column(db.Integer)


# End of models
