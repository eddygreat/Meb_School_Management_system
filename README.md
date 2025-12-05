# MEB School Management System

# Link to Projects Pitch Deck
https://www.canva.com/design/DAG580EMfGY/eTk0SH85kiJdpDtewp3GWA/edit?utm_content=DAG580EMfGY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

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
*   **Deployment:** [Netlify](https://mebschoolmanagementsystem.netlify.app)

**Backend:**
*   **Python:** A versatile programming language for the server-side logic.
*   **FastAPI/Flask:** A high-performance web framework for building APIs.
*   **Gunicorn:** A Python WSGI HTTP Server for UNIX.
*   **Uvicorn:** An ASGI server, for use with FastAPI.
*   **SQLAlchemy:** A SQL toolkit and Object-Relational Mapper (ORM).
*   **Deployment:** [Render](https://render.com/)
*   **AI Integration:** [Google Gemini API](https://ai.google.dev/) (Generative AI & Vision)

## Key Features

### 🤖 Advanced AI Automation
The application now integrates **Google Gemini 1.5 Flash** to provide cutting-edge AI capabilities:

1.  **AI-Powered Face Recognition**:
    - Uses **Gemini Vision** to securely verify user identity during login.
    - Compares live camera input with enrolled photos using multimodal AI analysis, eliminating the need for heavy local libraries.

2.  **Intelligent Auto-Grading**:
    - **Teachers** can instantly grade assignments by providing the question, student answer, and an optional rubric.
    - The AI analyzes the answer and provides a **Score (0-10)**, **Detailed Feedback**, and **Improvement Tips**.

3.  **Personalized Study Guides**:
    - **Students** can generate custom study plans based on their recent grades and performance.
    - The AI identifies weak areas and suggests specific topics to focus on.

4.  **Performance Prediction**:
    - Analyzes student history (grades, attendance) to predict future performance.

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
    gunicorn --config app/gunicorn_conf.py app:app
    ```
5.  **Configure Environment Variables**:
    Create a `.env` file in the `backend` directory and add your Gemini API key:
    ```properties
    GEMINI_API_KEY=your_api_key_here
    ```

## Repository

The source code for this project is available on GitHub: https://github.com/eddygreat/Meb_School_Management_system

## This repository includes the pitch deck
MEB SMS Pitch Deck