<p align="center">
  <img src="./Primary%20Black%20BgRemover.png" alt="Threatopia logo" width="240" />
</p>

# Threatopia

A cybersecurity learning platform that combines interactive challenges, guided simulations, real-time leaderboard tracking, and an AI assistant to help learners improve their security awareness.

> Threatopia is built as a modern web application with a **Next.js** frontend and an **Express + TypeScript** backend, backed by **Prisma** and **PostgreSQL**.

---

## 🚀 Quick Start

Get Threatopia running in 5 minutes:

```bash
git clone <repository-url>
cd threatopia

# 1. Install all dependencies
cd frontend && npm install && cd ../backend && npm install && cd ..

# 2. Configure the database
cp backend/.env.example backend/.env
#    → Open backend/.env and fill in your DATABASE_URL and JWT_SECRET

# 3. Create tables, run migrations, and seed sample data (one command)
npm run setup-db

# 4. Start the full application
npm run dev
```

Visit **http://localhost:3000** and log in with `alex@example.com` / `demo123`

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [Team](#-team)
- [License](#-license)

---

## 📝 About

Threatopia is designed to teach cybersecurity concepts through immersive, challenge-based practice. Learners can sign up, attempt security missions, check their progress on leaderboards, and consult an AI assistant for hints and recommendations.

The platform supports role-based access: **students**, **instructors**, and **admins**. The backend exposes a REST API while the frontend delivers a polished user experience using modern React patterns.

---

## ✨ Features

- **User authentication** — registration, login, and JWT-protected routes
- **Challenge list and detail pages** — hands-on security missions across 6 categories
- **Leaderboard** — global standings with ranks, points, and levels
- **AI Assistant** — cybersecurity tips and challenge guidance (powered by a Python chatbot)
- **URL Detection** — real-time phishing URL analysis (Python ML model)
- **Simulations** — practice real-world cybersecurity scenarios
- **Admin dashboard** — analytics, user management, and challenge creation
- **Profile management** — avatar upload with in-browser crop/zoom/rotate
- **Responsive UI** — built with Shadcn/ui, Tailwind CSS v4, Framer Motion, and Three.js

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 18, TypeScript, Tailwind CSS v4 |
| **UI Components** | Shadcn/ui (Radix UI), Framer Motion, Three.js |
| **State management** | Zustand (with persistence) |
| **Backend** | Node.js, Express 4, TypeScript |
| **Database ORM** | Prisma 7 with `@prisma/adapter-pg` |
| **Database** | PostgreSQL |
| **Authentication** | JWT (jsonwebtoken + bcryptjs) |
| **File uploads** | Multer (profile photos → `/uploads/`) |
| **AI services** | Python 3 (chatbot + URL phishing detection) |
| **Dev tooling** | ts-node-dev, tsx, cross-env, ESLint |

---

## 🏗️ Project Architecture

Threatopia follows a clean separation between frontend and backend:

- **Frontend** handles UI, routing, forms, authentication flow, and API requests. It uses a **real API → mock data failover** pattern so the app works even when the backend is offline.
- **Backend** exposes REST endpoints under `/api`, performs authentication with JWT middleware, and delegates challenge, user, leaderboard, assistant, simulation, admin, and URL-detection data to Prisma.
- **Database** is managed through Prisma migrations, with seed data for challenges, users, and leaderboard entries.
- **Python services** (`ChatBot/` and `URL Detection/`) are spawned as child processes by the Express routes.

### Key architecture patterns

- RESTful API design with JSON responses (`{ success, data } | { success, error }`)
- Role-based access control — `student` / `instructor` / `admin`
- Modular route handlers in Express
- Separation of concerns across routes, middleware, data layer, and UI components
- API failover pattern (frontend falls back to mock data if backend is unreachable)

---

## 📁 Project Structure

```
.
├── backend/                # Express API + Prisma schema
├── frontend/               # Next.js application and UI
├── ChatBot/                # Python AI chatbot (chatbot.py)
├── URL Detection/          # Python phishing URL detector (app.py)
├── scripts/                # Startup and setup helper scripts
├── package.json            # Root workspace scripts
└── README.md               # This file
```

### Backend structure

```
backend/
├── src/
│   ├── server.ts           # Express server, route mounting
│   ├── data.ts             # Prisma data-access layer (all CRUD wrappers)
│   ├── types.ts            # Shared TypeScript types and interfaces
│   ├── utils.ts            # JWT helper functions (sign / verify)
│   ├── lib/
│   │   └── prisma.ts       # Singleton Prisma client
│   ├── middleware/
│   │   └── auth.ts         # authMiddleware + adminMiddleware
│   └── routes/
│       ├── health.ts
│       ├── auth.ts
│       ├── users.ts
│       ├── challenges.ts
│       ├── leaderboard.ts
│       ├── assistant.ts
│       ├── simulations.ts
│       ├── url-detection.ts
│       └── admin.ts
└── prisma/
    ├── schema.prisma       # Database schema and enums
    ├── seed.ts             # Sample data seeder
    └── migrations/         # Auto-generated migration history
```

### Frontend structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # /login, /register, /forgot-password, /reset-password
│   ├── (dashboard)/        # /dashboard, /challenges, /leaderboard, /assistant, /profile
│   ├── (admin)/            # /admin (role-guarded)
│   ├── about/ contact/ faq/ learn/ resources/
│   ├── layout.tsx          # Root layout (fonts, theme, floating AI, toasts)
│   └── globals.css         # Cyber-Grid dark theme tokens and utilities
├── components/
│   ├── admin/              # Admin sidebar and header
│   ├── dashboard/          # Dashboard sidebar and header
│   ├── landing/            # Hero, Features, ChallengesPreview, CTA sections
│   ├── layout/             # Navbar and Footer
│   ├── three/              # Three.js 3D components (CyberShield)
│   └── ui/                 # 57 Shadcn/ui primitives
├── lib/
│   ├── services/api.ts     # API service layer with mock failover
│   ├── services/mock-data.ts
│   ├── stores/auth-store.ts # Zustand auth + profile store
│   └── types/index.ts      # Frontend TypeScript types
├── hooks/                  # use-mobile, use-toast
└── public/                 # Static assets and icons
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** — a running database instance (local or cloud)
- **Python 3** — required for the AI chatbot and URL detection features
- **Git**

---

## 📥 Installation

```bash
git clone <repository-url>
cd threatopia
```

Install frontend and backend dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
cd ..
```

---

## 🔧 Configuration

### Backend — `backend/.env`

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set the following:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/threatopia
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### Frontend — `frontend/.env.local`

This file already exists with a default value. Update it if your backend runs on a different host or port:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database Setup

### Automatic Setup (Recommended)

Run the single setup command from the repository root **after** configuring `backend/.env`:

```bash
npm run setup-db
```

This script will:

1. ✅ Validate your `backend/.env` file exists and `DATABASE_URL` is set
2. ✅ Generate the Prisma client (`prisma generate`)
3. ✅ Apply all database migrations (`prisma migrate deploy`) — creates all tables
4. ✅ Seed the database with sample users, challenges, leaderboard entries, and simulations

> **First-time setup note:** If this is a brand-new database, you must first create the migration history. Run this **once** from inside the `backend/` directory, then switch back to using `npm run setup-db` for everything else:
> ```bash
> cd backend
> npx prisma migrate dev --name init
> cd ..
> npm run setup-db
> ```

### Manual Setup

If you prefer step-by-step control, run these from the `backend/` directory:

```bash
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Apply migrations (interactive, dev mode)
npm run db:seed        # Seed with sample data
npm run db:studio      # Open Prisma Studio (database browser)
```

### Demo Accounts

After seeding, these accounts are available:

| Role | Email | Password |
|---|---|---|
| Student | `alex@example.com` | `demo123` |
| Student | `sarah@example.com` | `demo123` |
| Admin | `admin@threatopia.com` | `admin123` |

### Troubleshooting

**`backend/.env` not found:**
```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your credentials
```

**Database connection error:**
- Ensure PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Ensure the database user has `CREATE` and `ALTER` privileges

**Migration errors / corrupted state:**
```bash
cd backend
npx prisma migrate reset --force   # ⚠️ Drops and recreates the database
cd ..
npm run setup-db
```

**Port conflicts:**
- Backend: port `5000` — change `PORT` in `backend/.env`
- Frontend: port `3000` — pass `--port` flag in `frontend/package.json`

---

## ▶️ Running the Application

### Start everything together (recommended)

```bash
npm run dev
```

Starts both frontend (http://localhost:3000) and backend (http://localhost:5000) simultaneously with colour-coded log prefixes.

### Start individually

```bash
# Frontend only
cd frontend && npm run dev

# Backend only
cd backend && npm run dev
```

### Build for production

```bash
cd frontend && npm run build
cd ../backend && npm run build
```

---

## 🔌 API Endpoints

All endpoints are under `/api`. Protected routes require `Authorization: Bearer <token>`.

### Health
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

### Authentication
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |

### Users *(protected)*
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/users/profile` | Get current user profile |
| `GET` | `/api/users/notifications` | Get user notifications |
| `POST` | `/api/users/upload-profile-photo` | Upload and save profile avatar (multipart/form-data) |

### Challenges
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/challenges` | List challenges (filterable by `?category=&difficulty=`) |
| `GET` | `/api/challenges/:id` | Get a single challenge |
| `POST` | `/api/challenges/:id/attempt` | Submit a challenge attempt *(protected)* |

### Leaderboard
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/leaderboard` | Get leaderboard (`?type=global\|friends`) |

### AI Assistant *(protected)*
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/assistant/chat` | Chat with the AI assistant |

### URL Detection *(protected)*
| Method | Path | Description |
|---|---|---|
| `POST` | `/api/url-detection/check` | Check if a URL is phishing or safe |

### Simulations
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/simulations` | List available simulations |

### Admin *(protected, admin role required)*
| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/analytics` | Platform-wide analytics |
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/challenges` | Create a new challenge |
| `PATCH` | `/api/admin/users/:userId/role` | Update a user's role |
| `GET` | `/api/admin/reports/:userId` | Get a user progress report |

---

## 🐍 Python Services

Threatopia includes two Python-powered services invoked by the Express backend:

### AI Chatbot (`ChatBot/chatbot.py`)

Answers cybersecurity questions. Called by `POST /api/assistant/chat`. Falls back to keyword-based responses if Python is unavailable.

### URL Detection (`URL Detection/app.py`)

Classifies URLs as phishing or safe using a trained ML model on the included `processed_phishing_data.csv` dataset. Called by `POST /api/url-detection/check`.

Make sure Python 3 is installed and the required Python packages are available for full functionality.

---

## 📈 Project Status

| Area | Status |
|---|---|
| Frontend | ✅ Active development |
| Backend REST API | ✅ Complete |
| Database (Prisma + PostgreSQL) | ✅ Complete |
| AI Chatbot | ✅ Functional |
| URL Detection | ✅ Functional |
| Profile photo upload | ✅ Complete |
| Admin dashboard | ✅ Complete |

---

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

---

## 📄 License

This project is available under the terms of the LICENSE file or your chosen open-source license.
