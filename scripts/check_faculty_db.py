import sqlite3
conn=sqlite3.connect('college_app.db')
cur=conn.cursor()
print('faculty columns:', cur.execute("PRAGMA table_info(faculty)").fetchall())
print('sample faculty row:', cur.execute("SELECT staff_no, profile_pic FROM faculty WHERE staff_no='HTS 1794'").fetchone())
conn.close()