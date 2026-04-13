import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import { adminAnalytics, adminUsers, createChallenge, createAdminReport, findUserById } from '../data'
import type { Challenge } from '../types'

const router = Router()

router.get('/analytics', authMiddleware, adminMiddleware, (_req, res) => {
  return res.json({ success: true, data: adminAnalytics })
})

router.get('/users', authMiddleware, adminMiddleware, (_req, res) => {
  return res.json({ success: true, data: adminUsers })
})

router.post('/challenges', authMiddleware, adminMiddleware, async (req, res) => {
  const payload = req.body as Omit<Challenge, 'id'>

  if (!payload.title || !payload.description || !payload.category || !payload.difficulty || !payload.points) {
    return res.status(400).json({ success: false, error: 'Missing required challenge fields' })
  }

  const challenge = await createChallenge(payload)
  return res.status(201).json({ success: true, data: challenge })
})

router.patch('/users/:userId/role', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.params
  const { role } = req.body as { role?: string }

  if (!role) {
    return res.status(400).json({ success: false, error: 'Role is required' })
  }

  const user = await findUserById(userId)
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  if (role !== 'student' && role !== 'instructor' && role !== 'admin') {
    return res.status(400).json({ success: false, error: 'Invalid role' })
  }

  user.role = role
  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ageGroup: user.ageGroup,
    createdAt: user.createdAt,
  }

  return res.json({ success: true, data: sanitizedUser })
})

router.get('/reports/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  const { userId } = req.params
  const user = await findUserById(userId)
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' })
  }

  const report = createAdminReport(userId)
  return res.json({ success: true, data: report })
})

export default router
