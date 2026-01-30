import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

with open('backend/seed.py','rb') as f:
    files = {'file': ('seed.py', f, 'text/x-python')}
    resp = client.post('/student/21AD001/photo', files=files)
    print('status', resp.status_code)
    print('json', resp.json())

# Verify the DB updated
import sqlite3
conn = sqlite3.connect('college_app.db')
cur = conn.cursor()
cur.execute("SELECT profile_pic FROM students WHERE roll_no='21AD001'")
print('db profile_pic:', cur.fetchone())
conn.close()