# Threatopia Frontend

A modern cybersecurity learning platform built with **Next.js 16**, **TypeScript**, and **React 18**.

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **pnpm** (v8 or higher)
- **Git**

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

Or with pnpm:

```bash
cd frontend
pnpm install
```

### Environment Configuration

Create a `.env.local` file in the `frontend` directory with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Update the URL if your backend is hosted on a different host or port.

## 🛠️ Development

### Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory with routes and layouts
│   ├── (auth)/             # Authentication routes
│   ├── (admin)/            # Admin panel routes
│   ├── (dashboard)/        # Dashboard routes
│   ├── about/              # About page
│   ├── contact/            # Contact page
│   ├── faq/                # FAQ page
│   ├── learn/              # Learning resources
│   └── resources/          # Resources page
├── components/             # Reusable React components
│   ├── admin/              # Admin components
│   ├── dashboard/          # Dashboard components
│   ├── landing/            # Landing page sections
│   ├── layout/             # Layout components
│   ├── three/              # 3D components
│   └── ui/                 # UI primitives and shared components
├── hooks/                  # Custom React hooks
├── lib/
│   ├── services/          # API and data services
│   ├── stores/            # Zustand stores
│   ├── types/             # TypeScript type definitions
│   └── utils.ts           # Shared utilities
├── public/                 # Static assets
├── styles/                 # Global and theme styles
└── package.json            # Dependencies and scripts
```

## 🔗 API Connection

The frontend uses `NEXT_PUBLIC_API_URL` to connect to the backend API at `http://localhost:5000/api` by default.

Make sure the backend is running before starting the frontend.

## 🎨 Styling

This project uses **Tailwind CSS** with **Radix UI** components and **Shadcn/ui** primitives.

Global styles are defined in `styles/globals.css`.

## 🌙 Dark mode

Dark mode is managed using **Next Themes**.

## 📚 Notes

- The repository includes `pnpm-lock.yaml`, but npm is also supported
- `.env.local` should not be committed to version control
- The frontend is built for modern browsers using Next.js 16 and React 18

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request
- [Radix UI Documentation](https://radix-ui.com)

