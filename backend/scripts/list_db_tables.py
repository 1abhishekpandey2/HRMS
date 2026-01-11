import sqlite3
import json
import os

DB = os.path.join(os.path.dirname(__file__), '..', 'instance', 'database.db')
DB = os.path.abspath(DB)

conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute("SELECT name, type, sql FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY name")
rows = cur.fetchall()
out = []
for name, typ, sql in rows:
    try:
        cur.execute(f"SELECT COUNT(*) FROM '{name}'")
        cnt = cur.fetchone()[0]
    except Exception:
        cnt = None
    out.append({'name': name, 'type': typ, 'count': cnt, 'sql': sql})

print(json.dumps(out, indent=2))
