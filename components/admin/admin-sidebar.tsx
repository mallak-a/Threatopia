"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Trophy, 
  Settings,
  FileText,
  BarChart3,
  Shield,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const adminNavItems = [
  { 
    label: "Overview", 
    href: "/admin", 
    icon: LayoutDashboard 
  },
  { 
    label: "Users", 
    href: "/admin/users", 
    icon: Users 
  },
  { 
    label: "Challenges", 
    href: "/admin/challenges", 
    icon: Flag 
  },
  { 
    label: "Submissions", 
    href: "/admin/submissions", 
    icon: FileText 
  },
  { 
    label: "Leaderboard", 
    href: "/admin/leaderboard", 
    icon: Trophy 
  },
  { 
    label: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3 
  },
  { 
    label: "Settings", 
    href: "/admin/settings", 
    icon: Settings 
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border hidden lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Primary%20Logo-MZAdShUeGLJLbcLDJ1HwCx4XpcUgel.png"
            alt="Threatopia"
            width={32}
            height={32}
            className="object-contain"
          />
          <div>
            <span className="font-bold text-foreground">THREATOPIA</span>
            <span className="ml-2 text-xs bg-destructive/20 text-destructive px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Back to Dashboard */}
        <div className="border-t border-border p-4">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/dashboard">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Security Badge */}
        <div className="p-4 pt-0">
          <div className="rounded-lg bg-destructive/10 p-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Admin Access</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              You have elevated privileges
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
