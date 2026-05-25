# Project Tracker App

A full-stack web application built to manage and track projects. This application was developed as part of the Forward Deployed Engineer (FDE) Upskilling program.

## Tech Stack

This project is a classic full-stack application demonstrating the integration of a modern Python backend with a reactive JavaScript frontend.

*   **Backend:**
    *   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - A high-performance Python web framework for building APIs.
    *   **Database:** [SQLite](https://www.sqlite.org/index.html) - A lightweight, file-based SQL database.
    *   **ORM:** [SQLAlchemy](https://www.sqlalchemy.org/) - The Python SQL Toolkit and Object Relational Mapper.

*   **Frontend:**
    *   **Library:** [React](https://react.dev/) - A JavaScript library for building user interfaces.
    *   **Build Tool:** [Vite](https://vitejs.dev/) - A next-generation frontend tooling that provides a faster and leaner development experience.

## Features

*   **Full CRUD Operations:** Create, read, update, and delete projects.
*   **Upsert Logic:** Adding a project with an existing name will update its status instead of creating a duplicate.
*   **Commenting System:** Add and view comments on individual projects.
*   **Clean UI:** A modern and responsive user interface for a great user experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine or in a cloud environment like GitHub Codespaces.

### Prerequisites

*   Python 3.10+
*   Node.js and npm

### Setup & Running the Application

The application consists of two main parts: the backend API and the frontend UI. They must be run in separate terminals.

#### 1. Backend (FastAPI)

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install the required dependencies
# Note: You may need to create a requirements.txt file first
pip install fastapi uvicorn[standard] sqlalchemy python-multipart

# Run the development server from the project root (project-tracker-app)
uvicorn backend.main:app --reload
```
The backend will be running on `http://127.0.0.1:8000`.

#### 2. Frontend (React)

```bash
# In a new terminal, navigate to the frontend UI directory
cd frontend/fde_ui

# Install the required dependencies
npm install

# Run the development server
npm run dev
```
The frontend will be running on `http://127.0.0.1:5173`.