'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { Spinner } from '@/components/ui/spinner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading, fetchProfile, fetchNotifications } = useAuthStore()

  useEffect(() => {
    // Check auth status on mount
    const token = localStorage.getItem('threatopia_token')
    if (!token && !isAuthenticated) {
      router.push('/login')
      return
    }

    // Fetch user data if authenticated
    if (isAuthenticated) {
      fetchProfile()
      fetchNotifications()
    }
  }, [isAuthenticated, router, fetchProfile, fetchNotifications])

  // Show loading state while checking auth
  if (!isAuthenticated && typeof window !== 'undefined') {
    const token = localStorage.getItem('threatopia_token')
    if (!token) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Spinner className="h-8 w-8 text-primary" />
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
