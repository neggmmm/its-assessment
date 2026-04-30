# ITS Assessment Project

A simple full-stack exam management application with role-based access for admin, HR, and employee users.

## Overview

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript + Sequelize + PostgreSQL
- **Docker:** Backend and database can run together using `docker-compose`
- **Deployment:** Frontend is designed for deployment on Vercel, while backend can be deployed via Docker.

## Features

### Admin
- Access admin dashboard
- Manage exams
- Manage questions
- Add questions to existing exams

### HR
- Access HR dashboard
- Assign exams to employees
- View assignment status
- Update assignment status

### Employee
- Access employee dashboard
- View assigned exams
- Start and complete assigned exams
- Submit exam answers

## Project Structure

```text
ITS-assessment/
├── docker-compose.yml       # Docker compose for backend and Postgres
├── frontend/                # React application
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   └── public/
└── server/                  # Express API and database models
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── .env
    └── src/
```

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Express
- Sequelize
- PostgreSQL
- Docker
- Vercel (frontend)

## Getting Started

### Clone the repository

```bash
git clone <repo-url>
cd ITS-assessment
```

### Backend with Docker

This is the recommended way to run the backend and database together.

```bash
docker compose up --build
```

After startup:
- Backend will be available on `http://localhost:8001`
- PostgreSQL will be available on `localhost:5432`

### Environment Variables

The backend expects environment variables in `server/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=its
DB_USER=postgres
DB_PASSWORD=negm
PORT=8000
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=1h
FRONTEND_URL=http://localhost:5173
```

> When deploying the frontend on Vercel, update `FRONTEND_URL` to your Vercel app URL.

### Frontend Local Development

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start at `http://localhost:5173`.

### Backend Local Development

If you prefer not to use Docker for the backend, run:

```bash
cd server
npm install
npx tsx src/index.ts
```

## Role Flow Summary

### Admin flow
1. Log in as an admin
2. View the admin dashboard
3. Create and manage exams
4. Create and manage questions
5. Add questions to exams

### HR flow
1. Log in as HR
2. View the HR dashboard
3. Assign exams to employees
4. Track assignment status
5. Accept or reject assignments

### Employee flow
1. Log in as an employee
2. View the employee dashboard
3. See assigned exams
4. Start an exam
5. Answer questions and submit

## Notes

- The backend uses a PostgreSQL database via Sequelize.
- The `docker-compose.yml` file runs the backend service and a Postgres database.
- The frontend is separated and can be deployed independently, with Vercel as a recommended target.

## Useful Commands

### Backend
```bash
cd server
npm install
npx tsx src/index.ts
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Docker Compose
```bash
docker compose up --build
```
