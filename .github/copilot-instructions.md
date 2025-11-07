## Quick orientation for AI coding agents

This repo implements a School Management System: a FastAPI async backend (SQLAlchemy 2.0, PostgreSQL), a Vite + React frontend, and Docker Compose to run services (Postgres, Redis, backend, frontend). The goal here is to provide the essential, project-specific knowledge an automated coding agent needs to be productive quickly.

Main entrypoints & config
- Backend app entry: `backend/app/main.py` — includes routers and startup `init_db()`.
- Settings: `backend/app/core/config.py` — central pydantic settings (ENV, API_PREFIX, SECRET_KEY, DATABASE_URL, CORS_ORIGINS).
- DB: `backend/app/core/database.py` — SQLAlchemy async engine (converts `postgresql+psycopg2` to `postgresql+asyncpg`), `init_db()` creates tables from `Base.metadata`.

Project patterns & gotchas (concrete)
- Async SQLAlchemy 2.0 is used with `AsyncSession` and `mapped_column` (see `backend/app/models/*`). Expect `await` across DB calls.
- Model convenience methods sometimes commit themselves. Example: `backend/app/models/user.py` → `async def set_password(self, db, password)` calls `db.commit()` after updating hashed_password. Be careful not to duplicate commits when editing flows.
- Authentication flow:
  - Token creation: `backend/app/core/security.py` → `create_access_token` encodes `sub` as user id and `role`.
  - Token dependency: `backend/app/core/deps.py` → `get_current_user` decodes `sub` and expects `User.get_by_id(db, id)`.
  - OAuth token URL: `OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")` — note `API_PREFIX` is applied in `app.main` when routers are included.
- Role checks: `require_roles(*roles)` returns a dependency to enforce RBAC on endpoints (see `core/deps.py`).

Routing and API shape
- All routers are mounted under `settings.API_PREFIX` (default `/api`). See `backend/app/main.py` for included routers: `auth, students, teachers, grades, fees, comms, analytics, admin, attendance, biometric, timetable, curriculum, hr, security, settings, discipline`.
- Health check: GET `{API_PREFIX}/health`.

Common developer workflows (how to run / test)
- Docker (recommended - brings Postgres & Redis):

```powershell
# from repository root
docker-compose up --build
```

- Backend local dev (without Docker):

```powershell
# from repository root
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# copy .env from .env.example and set SECRET_KEY, DATABASE_URL (postgres), etc.
uvicorn app.main:app --reload --port 8000
```

- Frontend local dev:

```powershell
cd frontend
npm install
npm run dev
```

- Running backend tests:

```powershell
cd backend
pytest -q
```

Notes about environment and DB
- Copy `backend/.env.example -> backend/.env` and `frontend/.env.example -> frontend/.env` before running.
- `config.Settings.DATABASE_URL` is expected in sync (psycopg2) form like `postgresql+psycopg2://user:pw@host:5432/dbname`. The code converts that string to an asyncpg URL for the engine at runtime.
- SECRET_KEY must be set for JWT operations; tests set `ENV=test` in `backend/app/tests/conftest.py`.

Testing & fixtures
- The test suite uses `pytest` and `pytest-asyncio`. Tests use an AsyncClient against `app.main:app` (see `backend/app/tests/conftest.py`), and `ENV`=test is used to switch behaviors.

Conventions and idioms to follow when editing code
- Prefer async functions and `await` for DB and HTTP operations.
- When adding routes, register them in `backend/app/main.py` with the prefix `settings.API_PREFIX + '/<module>'` and a meaningful `tags` value.
- Reuse `get_db` and `require_roles` dependency utilities from `backend/app/core/deps.py` to maintain consistent auth behavior.
- When changing model state, check whether the model method performs `db.commit()` internally (avoid double commits).

Integration points & external services
- Postgres: via DATABASE_URL. Alembic present for migrations (`backend/alembic.ini`) but `init_db()` creates tables automatically on startup.
- Redis: used for Celery (stubs at `backend/app/tasks`) and caching; check `backend/Dockerfile` & `docker-compose.yml` for wiring.
- Payments: Paystack/Flutterwave stubs exist in `backend/app/utils/payments.py` and `core/config.py` contains placeholders for keys — these flows are intentionally partial.

Where to look for examples
- Auth pattern: `backend/app/routers/auth.py` + `backend/app/models/user.py` + `backend/app/core/security.py` (login, register-admin, token creation).
- DB init & model registration: `backend/app/core/database.py` + `backend/app/main.py` (startup hook `init_db`).
- Async tests: `backend/app/tests/*`, `backend/app/tests/conftest.py`.

Editing & PR guidance for agents
- Make changes in small, testable commits. Run backend tests after changes. If adding DB models, prefer creating an Alembic migration (project includes Alembic) or ensure `init_db()` will create tables in development.
- When adding endpoints, include an updated test for the router using `AsyncClient` and the same style as existing tests.

If anything here is ambiguous or you need deeper context (migrations, Celery tasks, or frontend auth wiring), tell me which area you'd like expanded and I will update this doc.
