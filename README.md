# MEB School Management System

## About The Project

MEB School Management System is a modern, web-based application designed to digitize and simplify the complex operations of educational institutions. It provides a centralized platform for administrators, teachers, students, and parents to manage academic and administrative tasks efficiently.

The system aims to reduce manual paperwork, improve communication, and provide real-time access to important information such as grades, attendance, fees, and school announcements, thereby fostering a more transparent and collaborative educational environment.

## Sustainable Development Goal (SDG)

This project directly contributes to **Sustainable Development Goal 4: Quality Education**.

By providing accessible digital tools for school administration, the system helps improve the efficiency and effectiveness of educational institutions. This allows educators to focus more on teaching and student development, ultimately enhancing the quality of education delivered.

## Built With

This project leverages a modern technology stack for a robust and scalable solution.

**Frontend:**
*   **React.js:** A JavaScript library for building user interfaces.
*   **Vite:** A next-generation frontend tooling for fast development.
*   **Axios:** A promise-based HTTP client for making API requests.
*   **Deployment:** [Netlify](https://www.netlify.com/)

**Backend:**
*   **Python:** A versatile programming language for the server-side logic.
*   **FastAPI/Flask:** A high-performance web framework for building APIs.
*   **Gunicorn:** A Python WSGI HTTP Server for UNIX.
*   **Uvicorn:** An ASGI server, for use with FastAPI.
*   **SQLAlchemy:** A SQL toolkit and Object-Relational Mapper (ORM).
*   **Deployment:** [Render](https://render.com/)

## Project Status

The project is currently in **Frontend-Only Demonstration Mode**.

### Reason for Current Mode

During deployment of the backend service to the Render free tier, we encountered persistent memory limitations (`Out of Memory` errors) that prevented the Python server from running reliably. To ensure the frontend user experience and application flow can still be fully demonstrated, we have pivoted to a simulated backend approach.

This allows for a complete walkthrough of the user interface, role-based access control, and component interactions without being blocked by backend server issues.

### How the Simulation Works

*   **User Signup:** The signup form collects user information and displays a "Signup Successful" message upon submission. It does not send data to a backend.
*   **User Login:** The login form simulates a successful authentication for any provided credentials. Upon login, a mock user session is created and stored in the browser's local storage.
*   **Role-Based Access:** On visiting the site, a "Role Switcher" component is available. This allows you to dynamically change the user's role between `Admin`, `Student`, `Teacher`, and `Parent` to explore the different views and permissions available to each role. Please note, this is a temporary feature for demonstration purposes. In a production environment, user roles would be assigned by an administrator and would not be user-changeable.
*   **Simulated API Calls:** Pages like the Admin User Management dashboard simulate asynchronous data fetching, complete with loading spinners and error states, to demonstrate professional data handling practices.
*   **Feature-Rich UI:** Key features, such as the multi-step "Face Enrollment" process, have a complete and polished user interface to showcase the full vision of the application.

This approach ensures that development and demonstration of the frontend can continue smoothly while the backend deployment issues are addressed separately.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (for the frontend)
    ```sh
    npm install npm@latest -g
    ```
*   Python and pip (for the backend)

### Frontend Installation

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Run the development server:
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Backend Installation

1.  Navigate to the `backend` directory.
2.  Create and activate a virtual environment.
3.  Install Python packages:
    ```sh
    pip install -r requirements.txt
    ```
4.  Run the server using Gunicorn (replace `app:app` with your actual application entrypoint if different):
    ```sh
    gunicorn --config app/gunicorn_conf.py app:app
    ```

## Repository

The source code for this project is available on GitHub: https://github.com/eddygreat/Meb_School_Management_system