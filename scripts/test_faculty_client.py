import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)
resp = client.get('/faculty/HTS 1794')
print('status', resp.status_code)
print('json', resp.json())