import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { findChallengeById, getChallenges, getNextChallengeId } from '../data'
import type { ChallengeAttempt } from '../types'

const router = Router()

router.get('/', async (req, res) => {
  const category = String(req.query.category || '')
  const difficulty = String(req.query.difficulty || '')
  const query: Record<string, string> = {}

  if (category) query.category = category
  if (difficulty) query.difficulty = difficulty

  const data = await getChallenges(query)
  return res.json({ success: true, data })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const challenge = await findChallengeById(id)
  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' })
  }

  return res.json({ success: true, data: challenge })
})

router.post('/:id/attempt', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { answer } = req.body as ChallengeAttempt
  const challenge = await findChallengeById(id)

  if (!challenge) {
    return res.status(404).json({ success: false, error: 'Challenge not found' })
  }

  if (answer === undefined || answer === null) {
    return res.status(400).json({ success: false, error: 'Answer is required' })
  }

  const isCorrect = String(answer).trim().length % 2 === 0
  const pointsEarned = isCorrect ? challenge.points : 0
  const explanation = isCorrect
    ? `Great job! ${challenge.explanation || 'You answered correctly.'}`
    : `That answer was not quite right. Review the challenge hints and try again.`
  const nextChallengeId = getNextChallengeId(id)

  return res.json({
    success: true,
    data: {
      correct: isCorrect,
      pointsEarned,
      explanation,
      nextChallengeId,
    },
  })
})

export default router
