# School Management System (FastAPI + React)

A modular, scalable, mobile-first school management system.

- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT Auth, RBAC, Celery (stubs)
- Frontend: React (Vite), Tailwind CSS, Axios, Protected Routing, Role dashboards
- Services: Docker Compose (Postgres, Redis, Backend, Frontend)

## Quick Start

1. Copy env files

- backend/.env.example -> backend/.env
- frontend/.env.example -> frontend/.env

2. Start with Docker

- docker-compose up --build

3. Local dev (without Docker)

- Backend: create venv, pip install -r backend/requirements.txt, set envs, run `uvicorn app.main:app --reload --port 8000`
- Frontend: cd frontend, `npm i`, `npm run dev`

## Default Roles

- admin, teacher, parent, student

## Sample Credentials

- Create an admin via `POST /api/auth/register-admin` then login `POST /api/auth/login`.

## Structure

- backend/app
  - core (security, deps, rbac)
  - models (user, student, teacher, misc)
  - schemas (pydantic)
  - routers (auth, students, teachers, timetable, assignments, grades, fees, comms, analytics, admin)
  - utils (payments)
  - tasks (celery stubs)

- frontend/src
  - api (axios client)
  - context (AuthContext)
  - routes (ProtectedRoute)
  - pages (dashboards & modules)
  - components (UI)

## Tests

- Samples in backend/app/tests

## Payments

- Stubs for Paystack/Flutterwave. Add your keys in env and complete the flows.

## Exports

- PDF/Excel endpoints stubbed; integrate your preferred libs (WeasyPrint/xlsxwriter).

## UN SDG Alignment

This project aligns with the United Nations Sustainable Development Goal 4 (Quality Education):

- Access and inclusion via role-based portals (Admin, Teacher, Parent, Student) supporting equitable engagement (SDG 4.1, 4.5).
- Learning outcomes through curriculum, assignments, grading, and WAEC/NECO-style reports (SDG 4.1).
- Teacher support with HR, timetables, performance tracking (SDG 4.c).
- Data-driven improvement through analytics (attendance, performance, payments) and actionability (SDG 4.4).
- Communication channels (messages, announcements) encourage home–school collaboration (SDG 4.7).

## License

- MIT
