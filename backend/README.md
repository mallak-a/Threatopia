# Threatopia Backend

A RESTful API for the **Threatopia** cybersecurity learning platform built with **Express.js** and **TypeScript**.

## 🚀 Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd threatopia/backend
```

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

**Example `.env` file:**
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_jwt_key_12345
```

## 🛠️ Development

### Start Development Server

Run the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:5000/api` and will automatically restart on file changes.

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Start Production Server

Start the built application:

```bash
npm start
```

## 📦 Dependencies

### Core Framework
- **Express.js** - Minimal and flexible Node.js web application framework
- **TypeScript** - Typed superset of JavaScript for better type safety
- **ts-node-dev** - TypeScript development server with auto-reload

### Security & Authentication
- **bcryptjs** - Password hashing library
- **jsonwebtoken (JWT)** - Token-based authentication
- **cors** - Cross-Origin Resource Sharing middleware

### Utilities
- **dotenv** - Environment variable management

### Development Tools
- **@types/node** - TypeScript types for Node.js
- **@types/express** - TypeScript types for Express.js
- **@types/bcryptjs** - TypeScript types for bcryptjs
- **@types/cors** - TypeScript types for cors
- **@types/jsonwebtoken** - TypeScript types for JWT

## 📂 Project Structure

```
backend/
├── src/
│   ├── server.ts              # Main Express server setup
│   ├── types.ts               # TypeScript type definitions
│   ├── data.ts                # Mock database (in-memory data)
│   ├── utils.ts               # Utility functions
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication middleware
│   └── routes/
│       ├── health.ts          # Health check routes
│       ├── auth.ts            # Authentication routes (login, register)
│       ├── users.ts           # User profile routes
│       ├── challenges.ts      # Challenge routes
│       ├── leaderboard.ts     # Leaderboard routes
│       ├── simulations.ts     # Simulation routes
│       ├── assistant.ts       # AI assistant routes
│       └── admin.ts           # Admin routes
├── .env                       # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔌 API Endpoints

### Health & Status
- `GET /api/health` - Health check endpoint
- `GET /api/maintenance` - Maintenance status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token

### Challenges
- `GET /api/challenges` - Get all challenges
- `GET /api/challenges/:id` - Get a specific challenge
- `POST /api/challenges/:id/attempt` - Submit a challenge attempt

### Users
- `GET /api/users/profile` - Get current user profile *(protected)*
- `GET /api/users/notifications` - Get user notifications *(protected)*

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard rankings

### AI Assistant
- `POST /api/assistant/chat` - Chat with AI assistant *(protected)*

### Simulations
- `GET /api/simulations` - Get available simulations

### Admin Routes *(protected - admin only)*
- `GET /api/admin/analytics` - Get platform analytics
- `GET /api/admin/users` - Get all users
- `POST /api/admin/challenges` - Create new challenge
- `PATCH /api/admin/users/:userId/role` - Update user role
- `GET /api/admin/reports/:userId` - Get user reports

## 🔐 Authentication

### JWT Tokens

The API uses **JWT (JSON Web Tokens)** for authentication on protected routes.

#### How to authenticate:

1. **Register/Login** to get a token:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "alex@example.com", "password": "demo123"}'
   ```

2. **Include token** in protected requests:
   ```bash
   curl -H "Authorization: Bearer <your_jwt_token>" \
     http://localhost:5000/api/users/profile
   ```

#### Protected Routes

The following routes require a valid JWT token in the `Authorization` header:
- `/api/users/*` - All user routes
- `/api/assistant/*` - All assistant routes
- `/api/admin/*` - All admin routes (admin role required)

#### Default Test Credentials

```
User: alex@example.com
Password: demo123
Role: student

Admin: admin@threatopia.com
Password: admin123
Role: admin
```

## 📝 Notes

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
