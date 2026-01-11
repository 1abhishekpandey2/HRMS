import sqlite3
import os

DB = os.path.join(os.path.dirname(__file__), '..', 'instance', 'database.db')
DB = os.path.abspath(DB)

conn = sqlite3.connect(DB)
cur = conn.cursor()

def has_column(table, column):
    cur.execute("PRAGMA table_info(%s)" % table)
    cols = [r[1] for r in cur.fetchall()]
    return column in cols

changes = []

# employees: add 'department' column if missing
if not has_column('employees', 'department'):
    print('Adding column employees.department')
    cur.execute("ALTER TABLE employees ADD COLUMN department TEXT")
    changes.append('employees.department')
else:
    print('employees.department exists')

# departments: add 'color' column if missing
if not has_column('departments', 'color'):
    print('Adding column departments.color')
    cur.execute("ALTER TABLE departments ADD COLUMN color TEXT")
    changes.append('departments.color')
else:
    print('departments.color exists')

conn.commit()
conn.close()

if changes:
    print('Added columns:', changes)
else:
    print('No changes needed')
