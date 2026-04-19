import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import healthRouter from './routes/health'
import authRouter from './routes/auth'
import challengesRouter from './routes/challenges'
import usersRouter from './routes/users'
import leaderboardRouter from './routes/leaderboard'
import assistantRouter from './routes/assistant'
import adminRouter from './routes/admin'
import simulationsRouter from './routes/simulations'
import urlDetectionRouter from './routes/url-detection'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 5000

app.use(cors())
app.use(express.json())

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

app.use('/api', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/challenges', challengesRouter)
app.use('/api/users', usersRouter)
app.use('/api/leaderboard', leaderboardRouter)
app.use('/api/assistant', assistantRouter)
app.use('/api/simulations', simulationsRouter)
app.use('/api/admin', adminRouter)
app.use('/api/url-detection', urlDetectionRouter)

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' })
})

app.listen(port, () => {
  console.log(`Threatopia backend listening at http://localhost:${port}/api`)
})
