# Threatopia Frontend

A modern cybersecurity learning platform built with **Next.js 16**, **TypeScript**, and **React 18**.

## 🚀 Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **pnpm** (v8.0.0 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd threatopia
```

### Step 2: Install Frontend Dependencies

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies using npm:

```bash
npm install
```

Or if you prefer pnpm:

```bash
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Replace `http://localhost:5000/api` with your backend API URL if running on a different host/port.

## 📦 Dependencies Overview

### Core Framework
- **Next.js 16** - React framework for production
- **React 18** - JavaScript library for building UI with components
- **TypeScript** - Typed superset of JavaScript

### UI & Components
- **Radix UI** - Accessible component primitives (accordion, dialog, tabs, etc.)
- **Lucide React** - Beautiful SVG icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Type-safe component variants
- **clsx** - Utility for constructing className strings

### Forms & Validation
- **React Hook Form** - Flexible form library with efficient validation
- **@hookform/resolvers** - Validation library resolvers (Zod, Yup, etc.)

### Animations & 3D
- **Framer Motion** - React animation library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for Three.js

### Data & Charts
- **Recharts** - Composable charting library
- **date-fns** - Modern date utility library
- **React Day Picker** - Date picker component

### UI Utilities
- **Sonner** - Toast notifications
- **Embla Carousel** - Carousel component library
- **React Resizable Panels** - Resizable panel layouts
- **Input OTP** - OTP input component
- **Next Themes** - Dark mode management

### Development
- **Autoprefixer** - PostCSS plugin for vendor prefixes
- **Cross-env** - Cross platform environment variables
- **ESLint** - JavaScript linting

## 🛠️ Development

### Start Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page auto-updates as you edit files.

### Build for Production

Build the application for production:

```bash
npm run build
```

### Start Production Server

Start the production server:

```bash
npm start
```

### Linting

Check and fix code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app directory (routes & layouts)
│   ├── (auth)/            # Authentication routes (login, register, etc.)
│   ├── (admin)/           # Admin panel routes
│   ├── (dashboard)/       # User dashboard routes
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── faq/               # FAQ page
│   ├── learn/             # Learning resources
│   └── resources/         # Resources page
├── components/            # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── admin/            # Admin-specific components
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page sections
│   ├── layout/           # Layout components (navbar, footer)
│   └── three/            # 3D components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── services/         # API and data services
│   ├── stores/           # Zustand stores
│   ├── types/            # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── public/               # Static assets (images, icons)
├── styles/               # Global styles
└── package.json          # Dependencies and scripts
```

## 🔗 API Connection

The frontend connects to the backend API at `http://localhost:5000/api` (configurable via `.env.local`).

Ensure the backend server is running before starting the frontend development server:

```bash
# In the backend directory
npm run dev
```

## 🎨 Styling

This project uses **Tailwind CSS** with **Radix UI** components and **Shadcn/ui** for a beautiful, accessible UI.

Global styles are defined in `styles/globals.css`.

## 🌙 Dark Mode

Dark mode is managed via **Next Themes**. Users can toggle between light and dark themes throughout the application.

## 📝 Notes

- The project uses **pnpm-lock.yaml** as the primary lock file
- **Node modules are excluded** from version control (see `.gitignore`)
- TypeScript configuration is strict and modern (ES 2020+)

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Radix UI Documentation](https://radix-ui.com)

