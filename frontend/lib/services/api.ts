// Threatopia API Service Layer with Failover Pattern
// Attempts real API first, falls back to mock data seamlessly

import type {
  ApiResponse,
  AuthCredentials,
  RegisterData,
  AuthResponse,
  User,
  UserProfile,
  Challenge,
  ChallengeAttempt,
  ChallengeResult,
  LeaderboardEntry,
  LeaderboardType,
  AssistantResponse,
  AdminAnalytics,
  AdminUser,
  Simulation,
  Notification,
  HealthCheck,
  ChallengeCategory,
  ChallengeDifficulty,
} from '@/lib/types'

import {
  mockUserProfile,
  mockChallenges,
  mockLeaderboard,
  mockFriendsLeaderboard,
  mockSimulations,
  mockAdminAnalytics,
  mockAdminUsers,
  mockNotifications,
  mockAssistantResponses,
} from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
const REQUEST_TIMEOUT = 5000 // 5 seconds

// Track API availability
let isApiAvailable = true
let lastApiCheck = 0
const API_CHECK_INTERVAL = 30000 // 30 seconds

// Helper to check if we should attempt the real API
function shouldAttemptApi(): boolean {
  const now = Date.now()
  if (!isApiAvailable && now - lastApiCheck < API_CHECK_INTERVAL) {
    return false
  }
  return true
}

// Helper to mark API status
function markApiStatus(available: boolean) {
  isApiAvailable = available
  lastApiCheck = Date.now()
}

// Generic fetch with timeout and error handling
async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const contentTypeHeader = options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...contentTypeHeader,
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }))
      return { success: false, error: error.error || `HTTP ${response.status}` }
    }

    const data = await response.json()
    markApiStatus(true)
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    markApiStatus(false)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout' }
      }
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Network error' }
  }
}

// Get auth token from storage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('threatopia_token')
}

// Get authenticated headers
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ==================== Health Check ====================
export async function checkHealth(): Promise<ApiResponse<HealthCheck>> {
  if (!shouldAttemptApi()) {
    return { success: true, data: { status: 'ok', message: 'Using mock data (API unavailable)' } }
  }

  const result = await fetchWithTimeout<HealthCheck>(`${API_BASE_URL}/health`)
  
  if (!result.success) {
    return { success: true, data: { status: 'ok', message: 'Using mock data (API unavailable)' } }
  }
  
  return result
}

// ==================== Authentication ====================
export async function login(credentials: AuthCredentials): Promise<ApiResponse<AuthResponse>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<AuthResponse>(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (result.success && result.data) {
      localStorage.setItem('threatopia_token', result.data.token)
      return result
    }
  }

  // Mock fallback
  await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network delay
  
  if (credentials.email === 'demo@threatopia.com' && credentials.password === 'demo123') {
    const mockResponse: AuthResponse = {
      user: { id: 'user_1', name: 'Demo User', email: credentials.email, role: 'student' },
      token: 'mock_jwt_token_' + Date.now(),
    }
    localStorage.setItem('threatopia_token', mockResponse.token)
    return { success: true, data: mockResponse }
  }

  // Accept any email/password for demo purposes
  const mockResponse: AuthResponse = {
    user: { id: 'user_new', name: 'New User', email: credentials.email, role: 'student' },
    token: 'mock_jwt_token_' + Date.now(),
  }
  localStorage.setItem('threatopia_token', mockResponse.token)
  return { success: true, data: mockResponse }
}

export async function register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<AuthResponse>(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (result.success && result.data) {
      localStorage.setItem('threatopia_token', result.data.token)
      return result
    }
  }

  // Mock fallback
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const mockResponse: AuthResponse = {
    user: { id: 'user_' + Date.now(), name: data.name, email: data.email, role: 'student', ageGroup: data.ageGroup },
    token: 'mock_jwt_token_' + Date.now(),
  }
  localStorage.setItem('threatopia_token', mockResponse.token)
  return { success: true, data: mockResponse }
}

export function logout(): void {
  localStorage.removeItem('threatopia_token')
}

// ==================== User Profile ====================
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<UserProfile>(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  await new Promise(resolve => setTimeout(resolve, 300))
  return { success: true, data: mockUserProfile }
}

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<Notification[]>(`${API_BASE_URL}/users/notifications`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  return { success: true, data: mockNotifications }
}

// ==================== Challenges ====================
export async function getChallenges(filters?: {
  category?: ChallengeCategory
  difficulty?: ChallengeDifficulty
}): Promise<ApiResponse<Challenge[]>> {
  if (shouldAttemptApi()) {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.difficulty) params.append('difficulty', filters.difficulty)
    
    const url = `${API_BASE_URL}/challenges${params.toString() ? `?${params}` : ''}`
    const result = await fetchWithTimeout<Challenge[]>(url, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback with filtering
  let challenges = [...mockChallenges]
  if (filters?.category) {
    challenges = challenges.filter(c => c.category === filters.category)
  }
  if (filters?.difficulty) {
    challenges = challenges.filter(c => c.difficulty === filters.difficulty)
  }
  
  return { success: true, data: challenges }
}

export async function getChallenge(id: string): Promise<ApiResponse<Challenge>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<Challenge>(`${API_BASE_URL}/challenges/${id}`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  const challenge = mockChallenges.find(c => c.id === id)
  if (!challenge) {
    return { success: false, error: 'Challenge not found' }
  }
  return { success: true, data: challenge }
}

export async function submitChallengeAttempt(
  attempt: ChallengeAttempt
): Promise<ApiResponse<ChallengeResult>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<ChallengeResult>(
      `${API_BASE_URL}/challenges/${attempt.challengeId}/attempt`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attempt),
      }
    )

    if (result.success) return result
  }

  // Mock fallback - simulate random success/failure
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const challenge = mockChallenges.find(c => c.id === attempt.challengeId)
  const isCorrect = Math.random() > 0.3 // 70% success rate for demo
  const currentIndex = mockChallenges.findIndex(c => c.id === attempt.challengeId)
  const nextChallenge = mockChallenges[currentIndex + 1]

  return {
    success: true,
    data: {
      correct: isCorrect,
      pointsEarned: isCorrect ? (challenge?.points || 100) : 0,
      explanation: challenge?.explanation || 'Great effort! Keep learning and improving.',
      nextChallengeId: nextChallenge?.id,
    },
  }
}

// ==================== Leaderboard ====================
export async function getLeaderboard(
  type: LeaderboardType = 'global'
): Promise<ApiResponse<LeaderboardEntry[]>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<LeaderboardEntry[]>(
      `${API_BASE_URL}/leaderboard?type=${type}`,
      { headers: getAuthHeaders() }
    )

    if (result.success) return result
  }

  // Mock fallback
  const data = type === 'friends' ? mockFriendsLeaderboard : mockLeaderboard
  return { success: true, data }
}

// ==================== AI Assistant ====================
export async function sendAssistantMessage(
  message: string
): Promise<ApiResponse<AssistantResponse>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<AssistantResponse>(
      `${API_BASE_URL}/assistant/chat`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      }
    )

    if (result.success) return result
  }

  // Mock fallback with keyword matching
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const lowerMessage = message.toLowerCase()
  let response = mockAssistantResponses.default

  if (lowerMessage.includes('sql') || lowerMessage.includes('injection')) {
    response = mockAssistantResponses['sql injection']
  } else if (lowerMessage.includes('phish')) {
    response = mockAssistantResponses.phishing
  } else if (lowerMessage.includes('password')) {
    response = mockAssistantResponses.password
  }

  return { success: true, data: response }
}

// ==================== Simulations ====================
export async function getSimulations(): Promise<ApiResponse<Simulation[]>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<Simulation[]>(`${API_BASE_URL}/simulations`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  return { success: true, data: mockSimulations }
}

// ==================== Admin ====================
export async function getAdminAnalytics(): Promise<ApiResponse<AdminAnalytics>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<AdminAnalytics>(`${API_BASE_URL}/admin/analytics`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  return { success: true, data: mockAdminAnalytics }
}

export async function getAdminUsers(): Promise<ApiResponse<AdminUser[]>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<AdminUser[]>(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders(),
    })

    if (result.success) return result
  }

  // Mock fallback
  return { success: true, data: mockAdminUsers }
}

export async function createChallenge(
  challenge: Omit<Challenge, 'id'>
): Promise<ApiResponse<Challenge>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<Challenge>(`${API_BASE_URL}/admin/challenges`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(challenge),
    })

    if (result.success) return result
  }

  // Mock fallback
  await new Promise(resolve => setTimeout(resolve, 500))
  return {
    success: true,
    data: { ...challenge, id: 'ch_' + Date.now() } as Challenge,
  }
}

export async function updateUserRole(
  userId: string,
  role: User['role']
): Promise<ApiResponse<User>> {
  if (shouldAttemptApi()) {
    const result = await fetchWithTimeout<User>(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    })

    if (result.success) return result
  }

  // Mock fallback
  await new Promise(resolve => setTimeout(resolve, 300))
  const user = mockAdminUsers.find(u => u.id === userId)
  if (!user) return { success: false, error: 'User not found' }
  
  return { success: true, data: { ...user, role } }
}

// ==================== API Object Export ====================
// Provides a convenient object-based API interface
export const api = {
  health: {
    check: checkHealth,
  },
  auth: {
    login,
    register,
    logout,
  },
  users: {
    getProfile: getUserProfile,
    getNotifications,
  },
  challenges: {
    getAll: getChallenges,
    getById: getChallenge,
    submit: submitChallengeAttempt,
  },
  leaderboard: {
    getGlobal: () => getLeaderboard('global'),
    getFriends: () => getLeaderboard('friends'),
  },
  assistant: {
    sendMessage: sendAssistantMessage,
  },
  simulations: {
    getAll: getSimulations,
  },
  admin: {
    getAnalytics: getAdminAnalytics,
    getUsers: getAdminUsers,
    createChallenge,
    updateUserRole,
  },
}
