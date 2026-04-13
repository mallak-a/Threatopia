'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Target,
  Trophy,
  Zap,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  Award,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/stores/auth-store'
import { getChallenges } from '@/lib/services/api'
import type { Challenge } from '@/lib/types'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  const { profile } = useAuthStore()
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChallenges() {
      const result = await getChallenges()
      if (result.success && result.data) {
        // Get first 3 incomplete challenges as recommendations
        const incomplete = result.data.filter(
          (c) => !profile?.completedChallenges.includes(c.id)
        )
        setRecommendedChallenges(incomplete.slice(0, 3))
      }
      setLoading(false)
    }
    fetchChallenges()
  }, [profile?.completedChallenges])

  const stats = [
    {
      icon: Zap,
      label: 'Total XP',
      value: profile?.points?.toLocaleString() || '0',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Level',
      value: profile?.level || 1,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Flame,
      label: 'Day Streak',
      value: profile?.streakDays || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: 'Challenges',
      value: profile?.completedChallenges?.length || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ]

  const skillProgress = [
    { name: 'Phishing Detection', score: profile?.stats?.phishingScore || 0, color: 'bg-blue-500' },
    { name: 'SQL Injection', score: profile?.stats?.sqliScore || 0, color: 'bg-purple-500' },
    { name: 'Password Security', score: profile?.stats?.passwordScore || 0, color: 'bg-green-500' },
    { name: 'Social Engineering', score: profile?.stats?.socialEngScore || 0, color: 'bg-orange-500' },
  ]

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-orange-500/20 text-orange-400',
    expert: 'bg-red-500/20 text-red-400',
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{profile?.name || 'Defender'}</span>
        </h1>
        <p className="text-muted-foreground">
          Continue your cybersecurity journey. You&apos;re making great progress!
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="glass border-primary/10 hover:neon-glow-sm transition-all duration-300">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className={`p-2 md:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Progress */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass border-primary/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Skill Progress
              </CardTitle>
              <CardDescription>
                Your proficiency across different security domains
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {skillProgress.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.score}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.score}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${skill.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div variants={itemVariants}>
          <Card className="glass border-primary/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Badges
              </CardTitle>
              <CardDescription>
                Your earned achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile?.badges?.slice(0, 6).map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="bg-primary/10 border-primary/30 text-primary"
                  >
                    {badge}
                  </Badge>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    Complete challenges to earn badges!
                  </p>
                )}
              </div>
              {(profile?.badges?.length || 0) > 6 && (
                <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                  View all {profile?.badges?.length} badges
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Challenges */}
      <motion.div variants={itemVariants}>
        <Card className="glass border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Recommended for You
                </CardTitle>
                <CardDescription>
                  Challenges based on your skill level and progress
                </CardDescription>
              </div>
              <Link href="/challenges">
                <Button variant="outline" size="sm" className="neon-border">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {recommendedChallenges.map((challenge) => (
                  <Link key={challenge.id} href={`/challenges/${challenge.id}`}>
                    <Card className="h-full bg-secondary/30 border-border/50 hover:border-primary/50 hover:neon-glow-sm transition-all duration-300 cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={difficultyColors[challenge.difficulty]}>
                            {challenge.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-primary">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-medium">{challenge.points}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-1">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{challenge.timeLimit || 10} min</span>
                          <span className="mx-1">|</span>
                          <CheckCircle className="h-3 w-3" />
                          <span>{challenge.completedBy?.toLocaleString() || 0} completed</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4">
        <Link href="/assistant">
          <Card className="glass border-primary/10 hover:neon-glow-sm transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Get security guidance</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/leaderboard">
          <Card className="glass border-primary/10 hover:neon-glow-sm transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">Leaderboard</h3>
                <p className="text-sm text-muted-foreground">Rank #{profile?.rank || '—'}</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/simulations">
          <Card className="glass border-primary/10 hover:neon-glow-sm transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/10">
                <svg className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">Simulations</h3>
                <p className="text-sm text-muted-foreground">Practice scenarios</p>
              </div>
              <ArrowRight className="h-5 w-5 ml-auto text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </motion.div>
  )
}
