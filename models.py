"""
models.py
---------
This file defines DATABASE STRUCTURE using SQLAlchemy ORM.

IMPORTANT:
- No Flask app creation here
- No routes here
- Only table definitions
"""

from flask_sqlalchemy import SQLAlchemy

# Database object
# This is initialized in app.py
db = SQLAlchemy()


class User(db.Model):
    """
    users table
    -----------
    Stores global identity for all users:
    - candidates
    - admins
    - HR
    """
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String)          # candidate / admin / hr
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)


class CandidateProfile(db.Model):
    """
    candidate_profiles table
    ------------------------
    Extra details only needed during recruitment
    """
    __tablename__ = 'candidate_profiles'
    "hello"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    dob = db.Column(db.String)
    address = db.Column(db.String)
    category = db.Column(db.String)
    education = db.Column(db.String)


class Job(db.Model):
    """
    jobs table
    ----------
    Job postings created by MCD admins
    """
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    department = db.Column(db.String)
    location = db.Column(db.String)
    vacancies = db.Column(db.Integer)
    eligibility_rules = db.Column(db.Text)   # stored as JSON string
    status = db.Column(db.String)             # open / closed
    created_by = db.Column(db.Integer)


class Application(db.Model):
    """
    applications table
    ------------------
    Connects candidate_profiles with jobs
    """
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate_profiles.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    status = db.Column(db.String)             # applied / selected / rejected
    eligibility_reason = db.Column(db.String)


class Employee(db.Model):
    """
    employees table
    ---------------
    Created ONLY when a candidate is selected.
    This proves 'no re-entry of data'.
    """
    __tablename__ = 'employees'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True)
    employee_code = db.Column(db.String, unique=True)
    department = db.Column(db.String)
    designation = db.Column(db.String)
    pay_grade = db.Column(db.String)
    date_of_joining = db.Column(db.String)
    status = db.Column(db.String)             # active / retired / suspended



class Transfer(db.Model):
    """
    transfers table
    ---------------
    Stores HISTORY of employee transfers.

    IMPORTANT:
    - An employee is always global to MCD
    - Transfers are EVENTS, not status changes
    - This table preserves posting history
    """
    __tablename__ = 'transfers'

    id = db.Column(db.Integer, primary_key=True)

    # Link transfer to employee (NOT user)
    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'))

    # Old posting details
    from_department = db.Column(db.String)
    from_location = db.Column(db.String)

    # New posting details
    to_department = db.Column(db.String)
    to_location = db.Column(db.String)

    # When transfer becomes effective
    effective_date = db.Column(db.String)

    # Administrative details
    order_number = db.Column(db.String)
    reason = db.Column(db.String)
