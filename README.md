# University Management System

A multi-role university management platform built with the MERN stack. Three separate portals — Admin, Instructor, and Student — with role enforcement at the **API level**, not just the UI.

**Live demo:** Backend on Render, Frontend on Vercel

---

## Roles

| Role | Capabilities |
|---|---|
| **Admin** | Create instructor accounts, register courses, manage the full system |
| **Instructor** | View assigned courses and enrolled students, mark daily attendance, post and view marks by exam type |
| **Student** | Self-register for courses, view attendance records, view marks filtered by course and exam type |

## Features

- JWT-based authentication with role stored in the token
- **API-level role enforcement** — four separate route groups (`/v1/api/admin`, `/v1/api/instructor`, `/v1/api/student`, `/v1/api/course`) each with Express middleware that reads the role from the JWT and blocks unauthorized requests at the server. Changing roles in the UI doesn't grant access.
- Admin-only instructor provisioning — only admins can create instructor accounts
- Instructor marks attendance per course; posts marks by exam type (Quiz, Assignment, Mid Term, Final Term)
- Student data updates instantly — React re-fetches on every route mount so grades and attendance are always current

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (CRA), Bootstrap |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT |
| Frontend deploy | Vercel |
| Backend deploy | Render |

## Local Setup

**Prerequisites:** Node.js 18+, MongoDB Atlas account

```bash
git clone https://github.com/khichar-monika15/university-management-system.git
cd university-management-system

# Backend
cd server
npm install
# Fill in server/.env: DATABASE_CONNECTION_STRING=<your Atlas URI>, PORT=4000
node index.js    # runs on http://localhost:4000

# Frontend (new terminal)
cd ../client
npm install
# client/.env is pre-filled for local dev (REACT_APP_API_URL=http://localhost:4000/v1/api/)
npm start        # runs on http://localhost:3000
```

## Deployment

**Backend (Render):**
1. New Web Service, root directory = `server/`
2. Build command: `npm install`
3. Start command: `node index.js`
4. Environment variables: `DATABASE_CONNECTION_STRING`, `PORT`

**Frontend (Vercel):**
1. Root directory = `client/`
2. Build command: `npm run build`, output directory: `build`
3. Environment variable: `REACT_APP_API_URL` = `https://your-render-service.onrender.com/v1/api/`

## Environment Variables

See `server/.env` and `client/.env` for templates with placeholder values.
