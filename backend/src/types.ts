export type AgeGroup = 'teen' | 'student' | 'professional'
export type UserRole = 'student' | 'instructor' | 'admin'
export type ChallengeCategory = 'phishing' | 'sql_injection' | 'password_security' | 'social_engineering' | 'malware' | 'network_security'
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'
export type LeaderboardType = 'global' | 'friends'

export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  country: string
  role: UserRole
  ageGroup?: AgeGroup
  avatar?: string
  createdAt?: string
}

export interface UserWithPassword extends User {
  password: string
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

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData extends AuthCredentials {
  name: string
  phoneNumber: string
  country: string
  ageGroup: AgeGroup
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  points: number
  timeLimit?: number
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

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar?: string
  points: number
  level: number
}

export interface AssistantResponse {
  reply: string
  relatedChallenges: string[]
}

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

export interface Simulation {
  id: string
  title: string
  description: string
  difficulty: ChallengeDifficulty
  duration: number
  category: ChallengeCategory
  status: 'available' | 'coming_soon' | 'maintenance'
}

export interface Notification {
  id: string
  type: 'achievement' | 'challenge' | 'leaderboard' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface HealthCheck {
  status: 'ok' | 'error'
  message: string
}

export interface AuthTokenPayload {
  userId: string
  email: string
  name: string
  role: UserRole
}
