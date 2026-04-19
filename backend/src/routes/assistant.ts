import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { spawn } from 'child_process'
import path from 'path'

const router = Router()

router.post('/chat', authMiddleware, (req, res) => {
  const message = String(req.body.message || '')

  if (!message) {
    return res.status(400).json({ success: false, error: 'Message is required' })
  }

  try {
    // Call Python chatbot script using the project's virtual environment
    const scriptPath = path.join(__dirname, '../../../ChatBot/chatbot.py')
    const pythonPath = path.join(__dirname, '../../../venv/Scripts/python.exe')
    const pythonProcess = spawn(pythonPath, [scriptPath, message], {
      cwd: path.join(__dirname, '../../../ChatBot')
    })

    let response = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      response += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0 && response.trim()) {
        // Python script succeeded
        return res.json({
          success: true,
          data: {
            reply: response.trim(),
            relatedChallenges: [], // Could be enhanced later
          },
        })
      } else {
        // Python script failed, fall back to basic responses
        console.log('Python script failed:', errorOutput)
        const lowerMessage = message.toLowerCase()
        let reply = 'I recommend studying the challenge details carefully and using secure coding practices.'
        const relatedChallenges: string[] = []

        if (lowerMessage.includes('sql') || lowerMessage.includes('injection')) {
          reply = 'To prevent SQL Injection, always use prepared statements and parameterized queries.'
          relatedChallenges.push('ch_2', 'ch_5')
        } else if (lowerMessage.includes('phish')) {
          reply = 'Phishing is stopped by verifying sender information and avoiding suspicious links.'
          relatedChallenges.push('ch_1', 'ch_8')
        } else if (lowerMessage.includes('password')) {
          reply = 'Strong passwords should be long, unique, and include uppercase, lowercase, digits, and symbols.'
          relatedChallenges.push('ch_3')
        } else if (lowerMessage.includes('network')) {
          reply = 'Network threats are controlled with monitoring, segmentation, and secure access policies.'
          relatedChallenges.push('ch_7')
        }

        return res.json({
          success: true,
          data: {
            reply,
            relatedChallenges,
          },
        })
      }
    })

    pythonProcess.on('error', (error) => {
      console.log('Failed to start Python process:', error)
      // Fall back to basic responses
      const lowerMessage = message.toLowerCase()
      let reply = 'I recommend studying the challenge details carefully and using secure coding practices.'
      const relatedChallenges: string[] = []

      if (lowerMessage.includes('sql') || lowerMessage.includes('injection')) {
        reply = 'To prevent SQL Injection, always use prepared statements and parameterized queries.'
        relatedChallenges.push('ch_2', 'ch_5')
      } else if (lowerMessage.includes('phish')) {
        reply = 'Phishing is stopped by verifying sender information and avoiding suspicious links.'
        relatedChallenges.push('ch_1', 'ch_8')
      } else if (lowerMessage.includes('password')) {
        reply = 'Strong passwords should be long, unique, and include uppercase, lowercase, digits, and symbols.'
        relatedChallenges.push('ch_3')
      } else if (lowerMessage.includes('network')) {
        reply = 'Network threats are controlled with monitoring, segmentation, and secure access policies.'
        relatedChallenges.push('ch_7')
      }

      return res.json({
        success: true,
        data: {
          reply,
          relatedChallenges,
        },
      })
    })

  } catch (error) {
    console.log('Error in assistant route:', error)
    // Fall back to basic responses
    const lowerMessage = message.toLowerCase()
    let reply = 'I recommend studying the challenge details carefully and using secure coding practices.'
    const relatedChallenges: string[] = []

    if (lowerMessage.includes('sql') || lowerMessage.includes('injection')) {
      reply = 'To prevent SQL Injection, always use prepared statements and parameterized queries.'
      relatedChallenges.push('ch_2', 'ch_5')
    } else if (lowerMessage.includes('phish')) {
      reply = 'Phishing is stopped by verifying sender information and avoiding suspicious links.'
      relatedChallenges.push('ch_1', 'ch_8')
    } else if (lowerMessage.includes('password')) {
      reply = 'Strong passwords should be long, unique, and include uppercase, lowercase, digits, and symbols.'
      relatedChallenges.push('ch_3')
    } else if (lowerMessage.includes('network')) {
      reply = 'Network threats are controlled with monitoring, segmentation, and secure access policies.'
      relatedChallenges.push('ch_7')
    }

    return res.json({
      success: true,
      data: {
        reply,
        relatedChallenges,
      },
    })
  }
})

export default router
