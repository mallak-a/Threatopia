import { Router } from 'express'
import { spawn } from 'child_process'
import path from 'path'

const router = Router()

router.post('/check', (req, res) => {
  const url = String(req.body.url || '')

  if (!url) {
    return res.status(400).json({ success: false, error: 'URL is required' })
  }

  try {
    // Call Python URL detection script using the project's virtual environment
    const scriptPath = path.join(__dirname, '../../../URL Detection/predict.py')
    const pythonPath = path.join(__dirname, '../../../venv/Scripts/python.exe')
    const pythonProcess = spawn(pythonPath, [scriptPath, url], {
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
        // Python script succeeded (Format: LABEL|CONFIDENCE)
        const parts = result.trim().split('|')
        const label = parts[0]
        const confidenceValue = parts.length > 1 ? parseFloat(parts[1]) : 0.85

        const isPhishing = label.toLowerCase().includes('phishing') ||
                          label.toLowerCase().includes('malicious') ||
                          label.toLowerCase().includes('suspicious')

        return res.json({
          success: true,
          data: {
            result: isPhishing ? 'phishing' : 'safe',
            confidence: confidenceValue,
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