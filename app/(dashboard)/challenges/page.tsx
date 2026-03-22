'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Target,
  Clock,
  CheckCircle,
  Zap,
  Shield,
  Database,
  Lock,
  Users,
  Bug,
  Network,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getChallenges } from '@/lib/services/api'
import { useAuthStore } from '@/lib/stores/auth-store'
import type { Challenge, ChallengeCategory, ChallengeDifficulty } from '@/lib/types'

const categoryIcons: Record<ChallengeCategory, typeof Shield> = {
  phishing: Shield,
  'sql-injection': Database,
  'password-security': Lock,
  'social-engineering': Users,
  malware: Bug,
  'network-security': Network,
}

const categoryColors: Record<ChallengeCategory, string> = {
  phishing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'sql-injection': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'password-security': 'bg-green-500/10 text-green-400 border-green-500/30',
  'social-engineering': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  malware: 'bg-red-500/10 text-red-400 border-red-500/30',
  'network-security': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
}

const difficultyColors: Record<ChallengeDifficulty, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-orange-500/20 text-orange-400',
  expert: 'bg-red-500/20 text-red-400',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ChallengesPage() {
  const { profile } = useAuthStore()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ChallengeCategory | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<ChallengeDifficulty | 'all'>('all')

  useEffect(() => {
    async function fetchChallenges() {
      const filters: { category?: ChallengeCategory; difficulty?: ChallengeDifficulty } = {}
      if (categoryFilter !== 'all') filters.category = categoryFilter
      if (difficultyFilter !== 'all') filters.difficulty = difficultyFilter

      const result = await getChallenges(Object.keys(filters).length ? filters : undefined)
      if (result.success && result.data) {
        setChallenges(result.data)
      }
      setLoading(false)
    }
    fetchChallenges()
  }, [categoryFilter, difficultyFilter])

  const filteredChallenges = challenges.filter((challenge) =>
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const completedIds = new Set(profile?.completedChallenges || [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Target className="h-7 w-7 text-primary" />
            Challenges
          </h1>
          <p className="text-muted-foreground mt-1">
            Test your cybersecurity knowledge with interactive challenges
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>{completedIds.size} of {challenges.length} completed</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="glass border-primary/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search challenges..."
                className="pl-10 bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as ChallengeCategory | 'all')}
              >
                <SelectTrigger className="w-[180px] bg-secondary/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="phishing">Phishing</SelectItem>
                  <SelectItem value="sql-injection">SQL Injection</SelectItem>
                  <SelectItem value="password-security">Password Security</SelectItem>
                  <SelectItem value="social-engineering">Social Engineering</SelectItem>
                  <SelectItem value="malware">Malware</SelectItem>
                  <SelectItem value="network-security">Network Security</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={difficultyFilter}
                onValueChange={(value) => setDifficultyFilter(value as ChallengeDifficulty | 'all')}
              >
                <SelectTrigger className="w-[160px] bg-secondary/50">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : filteredChallenges.length === 0 ? (
        <Card className="glass border-primary/10">
          <CardContent className="p-12 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No challenges found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredChallenges.map((challenge) => {
            const CategoryIcon = categoryIcons[challenge.category] || Shield
            const isCompleted = completedIds.has(challenge.id)

            return (
              <motion.div key={challenge.id} variants={itemVariants}>
                <Link href={`/challenges/${challenge.id}`}>
                  <Card className={`h-full glass border-primary/10 hover:neon-glow-sm transition-all duration-300 cursor-pointer group relative overflow-hidden ${isCompleted ? 'border-green-500/30' : ''}`}>
                    {isCompleted && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-green-500/20">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`p-2.5 rounded-lg ${categoryColors[challenge.category].split(' ').slice(0, 1).join(' ')}`}>
                          <CategoryIcon className={`h-5 w-5 ${categoryColors[challenge.category].split(' ')[1]}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {challenge.title}
                          </h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {challenge.category.replace('-', ' ')}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {challenge.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={difficultyColors[challenge.difficulty]}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{challenge.timeLimit || 10}m</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary">
                            <Zap className="h-3.5 w-3.5" />
                            <span className="font-medium">{challenge.points}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
