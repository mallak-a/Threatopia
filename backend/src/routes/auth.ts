import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../data'
import { signJwt } from '../utils'
import type { AuthCredentials, RegisterData, User } from '../types'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password, ageGroup } = req.body as RegisterData
  if (!name || !email || !password || !ageGroup) {
    return res.status(400).json({ success: false, error: 'Missing required registration fields' })
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Email is already registered' })
  }

  const newUser = await createUser({ name, email, password, ageGroup }, password)
  const token = signJwt({ userId: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role })

  const responseUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    ageGroup: newUser.ageGroup,
    avatar: newUser.avatar,
    createdAt: newUser.createdAt,
  }

  return res.status(201).json({ success: true, data: { user: responseUser, token } })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body as AuthCredentials
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing email or password' })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' })
  }

  const passwordMatches = bcrypt.compareSync(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' })
  }

  const token = signJwt({ userId: user.id, email: user.email, name: user.name, role: user.role })

  const responseUser: User = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ageGroup: user.ageGroup,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }

  return res.json({ success: true, data: { user: responseUser, token } })
})

export default router
