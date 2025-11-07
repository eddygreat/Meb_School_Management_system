import os
os.environ.setdefault('ENV', 'test')

from app.routers.grades import grade_letter_and_remark
from app.core.security import create_access_token, ALGORITHM
from jose import jwt

def test_grade_letter_scale():
    cases = [
        (76, 'A1'), (72, 'B2'), (66, 'B3'), (60, 'C4'), (55, 'C5'), (50, 'C6'), (45, 'D7'), (40, 'E8'), (20, 'F9')
    ]
    for total, expected in cases:
        letter, _ = grade_letter_and_remark(total)
        assert letter == expected

def test_jwt_roundtrip():
    token = create_access_token({"sub": "123", "role": "admin"}, expires_minutes=5)
    payload = jwt.decode(token, os.environ.get('SECRET_KEY', 'supersecretchange'), algorithms=[ALGORITHM])
    assert payload.get('sub') == '123'
    assert payload.get('role') == 'admin'
