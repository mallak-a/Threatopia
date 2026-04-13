import { Router, type Request, type Response, type NextFunction } from 'express'
import { authMiddleware } from '../middleware/auth'
import { findProfileByUserId, getNotificationsForUser, updateUserAvatar } from '../data'
import type { User } from '../types'
import multer from 'multer'
import path from 'path'

interface AuthenticatedRequest extends Request {
  user?: User
}

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const profile = await findProfileByUserId(userId)
  if (!profile) {
    return res.status(404).json({ success: false, error: 'Profile not found' })
  }

  return res.json({ success: true, data: profile })
})

router.get('/notifications', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const data = getNotificationsForUser(userId)
  return res.json({ success: true, data })
})

router.post('/upload-profile-photo', authMiddleware, upload.single('profilePhoto'), async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id
  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' })
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`
    
    // Persist the avatar URL to the database
    const updatedUser = await updateUserAvatar(userId, fileUrl)
    if (!updatedUser) {
      return res.status(500).json({ success: false, error: 'Failed to update avatar in database' })
    }
    
    return res.json({ success: true, url: fileUrl })
  } catch (error) {
    console.error('Error uploading profile photo:', error)
    return res.status(500).json({ success: false, error: 'Failed to upload profile photo' })
  }
})

// Multer error handling middleware — catches file-too-large, wrong type, etc.
router.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'File too large. Maximum size is 5MB.' })
    }
    return res.status(400).json({ success: false, error: err.message })
  }
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ success: false, error: err.message })
  }
  return res.status(500).json({ success: false, error: 'Internal server error' })
})

export default router
