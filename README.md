# TaskFlow — Team Task Manager

## Live Application
https://taskflow-frontend-production-1b90.up.railway.app

## GitHub Repositories
Frontend: https://github.com/samir904/taskflow-frontend
Backend:  https://github.com/samir904/taskflow-backend

## Tech Stack
- Frontend: React.js, Redux Toolkit, Tailwind CSS, Vite
- Backend:  Node.js, Express.js, MongoDB, Mongoose
- Auth:     JWT (JSON Web Tokens)
- Deploy:   Railway

## Features
- JWT Authentication (Signup / Login)
- Role-Based Access Control (Admin / Member)
- Project Management (Create, Edit, Delete)
- Team Management (Add / Remove Members)
- Task Management (Create, Assign, Priority, Due Date)
- Task Status Tracking (To Do / In Progress / Done)
- Overdue Task Detection
- Dashboard with Analytics

## Role Permissions
Admin:
  - Create/delete projects
  - Add/remove team members
  - Create/assign/delete tasks
  - View dashboard analytics

Member:
  - View assigned projects
  - Update task status only

## Local Setup

### Backend
cd BACKEND
npm install
Create .env file with:
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_secret
  PORT=5014
  NODE_ENV=development
  CLIENT_URL=http://localhost:5173
npm run dev

### Frontend
cd FRONTEND
npm install
Create .env file with:
  VITE_API_URL=http://localhost:5014/api
npm run dev

## API Endpoints
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/dashboard/stats

## Deployment
Both services deployed on Railway.
Environment variables configured via Railway dashboard.
Frontend auto-builds via Vite on each push.