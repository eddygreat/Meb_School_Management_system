# MEB School Management System

![Project Status: Stable](https://img.shields.io/badge/Status-Stable-success)
![Deployment: Deployed](https://img.shields.io/badge/Deployment-Live-blue)

**Live Demo:** [Launch Application](https://mebschoolmanagementsystem.netlify.app) | **Pitch Deck:** [View on Canva](https://www.canva.com/design/DAG580EMfGY/eTk0SH85kiJdpDtewp3GWA/edit?utm_content=DAG580EMfGY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## About The Project

**MEB School Management System** is a next-generation, AI-powered educational platform designed to modernize school administration. It replaces traditional paperwork with a centralized digital ecosystem connecting **Administrators, Teachers, Students, and Parents**.

Our mission is to support **SDG 4: Quality Education** by automating administrative burdens, allowing educators to focus on what matters most: teaching.

---

## 🚀 Key Features

### 🔐 Authentication & Security
*   **Role-Based Access Control (RBAC):** Distinct dashboards for Admins, Teachers, Students, and Parents.
*   **Secure Signup/Login:** JWT-based session management.
*   **Biometric Security:** AI-powered **Face Recognition Login** (comparable to FaceID) using Google Gemini Vision.

### 📚 Curriculum & Learning
*   **Lesson Planning:** Teachers can create, organize, and track lesson plans weeks in advance.
*   **Assignments:** Full lifecycle management—Creation, Student Submission, and Grading.
*   **Digital Resources:** Centralized repository for study materials and links.

### 🤖 AI Integration (Powered by Google Gemini 1.5)
*   **AI Chat Assistant:** 24/7 support for students and teachers to answer academic queries.
*   **Auto-Lesson Generator:** Teachers can generate detailed lesson plans from a simple topic prompt.
*   **Smart Grading:** AI suggests grades and detailed feedback for student submissions.
*   **Performance Prediction:** analyzing historical data to identify students at risk (Beta).

### 🛠️ Administrative Control
*   **User Management:** detailed tables to track faculty and student body.
*   **System Health:** Real-time visibility into system usage and audits.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM (SPA)
*   **Hosting:** Netlify ([View Deployment](https://mebschoolmanagementsystem.netlify.app))

### Backend
*   **API:** Python FastAPI (Async)
*   **Database:** PostgreSQL (via Render)
*   **ORM:** SQLAlchemy (Async)
*   **AI Engine:** Google Generative AI (Gemini 1.5 Flash)
*   **Hosting:** Render ([View API Docs](https://meb-school-management-system-1-wkq1.onrender.com/docs))

---

## 🚧 Road Map (Under Construction)

While the core system is fully operational, we are actively developing the following sophisticated features:

*   **💳 Payments & Invoicing:** Full integration with Paystack/Flutterwave is currently mocked. Real-time transaction processing is coming in v2.0.
*   **📊 Advanced Analytics:** Deep-dive charts for school-wide academic performance are currently in prototype phase.
*   **🔄 System Backup/Restore:** The endpoints `/api/admin/backup` and `/restore` are currently placeholders pending cloud storage integration.
*   **📱 Mobile App:** A dedicated React Native mobile application for parents is planned for Q3 2025.

---

## 💻 Local Installation

### Prerequisites
*   Node.js & npm
*   Python 3.10+
*   PostgreSQL Service

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=postgresql://user:pass@localhost/dbname" > .env
echo "GEMINI_API_KEY=your_key_here" >> .env
echo "SECRET_KEY=your_secret" >> .env

# Run Migrations & Start Server
python init_db.py
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will launch at `http://localhost:5173`.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

**Repository:** [GitHub Link](https://github.com/eddygreat/Meb_School_Management_system)