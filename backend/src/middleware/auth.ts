import type { Request, Response, NextFunction } from 'express'
import { verifyJwt } from '../utils'
import { findUserById } from '../data'
import type { User } from '../types'

interface AuthenticatedRequest extends Request {
  user?: User
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing or invalid authorization header' })
  }

  const token = authorization.replace('Bearer ', '')
  try {
    const payload = verifyJwt(token)
    const user = await findUserById(payload.userId)
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token user' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
}

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden: admin access required' })
  }

  next()
}
