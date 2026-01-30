# Vel Tech High Tech - AI & DS Department Portal

## Prerequisites
- Python 3.8+
- Node.js 16+

## Setup

### Backend
1. Navigate to the root directory.
2. Create & activate a virtual environment (Windows PowerShell):
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies into the active venv:
   ```powershell
   python -m pip install -r backend/requirements.txt
   ```
4. Seed the database (development only — this **removes and recreates** the local DB):
   ```powershell
   python -m backend.seed
   ```
5. Run the server:
   ```powershell
   uvicorn backend.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Features
- **Authentication**: Role-based login (Admin, Faculty, Student).
- **Dashboards**: tailored views for each role.
- **Curriculum**: View courses by semester.
- **Announcements**: Global and Department-specific announcements.
