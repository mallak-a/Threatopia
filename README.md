# Threatopia

A cybersecurity learning platform that combines interactive challenges, guided simulations, real-time leaderboard tracking, and an AI assistant to help learners improve their security awareness.

> Threatopia is built as a modern web application with a **Next.js** frontend and an **Express + TypeScript** backend, backed by **Prisma** and **PostgreSQL**.

## 🚀 Project Overview

Threatopia provides:

- Student and instructor dashboards
- Challenge-based learning with security scenarios
- AI-driven support and recommendations
- Leaderboards for gamified progress tracking
- Admin tools for challenge and user management

## 📈 Project Status

- Status: Prototype / Active development
- Frontend: `Next.js 16`, `React 18`
- Backend: `Express`, `TypeScript`, `Prisma`
- Database: `PostgreSQL` via `Prisma`

## 📑 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Team](#team)
- [License](#license)

## 📝 About

Threatopia is designed to teach cybersecurity concepts through immersive, challenge-based practice. Learners can sign up, attempt security missions, check their progress on leaderboards, and consult an AI assistant for hints and recommendations.

The platform supports role-based access: students, instructors, and admins. The backend exposes a REST API while the frontend delivers a polished user experience using modern React patterns.

## ✨ Features

- **User authentication** with registration, login, and JWT-based protected routes
- **Challenge list and detail pages** for security missions
- **LEaderboard** with global and friends standings
- **AI Assistant** for security tips and challenge guidance
- **Simulations** to practice real-world cybersecurity scenarios
- **Admin dashboard** with analytics, user management, and challenge creation
- **Responsive UI** built with Shadcn/ui, Tailwind CSS, and Next Themes

## 💻 Tech Stack

- **Frontend:** Next.js 16, React 18, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** JWT
- **Styling:** Tailwind CSS
- **State / Data:** SWR, custom hooks
- **Dev tooling:** ESLint, ts-node-dev, cross-env

## 🏗️ Project Architecture

Threatopia follows a clean separation between frontend and backend:

- **Frontend** handles UI, routing, forms, authentication flow, and API requests.
- **Backend** exposes REST endpoints under `/api`, performs authentication, and serves challenge, user, leaderboard, assistant, simulation, and admin data.
- **Database** is managed through Prisma and migrations, with seed data for challenges, users, and leaderboard entries.

### Key architecture patterns

- RESTful API design
- Role-based access control (student / admin / instructor)
- Modular route handlers in Express
- Separation of concerns across routes, middleware, services, and UI components

## 📁 Project Structure

```
.
├── backend/                # API server and Prisma schema
├── frontend/               # Next.js application and UI
├── scripts/                # Startup helper scripts
├── package.json            # Root workspace scripts
└── README.md              # Project documentation
```

### Backend structure

- `backend/src/server.ts` — Express server setup
- `backend/src/routes/` — API route handlers
- `backend/src/middleware/auth.ts` — JWT auth middleware
- `backend/src/utils.ts` — JWT helper functions
- `backend/prisma/` — Prisma schema, migrations, and seed data

### Frontend structure

- `frontend/app/` — Next.js app routes and layouts
- `frontend/components/` — reusable UI components
- `frontend/lib/` — services, stores, and types
- `frontend/hooks/` — shared React hooks
- `frontend/styles/` — global styling and themes

## ⚙️ Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL database
- Git

## 📥 Installation

```bash
git clone <repository-url>
cd threatopia
```

Install the frontend and backend dependencies:

```bash
cd frontend
npm install
cd ../backend
npm install
```

## 🔧 Configuration

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

## 🗄️ Database Setup

From the `backend` directory:

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

If you do not use migrations yet, ensure your PostgreSQL database exists and `DATABASE_URL` is valid.

## ▶️ Running the Application

### Start both front-end and back-end together

From the repository root:

```bash
npm run dev
```

### Start frontend only

```bash
cd frontend
npm run dev
```

### Start backend only

```bash
cd backend
npm run dev
```

### Build frontend

```bash
cd frontend
npm run build
```

## 🔌 API Endpoints

- `GET /api/health` — Health check
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/challenges` — Get challenge list
- `GET /api/challenges/:id` — Get challenge detail
- `POST /api/challenges/:id/attempt` — Submit challenge attempt
- `GET /api/users/profile` — Get user profile (protected)
- `GET /api/leaderboard` — Get leaderboard data
- `POST /api/assistant/chat` — AI assistant chat (protected)
- `GET /api/simulations` — Get available simulations
- `GET /api/admin/analytics` — Admin analytics (admin only)
- `GET /api/admin/users` — Get all users (admin only)

## 👥 Team

- Khaled Ahmed Asaad 
- Mahmoud Ehab Saber
- Mahmoud Mohamed Mahmoud  
- Zeyad Mahmoud Khalifa 
- Mallak Ahmed Mostafa  
- Zeyad Mohamed Abdelaleem 
- Omar Waheed Omar  
- Sama Walid  
- Basmla Mohammed  

## 📄 License

This project is available under the terms of the LICENSE file or your chosen open-source license.
