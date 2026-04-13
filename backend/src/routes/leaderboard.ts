import { Router } from 'express'
import { getLeaderboard } from '../data'

const router = Router()

router.get('/', async (_, res) => {
  const type = String(_.query.type || 'global') as 'global' | 'friends'
  const data = await getLeaderboard()

  return res.json({ success: true, data })
})

export default router
