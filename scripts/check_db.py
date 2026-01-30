import sqlite3
from pathlib import Path
p = Path.cwd() / 'college_app.db'
if not p.exists():
    p = Path.cwd() / 'backend' / 'college_app.db'
print('DB path:', p)
conn = sqlite3.connect(p)
cur = conn.cursor()
print('students table columns:')
for row in cur.execute('PRAGMA table_info(students)'):
    print(row)
print('\nseeded student 21AD001:')
print(cur.execute("SELECT roll_no, profile_pic FROM students WHERE roll_no='21AD001'").fetchone())
conn.close()