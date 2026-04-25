'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import {
  Menu,
  X,
  Shield,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth-store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '')

function normalizeAvatarUrl(url?: string) {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${BACKEND_BASE_URL}${cleanUrl}`
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Learn', href: '/learn' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated, user, logout, previewAvatar } = useAuthStore()

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'

  const avatarSrc = previewAvatar || normalizeAvatarUrl(user?.avatar)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const isHomePage = pathname === '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Scroll Progress Bar */}
      {isHomePage && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/50 via-primary to-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] origin-left z-[60]"
          style={{ scaleX }}
        />
      )}
      <nav className="glass border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary transition-all group-hover:text-primary/80" />
                <div className="absolute inset-0 blur-md bg-primary/30 group-hover:bg-primary/50 transition-all" />
              </div>
              <span className="text-xl font-bold gradient-text">THREATOPIA</span>
            </Link>

            {/* ── Desktop nav links ─────────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* ── Desktop right section ─────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                /* ── Avatar dropdown (logged-in) ── */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      id="navbar-avatar-trigger"
                      className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-secondary/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      aria-label="Open user menu"
                    >
                      <Avatar className="h-8 w-8 border-2 border-primary/30 ring-2 ring-primary/10">
                        <AvatarImage key={avatarSrc} src={avatarSrc} alt={user?.name || 'User'} className="object-cover" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56 glass mt-1">
                    {/* User info header */}
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-9 w-9 border border-primary/30">
                          <AvatarImage key={avatarSrc} src={avatarSrc} alt={user?.name || 'User'} className="object-cover" />
                          <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* ── Auth buttons (guest) ── */
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="neon-glow-sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile: avatar (if logged in) + hamburger ─────────────── */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && (
                <Link href="/profile" aria-label="Go to profile">
                  <Avatar className="h-8 w-8 border-2 border-primary/30 ring-2 ring-primary/10">
                    <AvatarImage key={avatarSrc} src={avatarSrc} alt={user?.name || 'User'} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              )}
              <button
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile menu ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-primary/20"
            >
              <div className="px-4 py-4 space-y-2">
                {/* User info strip (mobile, logged in) */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/30 mb-3">
                    <Avatar className="h-9 w-9 border-2 border-primary/30">
                      <AvatarImage key={avatarSrc} src={avatarSrc} alt={user?.name || 'User'} className="object-cover" />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                )}

                {/* Nav links */}
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      pathname === item.href
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Auth actions */}
                <div className="pt-4 border-t border-border space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full neon-glow-sm" variant="outline">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={() => {
                          logout()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <Button className="w-full neon-glow-sm">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
