# Threatopia

This repository contains the Threatopia frontend (Next.js) and backend (Node.js + Express).

## Run the full application

```bash
cd d:\Education\SUT\Subjects\Year 2\Project\Coding\threatopia\frontend
npm install
cd ..\backend
npm install
cd ..
npm run dev
```

This starts both:
- frontend: `http://localhost:3000`
- backend: `http://localhost:5000/api`

## Available commands

- `npm run dev` — run frontend and backend together
- `npm run dev:frontend` — run only the frontend
- `npm run dev:backend` — run only the backend
- `npm run build` — build the Next.js frontend

## Important notes

- The frontend reads API requests from `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- The backend uses JWT auth for protected endpoints
- Protected routes include `/api/users`, `/api/assistant`, and `/api/admin`
