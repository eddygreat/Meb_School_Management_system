import os
os.environ.setdefault('ENV', 'test')
os.environ.setdefault('SECRET_KEY', 'testingsecret')
os.environ.setdefault('DATABASE_URL', 'sqlite+aiosqlite:///./test_app.db')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def auth_headers(token: str):
    return {"Authorization": f"Bearer {token}"}


def register_and_login_admin():
    r = client.post('/api/auth/register-admin', json={
        "email": "admin2@test.com",
        "full_name": "Admin Two",
        "password": "Admin123!"
    })
    # ignore if exists
    r = client.post('/api/auth/login', json={"email": "admin2@test.com", "password": "Admin123!"})
    assert r.status_code == 200
    return r.json()["access_token"]


def create_user(token, email, full_name, role, password="Pass123!"):
    r = client.post('/api/admin/users', json={
        "email": email, "full_name": full_name, "role": role, "password": password
    }, headers=auth_headers(token))
    assert r.status_code == 200
    return r.json()["id"]


def create_student_record(token, user_id, admission_no="S-2001", class_name="Grade 10A"):
    r = client.post('/api/students/', json={
        "user_id": user_id,
        "admission_no": admission_no,
        "class_name": class_name,
        "date_of_birth": None
    }, headers=auth_headers(token))
    assert r.status_code == 200
    return r.json()["id"]


def create_teacher_record(token, user_id, staff_no="T-1001", department="Science"):
    r = client.post('/api/teachers/', json={
        "user_id": user_id,
        "staff_no": staff_no,
        "department": department,
        "date_of_employment": None
    }, headers=auth_headers(token))
    assert r.status_code == 200
    return r.json()["id"]


def test_grades_report_pdf():
    token = register_and_login_admin()
    # Year/term
    r = client.post('/api/grades/year', json={"name": "2024/2025"}, headers=auth_headers(token))
    assert r.status_code == 200
    year_id = r.json()["id"]
    r = client.post('/api/grades/term', json={"name": "First", "year_id": year_id}, headers=auth_headers(token))
    assert r.status_code == 200
    term_id = r.json()["id"]
    # Subject
    r = client.post('/api/timetable/subjects', json={"name": "Mathematics"}, headers=auth_headers(token))
    assert r.status_code == 200
    subject_id = r.json()["id"]
    # Student
    student_user_id = create_user(token, "studpdf@test.com", "Student Pdf", "student")
    student_id = create_student_record(token, student_user_id, admission_no="S-3001")
    # Grade entry
    r = client.post('/api/grades/entry', json={
        "student_id": student_id, "subject_id": subject_id, "term_id": term_id, "year_id": year_id,
        "ca1": 20, "ca2": 15, "exam": 45
    }, headers=auth_headers(token))
    assert r.status_code == 200
    # PDF report
    r = client.get(f'/api/grades/report/{student_id}/pdf', params={"term_id": term_id, "year_id": year_id}, headers=auth_headers(token))
    assert r.status_code == 200
    assert r.headers.get('content-type', '').startswith('application/pdf')


def test_timetable_conflict():
    token = register_and_login_admin()
    # Classes
    c1 = client.post('/api/timetable/classes', json={"name": "JSS1A"}, headers=auth_headers(token)).json()["id"]
    c2 = client.post('/api/timetable/classes', json={"name": "JSS1B"}, headers=auth_headers(token)).json()["id"]
    # Subject and timeslot
    sub = client.post('/api/timetable/subjects', json={"name": "English"}, headers=auth_headers(token)).json()["id"]
    ts = client.post('/api/timetable/timeslots', json={"day_of_week": 0, "start_time": "08:00:00", "end_time": "09:00:00"}, headers=auth_headers(token)).json()["id"]
    # Teacher
    t_user_id = create_user(token, "teachconf@test.com", "Teacher Conf", "teacher")
    teacher_id = create_teacher_record(token, t_user_id, staff_no="T-2001")
    # Schedule first
    r = client.post('/api/timetable/schedule', json={
        "class_id": c1, "room_id": None, "subject_id": sub, "teacher_id": teacher_id, "time_slot_id": ts
    }, headers=auth_headers(token))
    assert r.status_code == 200
    # Attempt conflicting schedule for same teacher & timeslot
    r = client.post('/api/timetable/schedule', json={
        "class_id": c2, "room_id": None, "subject_id": sub, "teacher_id": teacher_id, "time_slot_id": ts
    }, headers=auth_headers(token))
    assert r.status_code == 409


def test_attendance_qr_duplicate():
    token = register_and_login_admin()
    # Student
    s_user_id = create_user(token, "studatt@test.com", "Student Att", "student")
    student_id = create_student_record(token, s_user_id, admission_no="S-4001")
    # Create session
    r = client.post('/api/attendance/session', json={"class_name": "JSS1A", "duration_minutes": 10}, headers=auth_headers(token))
    assert r.status_code == 200
    session = r.json()
    # First check-in
    r = client.post('/api/attendance/checkin/qr', json={"token": session["token"], "student_id": student_id})
    assert r.status_code == 200
    # Duplicate check-in should fail with 409
    r = client.post('/api/attendance/checkin/qr', json={"token": session["token"], "student_id": student_id})
    assert r.status_code == 409


def test_fees_webhook_success_marks_invoice_paid():
    token = register_and_login_admin()
    # Student
    s_user_id = create_user(token, "studfees@test.com", "Student Fees", "student")
    student_id = create_student_record(token, s_user_id, admission_no="S-5001")
    # Create invoice
    r = client.post('/api/fees/invoices', json={"student_id": student_id, "title": "Tuition", "amount": 50000, "currency": "NGN"}, headers=auth_headers(token))
    assert r.status_code == 200
    inv_id = r.json()["id"]
    # Initiate payment
    r = client.post('/api/fees/initiate', json={"invoice_id": inv_id, "provider": "paystack"}, headers=auth_headers(token))
    assert r.status_code == 200
    ref = r.json()["reference"]
    # Webhook success
    r = client.post('/api/fees/webhook/paystack', json={"reference": ref, "status": "success"})
    assert r.status_code == 200
    # Receipt shows paid
    r = client.get(f'/api/fees/receipt/{inv_id}', headers=auth_headers(token))
    assert r.status_code == 200
    data = r.json()
    assert data["invoice"]["status"] == "paid"
    assert any(p["status"] == "success" for p in data["payments"]) 
