"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Search, 
  Menu,
  LogOut,
  User,
  Settings,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuthStore } from "@/lib/stores/auth-store"
import { AdminSidebar } from "./admin-sidebar"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '')

const normalizeAvatarUrl = (url?: string) => {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  const cleanUrl = url.startsWith('/') ? url : `/${url}`
  return `${BACKEND_BASE_URL}${cleanUrl}`
}

export function AdminHeader() {
  const { user, logout, previewAvatar } = useAuthStore()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Mobile Logo */}
      <Link href="/admin" className="flex items-center gap-2 lg:hidden">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Primary%20Logo-MZAdShUeGLJLbcLDJ1HwCx4XpcUgel.png"
          alt="Threatopia"
          width={28}
          height={28}
          className="object-contain"
        />
        <span className="font-bold text-foreground">ADMIN</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users, challenges..."
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Admin Badge */}
        <Badge variant="destructive" className="hidden sm:flex">
          <Shield className="h-3 w-3 mr-1" />
          Admin Panel
        </Badge>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage key={previewAvatar || user?.avatar} src={previewAvatar || normalizeAvatarUrl(user?.avatar)} alt={user?.username} className="object-cover" />
                <AvatarFallback className="bg-destructive text-destructive-foreground">
                  {user?.username?.slice(0, 2).toUpperCase() || "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3 py-1">
                <Avatar className="h-9 w-9 border border-destructive/30">
                  <AvatarImage key={previewAvatar || user?.avatar} src={previewAvatar || normalizeAvatarUrl(user?.avatar)} alt={user?.username} className="object-cover" />
                  <AvatarFallback className="bg-destructive/20 text-destructive text-xs font-bold">
                    {user?.username?.slice(0, 2).toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.username || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  <Badge variant="destructive" className="w-fit text-[10px] h-4 px-1.5 mt-0.5">Admin</Badge>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                User Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
