import { Router } from 'express'
import { getSimulations } from '../data'

const router = Router()

router.get('/', async (_req, res) => {
  const data = await getSimulations()
  return res.json({ success: true, data })
})

export default router
