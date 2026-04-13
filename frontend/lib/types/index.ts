// Threatopia API Types

export type AgeGroup = 'teen' | 'student' | 'professional'
export type UserRole = 'student' | 'instructor' | 'admin'
export type ChallengeCategory = 'phishing' | 'sql-injection' | 'password-security' | 'social-engineering' | 'malware' | 'network-security'
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type LeaderboardType = 'global' | 'friends'

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  ageGroup?: AgeGroup
  avatar?: string
  createdAt?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  points: number
  level: number
  badges: string[]
  completedChallenges: string[]
  stats: {
    sqliScore: number
    phishingScore: number
    passwordScore?: number
    socialEngScore?: number
  }
  streakDays?: number
  totalChallenges?: number
  rank?: number
}

// Auth types
export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData extends AuthCredentials {
  name: string
  ageGroup: AgeGroup
}

export interface AuthResponse {
  user: User
  token: string
}

// Challenge types
export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  points: number
  timeLimit?: number // in minutes
  explanation?: string
  hints?: string[]
  codeSnippet?: string
  imageUrl?: string
  completedBy?: number
  createdAt?: string
}

export interface ChallengeAttempt {
  challengeId: string
  answer: string | number | boolean
  timeSpent?: number
}

export interface ChallengeResult {
  correct: boolean
  pointsEarned: number
  explanation: string
  nextChallengeId?: string
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar?: string
  points: number
  level: number
}

// Assistant types
export interface AssistantMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  relatedChallenges?: string[]
}

export interface AssistantResponse {
  reply: string
  relatedChallenges: string[]
}

// Admin types
export interface AdminAnalytics {
  totalUsers: number
  activeUsers: number
  totalChallenges: number
  completedChallenges: number
  averageScore: number
  userGrowth: {
    date: string
    count: number
  }[]
  categoryBreakdown: {
    category: ChallengeCategory
    count: number
    avgScore: number
  }[]
}

export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'banned'
  lastActive: string
  challengesCompleted: number
  totalPoints: number
}

// Simulation types
export interface Simulation {
  id: string
  title: string
  description: string
  difficulty: ChallengeDifficulty
  duration: number // in minutes
  category: ChallengeCategory
  status: 'available' | 'coming_soon' | 'maintenance'
}

// Notification types
export interface Notification {
  id: string
  type: 'achievement' | 'challenge' | 'leaderboard' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

// Health check
export interface HealthCheck {
  status: 'ok' | 'error'
  message: string
}
