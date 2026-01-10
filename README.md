<div align="center" style="padding:20px;"> <h1 style="margin-bottom:5px;">🏛️ HRMS Platform</h1> <h3 style="margin-top:0;">Municipal Corporation of Delhi (MCD)</h3> <p style="max-width:700px; font-size:14px;"> A centralized, role-based Human Resource Management System prototype designed to streamline recruitment, onboarding, and HR operations for large-scale municipal governance. </p> <img src="https://img.shields.io/badge/Status-Prototype-blue"/> <img src="https://img.shields.io/badge/Architecture-Centralized-green"/> <img src="https://img.shields.io/badge/Security-Hashed_Passwords-orange"/> <img src="https://img.shields.io/badge/Scale-Municipal-lightgrey"/> </div>
🧠 Architecture Summary
<div style="background:#f6f8fa; padding:15px; border-radius:8px;">

<b>Design Approach:</b>
Centralized HRMS Core with role-based dashboards and modular services.

<b>Core Responsibilities:</b>

Authentication & role-based access

Workflow orchestration

Centralized business logic

Data consistency across departments

</div>
👥 Stakeholders & Dashboards
<table> <tr> <th align="left">Role</th> <th align="left">Key Responsibilities</th> </tr> <tr> <td><b>🟢 Candidate</b></td> <td>Profile management, job applications, application tracking</td> </tr> <tr> <td><b>🟠 Recruitment Admin</b></td> <td>Job creation, application review, candidate shortlisting</td> </tr> <tr> <td><b>🔴 HR</b></td> <td>Interviews, final selection, onboarding, employee creation</td> </tr> </table>
🔄 Recruitment Workflow
<div style="background:#f6f8fa; padding:15px; border-radius:8px; text-align:center;">

Candidate Applies
⬇️
Recruitment Admin Shortlists
⬇️
HR Conducts Interview
⬇️
Selected / Rejected
⬇️
<b>Selected → Employee Onboarding</b>

</div>
🔐 Security & Authentication
<div style="background:#fff3cd; padding:15px; border-radius:8px;">

✔ Session-based authentication
✔ Role-Based Access Control (RBAC)
✔ Passwords stored <b>only in hashed format</b>
✔ No plaintext password storage

<b>Even administrators cannot view passwords.</b>

</div>
🧪 Demo Credentials (Prototype)
<table> <tr> <th>Role</th> <th>Email</th> <th>Password</th> </tr> <tr> <td>Recruitment Admin</td> <td><code>admin@mcd.in</code></td> <td><code>password123</code></td> </tr> <tr> <td>Candidate</td> <td><code>1abhishekpandey2@gmail.com</code></td> <td><code>1234</code></td> </tr> <tr> <td>HR</td> <td><code>hari@hr.in</code></td> <td><code>hari</code></td> </tr> </table>
🧩 Core Services
<div style="display:flex; gap:10px; flex-wrap:wrap;"> <div style="background:#e7f3ff; padding:10px; border-radius:6px;">Recruitment & Onboarding</div> <div style="background:#e7f3ff; padding:10px; border-radius:6px;">Candidate Profiles</div> <div style="background:#e7f3ff; padding:10px; border-radius:6px;">Interview & Selection</div> <div style="background:#e7f3ff; padding:10px; border-radius:6px;">Authentication</div> </div>

🚀 Future Scope

Attendance (Biometric / GPS)

Payroll Processing

Performance Evaluation

Grievance Redressal

Transfers & Postings

Analytics & AI-assisted recruitment

💻 Tech Stack
<div align="center"> <img src="https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"/> <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white"/> <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white"/> <img src="https://img.shields.io/badge/SQLAlchemy-red?style=for-the-badge"/> </div>
<div align="center" style="margin-top:20px; font-style:italic;">

<b>Designed for scalability, transparency, and real municipal workflows.</b>

</div>
