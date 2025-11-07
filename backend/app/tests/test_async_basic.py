import os
import pytest

os.environ.setdefault('ENV', 'test')

@pytest.mark.asyncio
async def test_health_async(async_client):
    r = await async_client.get('/api/health')
    assert r.status_code == 200
    assert r.json().get('status') == 'ok'

@pytest.mark.asyncio
async def test_analytics_dashboard_demo_async(async_client):
    r = await async_client.get('/api/analytics/dashboard')
    assert r.status_code == 200
    data = r.json()
    assert 'attendance_rate' in data
    assert 'payments_by_month' in data
    assert 'attendance_by_class' in data
    assert 'grade_distribution' in data
