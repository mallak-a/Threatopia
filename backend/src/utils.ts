import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import type { AuthTokenPayload } from './types'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'threatopia-secret'

export function signJwt(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwt(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
