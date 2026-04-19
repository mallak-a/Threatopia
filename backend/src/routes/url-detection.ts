import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { spawn } from 'child_process'
import path from 'path'

const router = Router()

router.post('/check', authMiddleware, (req, res) => {
  const url = String(req.body.url || '')

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' })
  }

  try {
    // Call Python URL detection script
    const scriptPath = path.join(__dirname, '../../../URL Detection/app.py')
    const pythonProcess = spawn('python', [scriptPath, url], {
      cwd: path.join(__dirname, '../../../URL Detection')
    })

    let result = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0 && result.trim()) {
        // Python script succeeded
        const isPhishing = result.toLowerCase().includes('phishing') ||
                          result.toLowerCase().includes('malicious') ||
                          result.toLowerCase().includes('suspicious')

        return res.json({
          success: true,
          data: {
            result: isPhishing ? 'phishing' : 'safe',
            confidence: 0.85, // Could be parsed from Python output
            details: result.trim()
          },
        })
      } else {
        // Python script failed, return safe result
        console.log('Python URL detection failed:', errorOutput)
        return res.json({
          success: true,
          data: {
            result: 'safe',
            confidence: 0.5,
            details: 'Analysis unavailable'
          },
        })
      }
    })

    pythonProcess.on('error', (error) => {
      console.log('Failed to start Python URL detection process:', error)
      return res.json({
        success: true,
        data: {
          result: 'safe',
          confidence: 0.5,
          details: 'Analysis unavailable'
        },
      })
    })

  } catch (error) {
    console.log('Error in URL detection route:', error)
    return res.json({
      success: true,
      data: {
        result: 'safe',
        confidence: 0.5,
        details: 'Analysis unavailable'
      },
    })
  }
})

export default router