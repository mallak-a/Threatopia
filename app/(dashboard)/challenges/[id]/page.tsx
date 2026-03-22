'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle,
  XCircle,
  Lightbulb,
  Send,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { getChallenge, submitChallengeAttempt } from '@/lib/services/api'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import type { Challenge, ChallengeResult } from '@/lib/types'

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-orange-500/20 text-orange-400',
  expert: 'bg-red-500/20 text-red-400',
}

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { profile, addXP, fetchProfile } = useAuthStore()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<ChallengeResult | null>(null)
  const [showHints, setShowHints] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)

  const isCompleted = profile?.completedChallenges?.includes(id)

  useEffect(() => {
    async function fetchChallenge() {
      const res = await getChallenge(id)
      if (res.success && res.data) {
        setChallenge(res.data)
      } else {
        toast.error('Challenge not found')
        router.push('/challenges')
      }
      setLoading(false)
    }
    fetchChallenge()
  }, [id, router])

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer')
      return
    }

    setSubmitting(true)
    const res = await submitChallengeAttempt({
      challengeId: id,
      answer: answer.trim(),
    })

    if (res.success && res.data) {
      setResult(res.data)
      
      if (res.data.correct) {
        addXP(res.data.pointsEarned)
        toast.success(`Correct! +${res.data.pointsEarned} XP earned!`, {
          duration: 5000,
        })
        fetchProfile() // Refresh profile to update completed challenges
      } else {
        toast.error('Not quite right. Try again!')
      }
    }
    setSubmitting(false)
  }

  const revealNextHint = () => {
    if (challenge?.hints && hintsRevealed < challenge.hints.length) {
      setHintsRevealed(hintsRevealed + 1)
      setShowHints(true)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  if (!challenge) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/challenges')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Challenges
      </Button>

      {/* Challenge Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass border-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColors[challenge.difficulty]}>
                    {challenge.difficulty}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {challenge.category.replace('-', ' ')}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{challenge.title}</h1>
                <p className="text-muted-foreground">{challenge.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm shrink-0">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{challenge.timeLimit || 10} min</span>
                </div>
                <div className="flex items-center gap-1 text-primary">
                  <Zap className="h-5 w-5" />
                  <span className="text-lg font-bold">{challenge.points} XP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Code Snippet (if present) */}
      {challenge.codeSnippet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-primary/10">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Code to Analyze
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-4 rounded-lg bg-navy-deep border border-border overflow-x-auto">
                <code className="text-sm font-mono text-green-400">
                  {challenge.codeSnippet}
                </code>
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Hints Section */}
      {challenge.hints && challenge.hints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-primary/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Hints ({hintsRevealed}/{challenge.hints.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={revealNextHint}
                  disabled={hintsRevealed >= challenge.hints.length}
                >
                  {hintsRevealed < challenge.hints.length ? 'Reveal Hint' : 'No more hints'}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {showHints && hintsRevealed > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {challenge.hints.slice(0, hintsRevealed).map((hint, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm"
                      >
                        <span className="font-medium text-yellow-500">Hint {index + 1}:</span>{' '}
                        {hint}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* Answer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass border-primary/10">
          <CardHeader>
            <CardTitle>Your Answer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your answer or explanation here..."
              className="min-h-32 bg-secondary/50 font-mono"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={!!result?.correct}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Tip: Be thorough in your explanation for better feedback
              </p>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !!result?.correct}
                className="neon-glow"
              >
                {submitting ? (
                  <Spinner className="h-4 w-4" />
                ) : result?.correct ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-2 ${result.correct ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {result.correct ? (
                    <div className="p-3 rounded-full bg-green-500/20">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  ) : (
                    <div className="p-3 rounded-full bg-red-500/20">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${result.correct ? 'text-green-500' : 'text-red-500'}`}>
                      {result.correct ? 'Excellent Work!' : 'Not Quite Right'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {result.explanation}
                    </p>
                    {result.correct && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                          <Zap className="h-5 w-5 text-primary" />
                          <span className="font-bold text-primary">+{result.pointsEarned} XP</span>
                        </div>
                        {result.nextChallengeId && (
                          <Button
                            onClick={() => router.push(`/challenges/${result.nextChallengeId}`)}
                            className="neon-glow group"
                          >
                            Next Challenge
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
