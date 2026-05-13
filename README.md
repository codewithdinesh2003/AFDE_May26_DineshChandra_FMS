# FeedbackHub — Feedback Management System ![Phase 1](https://img.shields.io/badge/Phase-1-6366F1?style=flat-square)

A production-grade full-stack Feedback Management System built with FastAPI, React (Vite), and MySQL. Enables collecting, viewing, searching, and managing participant feedback with a premium enterprise UI.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, React Router v6, Axios  |
| Styling    | Tailwind CSS, Custom CSS (glass morphism) |
| Icons      | Lucide React                            |
| Fonts      | Sora (headings), DM Sans (body)         |
| Backend    | Python FastAPI, Uvicorn                 |
| ORM        | SQLAlchemy 2.0                          |
| Database   | MySQL (via PyMySQL driver)              |
| Validation | Pydantic v2                             |

---

## Features

- **Dashboard** — Live stats (total feedback, average rating, top program, weekly count), rating distribution bar chart, recent submissions
- **Submit Feedback** — Validated form with interactive star rating, character counter, and toast notifications
- **All Feedback** — Paginated grid (9/page) with search by keyword, filter by rating, filter by program
- **Feedback Detail** — Full-page view with edit (inline modal) and delete (confirm dialog)
- **CRUD API** — 6 REST endpoints with proper HTTP status codes and error handling
- **Search** — Full-text LIKE search across participant name, program, and comments
- **Loading States** — Skeleton loaders on all data fetches
- **Empty States** — Contextual messages when no data is found
- **Responsive** — Works on mobile (320px) → tablet → desktop
- **Toast Notifications** — Custom success/error toasts (no external library)

---

## Folder Structure

```
FMS-project/
├── backend/
│   ├── main.py             # FastAPI app entry point
│   ├── database.py         # SQLAlchemy engine + session
│   ├── models.py           # Feedback ORM model
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database operations
│   ├── routers/
│   │   └── feedback.py     # API routes
│   ├── requirements.txt
│   ├── .env                # Your credentials (not committed)
│   └── .env.example        # Template
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # API wrapper functions
│   │   ├── api.js          # Axios base instance
│   │   ├── App.jsx         # Router + Toast system
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server running locally

### 1. Create the database
```sql
CREATE DATABASE fms_db;
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
uvicorn main:app --reload
```
Backend runs at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint               | Description                         |
|--------|------------------------|-------------------------------------|
| GET    | `/`                    | Health check                        |
| GET    | `/api/feedback`        | List all feedback (pagination)      |
| GET    | `/api/feedback/stats`  | Dashboard statistics                |
| GET    | `/api/feedback/{id}`   | Get feedback by ID                  |
| POST   | `/api/feedback`        | Create new feedback (201)           |
| PUT    | `/api/feedback/{id}`   | Update feedback                     |
| DELETE | `/api/feedback/{id}`   | Delete feedback (204)               |
| GET    | `/api/search`          | Search: ?keyword=&rating=&program_name= |

---

## Database Schema

| Column           | Type        | Constraints                   |
|------------------|-------------|-------------------------------|
| feedback_id      | INT         | PK, AUTO_INCREMENT            |
| participant_name | VARCHAR(255)| NOT NULL                      |
| program_name     | VARCHAR(255)| NOT NULL                      |
| rating           | INT         | NOT NULL, CHECK (1–5)         |
| comments         | TEXT        | NULLABLE                      |
| submitted_at     | DATETIME    | DEFAULT CURRENT_TIMESTAMP     |

---

## Screenshots

- <img width="1919" height="894" alt="Screenshot 2026-05-13 134250" src="https://github.com/user-attachments/assets/6a936914-4a90-4b81-aac7-5b9e8393e775" />

- <img width="1919" height="889" alt="image" src="https://github.com/user-attachments/assets/c515b5d1-3a87-4c1f-ae73-30293d435006" />
`
- <img width="1919" height="893" alt="image" src="https://github.com/user-attachments/assets/f593c523-5d75-4a50-88d7-e7c5e4fa86b2" />
`
- <img width="1919" height="897" alt="image" src="https://github.com/user-attachments/assets/900879f9-edeb-4e51-adb6-662e04ebf954" />
`

---

## Author

| Field    | Value                        |
|----------|------------------------------|
| Author   | _Vustela Dinesh Chandra_                |
| Batch    | _May2026 AFDE_      |
| Project  | FMS Phase 1 — Capstone       |
| Year     | 2026                         |
