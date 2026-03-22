// Threatopia Auth Store - Zustand state management

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserProfile, AuthCredentials, RegisterData, Notification } from '@/lib/types'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getUserProfile, getNotifications } from '@/lib/services/api'

interface AuthState {
  // State
  user: User | null
  profile: UserProfile | null
  notifications: Notification[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (credentials: AuthCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  fetchProfile: () => Promise<void>
  fetchNotifications: () => Promise<void>
  clearError: () => void
  addXP: (points: number) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      profile: null,
      notifications: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null })
        
        const result = await apiLogin(credentials)
        
        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          })
          // Fetch profile after successful login
          get().fetchProfile()
          get().fetchNotifications()
          return true
        }
        
        set({
          error: result.error || 'Login failed',
          isLoading: false,
        })
        return false
      },

      // Register action
      register: async (data) => {
        set({ isLoading: true, error: null })
        
        const result = await apiRegister(data)
        
        if (result.success && result.data) {
          set({
            user: result.data.user,
            isAuthenticated: true,
            isLoading: false,
          })
          get().fetchProfile()
          return true
        }
        
        set({
          error: result.error || 'Registration failed',
          isLoading: false,
        })
        return false
      },

      // Logout action
      logout: () => {
        apiLogout()
        set({
          user: null,
          profile: null,
          notifications: [],
          isAuthenticated: false,
          error: null,
        })
      },

      // Fetch user profile
      fetchProfile: async () => {
        const result = await getUserProfile()
        
        if (result.success && result.data) {
          set({ profile: result.data })
        }
      },

      // Fetch notifications
      fetchNotifications: async () => {
        const result = await getNotifications()
        
        if (result.success && result.data) {
          set({ notifications: result.data })
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Add XP points (for real-time updates)
      addXP: (points) => {
        const { profile } = get()
        if (profile) {
          set({
            profile: {
              ...profile,
              points: profile.points + points,
            },
          })
        }
      },
    }),
    {
      name: 'threatopia-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
