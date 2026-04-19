import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../data'
import { signJwt } from '../utils'
import type { AuthCredentials, RegisterData, User } from '../types'

const router = Router()

router.post('/register', async (req, res) => {
  const { name, email, password, phoneNumber, country, ageGroup } = req.body as RegisterData
  if (!name || !email || !password || !phoneNumber || !country || !ageGroup) {
    return res.status(400).json({ success: false, error: 'Missing required registration fields' })
  }

  // Basic phone number validation (must contain digits, optional + prefix, min length 7)
  const phoneRegex = /^\+?[0-9\s\-\(\)]{7,20}$/
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({ success: false, error: 'Invalid phone number format' })
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'Email is already registered' })
  }

  const newUser = await createUser({ name, email, password, phoneNumber, country, ageGroup }, password)
  const token = signJwt({ userId: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role })

  const responseUser: User = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    country: newUser.country,
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
    phoneNumber: user.phoneNumber,
    country: user.country,
    role: user.role,
    ageGroup: user.ageGroup,
    avatar: user.avatar,
    createdAt: user.createdAt,
  }

  return res.json({ success: true, data: { user: responseUser, token } })
})

export default router
