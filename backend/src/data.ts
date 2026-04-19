import bcrypt from 'bcryptjs'
import type {
  AgeGroup,
  AdminAnalytics,
  AdminUser,
  Challenge,
  ChallengeCategory,
  ChallengeDifficulty,
  LeaderboardEntry,
  Notification,
  Simulation,
  User,
  UserProfile,
  UserWithPassword,
  RegisterData,
  UserRole,
} from './types'
import { prisma } from './lib/prisma'

export const getUsers = async (): Promise<UserWithPassword[]> => {
  const users = await prisma.user.findMany()
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    country: user.country,
    password: user.password,
    role: user.role as UserRole,
    ageGroup: user.ageGroup as AgeGroup,
    avatar: user.avatar || undefined,
    createdAt: user.createdAt.toISOString(),
  }))
}

export const getUserById = async (id: string): Promise<UserWithPassword | undefined> => {
  const user = await prisma.user.findUnique({
    where: { id },
  })
  if (!user) return undefined
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    country: user.country,
    password: user.password,
    role: user.role as UserRole,
    ageGroup: user.ageGroup as AgeGroup,
    avatar: user.avatar || undefined,
    createdAt: user.createdAt.toISOString(),
  }
}

export const getUserByEmail = async (email: string): Promise<UserWithPassword | undefined> => {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  if (!user) return undefined
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    country: user.country,
    password: user.password,
    role: user.role as UserRole,
    ageGroup: user.ageGroup as AgeGroup,
    avatar: user.avatar || undefined,
    createdAt: user.createdAt.toISOString(),
  }
}

export const getProfiles = async (): Promise<UserProfile[]> => {
  const profiles = await prisma.userProfile.findMany({
    include: { user: true },
  })
  return profiles.map(profile => ({
    id: profile.id,
    name: profile.user.name,
    email: profile.user.email,
    points: profile.points,
    level: profile.level,
    badges: profile.badges as string[],
    completedChallenges: profile.completedChallenges as string[],
    stats: {
      sqliScore: profile.sqliScore,
      phishingScore: profile.phishingScore,
      passwordScore: profile.passwordScore ?? undefined,
      socialEngScore: profile.socialEngScore ?? undefined,
    },
    streakDays: profile.streakDays,
    totalChallenges: profile.totalChallenges,
    rank: profile.rank ?? undefined,
  }))
}

export const getProfileById = async (id: string): Promise<UserProfile | undefined> => {
  const profile = await prisma.userProfile.findUnique({
    where: { id },
    include: { user: true },
  })
  if (!profile) return undefined
  return {
    id: profile.id,
    name: profile.user.name,
    email: profile.user.email,
    points: profile.points,
    level: profile.level,
    badges: profile.badges as string[],
    completedChallenges: profile.completedChallenges as string[],
    stats: {
      sqliScore: profile.sqliScore,
      phishingScore: profile.phishingScore,
      passwordScore: profile.passwordScore ?? undefined,
      socialEngScore: profile.socialEngScore ?? undefined,
    },
    streakDays: profile.streakDays,
    totalChallenges: profile.totalChallenges,
    rank: profile.rank ?? undefined,
  }
}

export const getChallenges = async (query: { category?: string; difficulty?: string } = {}): Promise<Challenge[]> => {
  const challenges = await prisma.challenge.findMany()
  const normalizedCategory = query.category?.replace(/-/g, '_')
  const mapped = challenges.map(challenge => ({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category as ChallengeCategory,
    difficulty: challenge.difficulty as ChallengeDifficulty,
    points: challenge.points,
    timeLimit: challenge.timeLimit ?? undefined,
    explanation: challenge.explanation || undefined,
    hints: (challenge.hints as string[]) ?? [],
    codeSnippet: challenge.codeSnippet || undefined,
    imageUrl: challenge.imageUrl || undefined,
    completedBy: challenge.completedBy,
    createdAt: challenge.createdAt.toISOString(),
  }))

  return mapped.filter(challenge => {
    if (normalizedCategory && challenge.category !== normalizedCategory) return false
    if (query.difficulty && challenge.difficulty !== query.difficulty) return false
    return true
  })
}

export const getChallengeById = async (id: string): Promise<Challenge | undefined> => {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
  })
  if (!challenge) return undefined
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category as ChallengeCategory,
    difficulty: challenge.difficulty as ChallengeDifficulty,
    points: challenge.points,
    timeLimit: challenge.timeLimit ?? undefined,
    explanation: challenge.explanation || undefined,
    hints: (challenge.hints as string[]) ?? [],
    codeSnippet: challenge.codeSnippet || undefined,
    imageUrl: challenge.imageUrl || undefined,
    completedBy: challenge.completedBy,
    createdAt: challenge.createdAt.toISOString(),
  }
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const entries = await prisma.leaderboardEntry.findMany({
    orderBy: { rank: 'asc' },
    include: { user: true },
  })
  return entries.map(entry => ({
    rank: entry.rank,
    userId: entry.userId,
    name: entry.user.name,
    avatar: entry.user.avatar || undefined,
    points: entry.points,
    level: entry.level,
  }))
}

export const getSimulations = async (): Promise<Simulation[]> => {
  const simulations = await prisma.simulation.findMany()
  return simulations.map(sim => ({
    id: sim.id,
    title: sim.title,
    description: sim.description,
    difficulty: sim.difficulty as ChallengeDifficulty,
    duration: sim.duration,
    category: sim.category as ChallengeCategory,
    status: sim.status as 'available' | 'coming_soon' | 'maintenance',
  }))
}

export const adminAnalytics = {
  totalUsers: 0,
  activeUsers: 0,
  totalChallenges: 0,
  completedChallenges: 0,
  averageScore: 0,
  userGrowth: [],
  categoryBreakdown: [],
}

export const adminUsers = [] as AdminUser[]

// Legacy functions (updated to be async and use database operations)
export async function findUserByEmail(email: string): Promise<UserWithPassword | undefined> {
  return getUserByEmail(email)
}

export async function findUserById(id: string): Promise<UserWithPassword | undefined> {
  return getUserById(id)
}

export async function findProfileByUserId(userId: string): Promise<UserProfile | undefined> {
  return getProfileById(userId)
}

export function getNotificationsForUser(userId: string): Notification[] {
  // TODO: Implement database query for notifications
  return []
}

export async function createUser(data: RegisterData, password: string): Promise<UserWithPassword> {
  const hashedPassword = bcrypt.hashSync(password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      country: data.country,
      password: hashedPassword,
      role: 'student',
      ageGroup: data.ageGroup,
      profile: {
        create: {
          points: 0,
          level: 1,
          badges: [],
          completedChallenges: [],
          sqliScore: 0,
          phishingScore: 0,
          passwordScore: 0,
          socialEngScore: 0,
          streakDays: 0,
          totalChallenges: 0,
          rank: 0,
        },
      },
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    country: user.country,
    password: user.password,
    role: user.role as UserRole,
    ageGroup: user.ageGroup as AgeGroup,
    avatar: user.avatar || undefined,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function updateUserContact(userId: string, data: { phoneNumber?: string, country?: string }): Promise<UserWithPassword | undefined> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
        ...(data.country !== undefined && { country: data.country }),
      },
    })
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      password: user.password,
      role: user.role as UserRole,
      ageGroup: user.ageGroup as AgeGroup,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error('Error updating user contact:', error)
    return undefined
  }
}

export async function createChallenge(challenge: Omit<Challenge, 'id' | 'createdAt'>): Promise<Challenge> {
  const newChallenge = await prisma.challenge.create({
    data: {
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      difficulty: challenge.difficulty,
      points: challenge.points,
      timeLimit: challenge.timeLimit,
      explanation: challenge.explanation,
      hints: challenge.hints,
      codeSnippet: challenge.codeSnippet,
      imageUrl: challenge.imageUrl,
      completedBy: challenge.completedBy,
    },
  })

  return {
    id: newChallenge.id,
    title: newChallenge.title,
    description: newChallenge.description,
    category: newChallenge.category as ChallengeCategory,
    difficulty: newChallenge.difficulty as ChallengeDifficulty,
    points: newChallenge.points,
    timeLimit: newChallenge.timeLimit ?? undefined,
    explanation: newChallenge.explanation || undefined,
    hints: (newChallenge.hints as string[]) ?? [],
    codeSnippet: newChallenge.codeSnippet || undefined,
    imageUrl: newChallenge.imageUrl || undefined,
    completedBy: newChallenge.completedBy,
    createdAt: newChallenge.createdAt.toISOString(),
  }
}

export function findChallengeById(id: string): Promise<Challenge | undefined> {
  return getChallengeById(id)
}

export function getNextChallengeId(currentId: string): string | undefined {
  // TODO: Implement database query for next challenge
  return undefined
}

export async function updateUserAvatar(userId: string, avatarUrl: string): Promise<User | undefined> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    })
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      role: user.role as UserRole,
      ageGroup: user.ageGroup as AgeGroup,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt.toISOString(),
    }
  } catch {
    return undefined
  }
}

export function createAdminReport(userId: string) {
  // TODO: Implement database query for admin report
  return {
    userId,
    name: 'Database User',
    totalPoints: 0,
    challengesCompleted: 0,
    lastActive: new Date().toISOString(),
    strengths: [],
    recommendations: [],
  }
}
