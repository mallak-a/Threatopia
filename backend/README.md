# Threatopia Backend

A RESTful API for the **Threatopia** cybersecurity learning platform, built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** — a running database instance
- **Python 3** — for the AI chatbot and URL detection services

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/threatopia
```

---

## 🗄️ Database Setup

From the **repository root**, run the automated setup script:

```bash
npm run setup-db
```

This will:
1. Generate the Prisma client
2. Apply all database migrations (creates all tables)
3. Seed the database with sample users, challenges, and leaderboard data

### Manual commands (from `backend/` directory)

```bash
npm run db:generate    # Generate Prisma client from schema.prisma
npm run db:migrate     # Apply database migrations (interactive dev mode)
npm run db:seed        # Seed with sample data
npm run db:studio      # Open Prisma Studio (visual database browser)
```

### Demo accounts (created by the seed)

| Role | Email | Password |
|---|---|---|
| Student | `alex@example.com` | `demo123` |
| Student | `sarah@example.com` | `demo123` |
| Admin | `admin@threatopia.com` | `admin123` |

---

## 🛠️ Development

### Start the development server

```bash
npm run dev
```

Starts with hot reload via `ts-node-dev`. The server listens at **http://localhost:5000/api**.

### Build for production

```bash
npm run build    # Compiles TypeScript to dist/
npm start        # Runs the compiled dist/server.js
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Express app, CORS, route mounting
│   ├── data.ts                # Data-access layer (all Prisma CRUD wrappers)
│   ├── types.ts               # Shared TypeScript interfaces and types
│   ├── utils.ts               # JWT sign / verify helpers
│   ├── lib/
│   │   └── prisma.ts          # Singleton Prisma client (with pg adapter)
│   ├── middleware/
│   │   └── auth.ts            # authMiddleware + adminMiddleware
│   └── routes/
│       ├── health.ts          # GET /api/health
│       ├── auth.ts            # POST /api/auth/register, /login
│       ├── users.ts           # GET /profile, /notifications, POST /upload-profile-photo
│       ├── challenges.ts      # GET /, /:id   POST /:id/attempt
│       ├── leaderboard.ts     # GET /
│       ├── assistant.ts       # POST /chat  (spawns Python chatbot)
│       ├── url-detection.ts   # POST /check (spawns Python URL detector)
│       ├── simulations.ts     # GET /
│       └── admin.ts           # Analytics, users, challenges, reports
├── prisma/
│   ├── schema.prisma          # Database schema — models and enums
│   ├── seed.ts                # Sample data seeder (tsx)
│   └── migrations/            # Auto-generated migration history
├── uploads/                   # Profile photo upload directory (git-ignored)
├── .env                       # Environment variables (not committed)
├── .env.example               # Template for .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗃️ Database Schema

The Prisma schema defines the following models:

| Model | Description |
|---|---|
| `User` | Core user account (name, email, hashed password, role, avatar) |
| `UserProfile` | Points, level, badges, skill scores, streak, completed challenges |
| `Challenge` | Security challenges with category, difficulty, hints, code snippets |
| `ChallengeAttempt` | Per-user attempt record with correctness and points earned |
| `LeaderboardEntry` | Global rankings with rank, points, and level |
| `Simulation` | Simulation scenarios with status and duration |
| `Notification` | In-app notifications for achievements, challenges, and system events |

### Enums

- `UserRole` — `student` | `instructor` | `admin`
- `AgeGroup` — `teen` | `student` | `professional`
- `ChallengeCategory` — `phishing` | `sql_injection` | `password_security` | `social_engineering` | `malware` | `network_security`
- `ChallengeDifficulty` — `beginner` | `intermediate` | `advanced` | `expert`
- `UserStatus` — `active` | `inactive` | `banned`
- `SimulationStatus` — `available` | `coming_soon` | `maintenance`

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Health
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Server health check |

### Authentication
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register new user (creates profile) |
| `POST` | `/api/auth/login` | — | Login and receive JWT |

### Users
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | ✅ | Get current user profile |
| `GET` | `/api/users/notifications` | ✅ | Get user notifications |
| `POST` | `/api/users/upload-profile-photo` | ✅ | Upload avatar (multipart/form-data, max 5 MB) |

### Challenges
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/challenges` | — | List challenges (filter by `?category=&difficulty=`) |
| `GET` | `/api/challenges/:id` | — | Get a single challenge |
| `POST` | `/api/challenges/:id/attempt` | ✅ | Submit a challenge attempt |

### Leaderboard
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/leaderboard` | — | Global leaderboard (`?type=global\|friends`) |

### AI Assistant
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/assistant/chat` | ✅ | Chat with the Python AI chatbot |

### URL Detection
| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/url-detection/check` | — | Classify a URL as phishing or safe (public) |

### Simulations
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/simulations` | — | List available simulations |

### Admin *(admin role required)*
| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/analytics` | ✅ admin | Platform-wide analytics |
| `GET` | `/api/admin/users` | ✅ admin | List all users |
| `POST` | `/api/admin/challenges` | ✅ admin | Create a new challenge |
| `PATCH` | `/api/admin/users/:userId/role` | ✅ admin | Update a user's role |
| `GET` | `/api/admin/reports/:userId` | ✅ admin | Get user progress report |

---

## 🔐 Authentication

Protected routes require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are issued at login and expire after **7 days**.

### Example login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@example.com", "password": "demo123"}'
```

### Example protected request

```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users/profile
```

---

## 📝 Notes

- All API responses use the shape `{ success: true, data: ... }` or `{ success: false, error: "..." }`
- Category values in the database use `snake_case` (e.g. `sql_injection`); the frontend types use `kebab-case` — the data layer normalises this automatically
- Uploaded profile photos are stored in `backend/uploads/` and served at `/uploads/<filename>`
- Use a strong random string for `JWT_SECRET` in production
- Never commit `.env` to version control

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [JWT.io](https://jwt.io)
- [Bcryptjs](https://github.com/dcodeIO/bcryptjs)

---

**Last Updated:** April 2026
