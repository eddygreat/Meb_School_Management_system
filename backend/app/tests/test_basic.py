import os
os.environ.setdefault('ENV', 'test')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get('/api/health')
    assert r.status_code == 200
    assert r.json().get('status') == 'ok'

def test_analytics_dashboard_demo():
    # In test env, analytics returns demo payload without DB
    r = client.get('/api/analytics/dashboard')
    assert r.status_code == 200
    data = r.json()
    assert 'attendance_rate' in data
    assert isinstance(data['attendance_rate'], (int, float))
    assert 'payments_by_month' in data
    assert isinstance(data['payments_by_month'], list)
    assert 'attendance_by_class' in data
    assert isinstance(data['attendance_by_class'], list)
    assert 'grade_distribution' in data
    assert isinstance(data['grade_distribution'], dict)

def test_root_redirect():
    # Test that the root URL redirects to /login
    r = client.get('/', allow_redirects=False)
    assert r.status_code == 307 # Temporary Redirect
    assert r.headers['location'] == '/login'
