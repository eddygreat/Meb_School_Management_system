# School Management System (FastAPI + React)

A modular, scalable, and mobile-first school management system designed to streamline school operations and enhance communication between administrators, teachers, parents, and students.

- Backend: FastAPI, SQLAlchemy, PostgreSQL, JWT Auth, RBAC, Celery (stubs)
- Frontend: React (Vite), Tailwind CSS, Axios, Protected Routing, Role dashboards
- Services: Docker Compose (Postgres, Redis, Backend, Frontend)

## Getting Started

1. Copy env files

- backend/.env.example -> backend/.env
- frontend/.env.example -> frontend/.env

2. Start with Docker
   The easiest way to get the application running is with Docker.

- docker-compose up --build

Once the services are up, the application will be available at `http://localhost:5173`.

3. Create Your First Admin User
   The system is locked down by default. To get started, you need to create the first administrator account.

   Open a new terminal and run the following command:
   ```bash
   curl -X POST "http://localhost:8000/api/auth/register-admin" -H "Content-Type: application/json" -d '{"email": "admin@school.com", "password": "password", "full_name": "Admin User"}'
   ```
   This will create an admin user with the email `admin@school.com` and password `password`.

## How to Use the Application

After starting the application and creating your admin user, you can begin exploring the different roles.

### 1. Admin
- **Login**: Go to `http://localhost:5173/login` and sign in with `admin@school.com` and `password`.
- **Create Users**: As an admin, your first step is to populate the school. Navigate to the **Users** module to create accounts for Teachers, Students, and Parents.
- **Set Up Timetable**: Go to the **Timetable** module to define the school's master data, including Classes, Subjects, Rooms, and Time Slots. Once the master data is set, you can schedule classes.
- **Manage Invoices**: Use the **Fees & Payments** module to create and view student invoices.

### 2. Teacher
- **Login**: Log in with a teacher account created by the Admin.
- **Manage Curriculum**: In the **Assignments & Grading** module, you can create lesson plans, upload resources, and create assignments for your classes.
- **Enter Grades**: Use the **Grades Entry** module to input student scores for continuous assessments and exams.
- **Take Attendance**: Start a real-time attendance session using a QR code from the **Attendance** module.

### 3. Student
- **Login**: Log in with a student account.
- **View Your Schedule**: Check your personal class schedule in the **My Timetable** module.
- **Manage Assignments**: View and submit your assignments.
- **Check-in**: Use the **QR Check-in** feature to mark your attendance for a class.
- **View Reports**: Access your termly report cards.

### 4. Parent
- **Login**: Log in with a parent account.
- **View Invoices**: Check your child's school fees and make payments via Paystack or Flutterwave.
- **Communicate**: Use the **Messages** module to communicate directly with your child's teachers.

## Deployment on Render

This project can be deployed as two separate services on [Render](https://render.com/):
1.  A **Web Service** for the FastAPI backend.
2.  A **Static Site** for the React frontend.

### 1. Backend Service (FastAPI)

First, create a new PostgreSQL database on Render. You will need its **Internal Database URL** for the environment variables.

Then, create a new **Web Service** with the following settings:

- **Repository**: Your GitHub repository.
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Under the **Environment** tab, add the following variables:

- `DATABASE_URL`: The **Internal Database URL** from your Render PostgreSQL instance.
- `SECRET_KEY`: A new secret key you generate (e.g., using `openssl rand -hex 32`).
- `CORS_ORIGINS`: The URL of your frontend static site (e.g., `https://your-frontend-app.onrender.com`). You can add this after deploying the frontend.

### 2. Frontend Service (React)

Create a new **Static Site** on Render with the following settings:

- **Repository**: Your GitHub repository.
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

Under the **Environment** tab, add the following variable:

- `VITE_API_BASE_URL`: The URL of your backend web service (e.g., `https://your-backend-app.onrender.com`).

Finally, add a **Rewrite Rule** under the **Redirects/Rewrites** tab to handle client-side routing:

- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: Rewrite

## Default Roles

- admin, teacher, parent, student

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
