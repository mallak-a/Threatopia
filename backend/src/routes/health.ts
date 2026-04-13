import { Router } from 'express'

const router = Router()

router.get('/health', (_req, res) => {
  return res.json({
    success: true,
    data: {
      status: 'ok',
      message: 'Server is running',
    },
  })
})

router.get('/maintenance', (_req, res) => {
  return res.status(501).json({
    success: false,
    error: 'Maintenance endpoint is coming soon',
  })
})

export default router
