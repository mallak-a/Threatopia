# Threatopia Backend

A RESTful API for the **Threatopia** cybersecurity learning platform built with **Express.js** and **TypeScript**.

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file in the `backend` directory with these values:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

Example:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_12345
```

## 🛠️ Development

### Start the development server

```bash
npm run dev
```

The server runs with hot reload and serves the API under `http://localhost:5000/api`.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Database and Prisma

```bash
npm run db:migrate
npm run db:generate
npm run db:studio
npm run db:seed
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server setup
│   ├── types.ts               # TypeScript type definitions
│   ├── data.ts                # Mock database and seed data
│   ├── utils.ts               # Utility functions
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   └── routes/
│       ├── health.ts          # Health check routes
│       ├── auth.ts            # Authentication routes
│       ├── users.ts           # User profile routes
│       ├── challenges.ts      # Challenge routes
│       ├── leaderboard.ts     # Leaderboard routes
│       ├── simulations.ts     # Simulation routes
│       ├── assistant.ts       # AI assistant routes
│       └── admin.ts           # Admin routes
├── .env                       # Environment variables (not committed)
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔌 API Endpoints

### Health & status
- `GET /api/health` - health check endpoint
- `GET /api/maintenance` - maintenance status

### Authentication
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - login and obtain a JWT token

### Challenges
- `GET /api/challenges` - list all challenges
- `GET /api/challenges/:id` - get a single challenge
- `POST /api/challenges/:id/attempt` - submit a challenge attempt

### Users
- `GET /api/users/profile` - get current user profile *(protected)*
- `GET /api/users/notifications` - get user notifications *(protected)*

### Leaderboard
- `GET /api/leaderboard` - get leaderboard rankings

### AI Assistant
- `POST /api/assistant/chat` - chat with the AI assistant *(protected)*

### Simulations
- `GET /api/simulations` - list available simulations

### Admin routes *(protected, admin only)*
- `GET /api/admin/analytics` - get analytics
- `GET /api/admin/users` - list all users
- `POST /api/admin/challenges` - create a new challenge
- `PATCH /api/admin/users/:userId/role` - update a user role
- `GET /api/admin/reports/:userId` - get user reports

## 🔐 Authentication

### JWT tokens

Protected routes require a valid JWT token in the `Authorization` header.

#### Example login request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@example.com", "password": "demo123"}'
```

#### Example protected request

```bash
curl -H "Authorization: Bearer <your_jwt_token>" \
  http://localhost:5000/api/users/profile
```

#### Default test credentials

```text
User: alex@example.com
Password: demo123
Role: student

Admin: admin@threatopia.com
Password: admin123
Role: admin
```

## 📝 Notes

- The backend exposes all API routes under `/api`
- Use a strong secret for `JWT_SECRET` in production
- `.env` should never be committed to version control


- The backend currently uses **in-memory mock data** stored in `src/data.ts`
- Data is not persisted between server restarts
- A real database (MongoDB, PostgreSQL, etc.) should be added for production
- CORS is enabled to allow requests from the frontend (http://localhost:3000)
- All passwords are hashed using bcryptjs

## 🚀 Next Steps

1. **Implement Database** - Replace mock data with a real database
2. **Add Validation** - Implement request validation middleware
3. **Error Handling** - Add comprehensive error handling
4. **Testing** - Add unit and integration tests
5. **Documentation** - Generate API documentation with Swagger/OpenAPI

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [JWT.io](https://jwt.io) - JWT info and debugging
- [Bcryptjs Documentation](https://github.com/dcodeIO/bcryptjs)
- [CORS Documentation](https://github.com/expressjs/cors)

---

**Last Updated:** April 2026
