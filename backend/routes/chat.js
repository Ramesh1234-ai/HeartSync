import express from 'express'
import verifyClerkAuth from '../middleware/auth.js'
import Chat from '../models/Chat.models.js'
import Analysis from '../models/Analysis.models.js'
import * as AIService from '../services/ai_service.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

/**
 * Root endpoint - health check
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Chat endpoint',
    available: ['/conversations', '/conversations/:conversationId/messages'],
  })
})

/**
 * Start a new chat conversation
 */
router.post('/conversations', verifyClerkAuth, async (req, res) => {
  try {
    const { analysisId } = req.body

    const conversationId = uuidv4()

    // Verify analysis belongs to user
    if (analysisId) {
      const analysis = await Analysis.findOne({
        _id: analysisId,
        userId: req.user._id,
      })
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' })
      }
    }

    res.json({
      conversationId,
      userId: req.user._id,
      analysisId: analysisId || null,
      createdAt: new Date(),
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Send a message and get AI response
 */
router.post('/conversations/:conversationId/messages', verifyClerkAuth, async (req, res) => {
  try {
    const { conversationId } = req.params
    const { message, analysisId } = req.body

    if (!message) return res.status(400).json({ error: 'Message required' })

    // Save user message
    const userMessage = new Chat({
      userId: req.user._id,
      conversationId,
      analysisId,
      role: 'user',
      message,
      model: 'gpt-4',
    })
    await userMessage.save()

    // Get AI response using Gemini API
    let aiResponse = ''
    let tokensUsed = 0

    try {
      // Create system prompt for repository analysis context
      const systemPrompt = analysisId 
        ? `You are a helpful AI assistant analyzing GitHub repositories. Provide specific, actionable insights. Keep responses concise and technical.`
        : `You are a helpful AI assistant specialized in code analysis and GitHub repositories. Provide insightful technical responses.`

      // Combine system and user message for AI
      const fullPrompt = `${systemPrompt}\n\nUser: ${message}`

      // Call Gemini API
      const aiResult = await AIService.generateAIResponse(fullPrompt, {
        model: 'gemini-2.0-flash',
        maxTokens: 1000,
        temperature: 0.7,
      })

      aiResponse = aiResult.content
      tokensUsed = aiResult.tokensUsed || 0
    } catch (error) {
      console.error('AI generation error:', error)
      // Fallback to mock response
      aiResponse = generateMockResponse(message)
    }

    // Save AI message
    const assistantMessage = new Chat({
      userId: req.user._id,
      conversationId,
      analysisId,
      role: 'assistant',
      message: aiResponse,
      model: 'gemini-2.0-flash',
      tokens: {
        total: tokensUsed
      }
    })
    await assistantMessage.save()

    res.json({
      userMessage: {
        id: userMessage._id,
        message,
        role: 'user',
      },
      assistantMessage: {
        id: assistantMessage._id,
        message: aiResponse,
        role: 'assistant',
      },
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get conversation history
 */
router.get('/conversations/:conversationId', verifyClerkAuth, async (req, res) => {
  try {
    const { conversationId } = req.params

    const messages = await Chat.find({
      userId: req.user._id,
      conversationId,
    }).sort({ createdAt: 1 })

    res.json({ conversationId, messages })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get all conversations
 */
router.get('/', verifyClerkAuth, async (req, res) => {
  try {
    const conversations = await Chat.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$conversationId',
          analysisId: { $first: '$analysisId' },
          lastMessage: { $last: '$message' },
          messageCount: { $sum: 1 },
          lastActivity: { $max: '$createdAt' },
        },
      },
      { $sort: { lastActivity: -1 } },
    ])

    res.json({ conversations })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Delete conversation
 */
router.delete('/conversations/:conversationId', verifyClerkAuth, async (req, res) => {
  try {
    await Chat.deleteMany({
      userId: req.user._id,
      conversationId: req.params.conversationId,
    })

    res.json({ message: 'Conversation deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * Generate mock AI response
 */
function generateMockResponse(userMessage) {
  const responses = {
    code: 'This is well-structured code with good separation of concerns. Consider adding more unit tests for edge cases.',
    quality:
      'The code quality is excellent. The project follows SOLID principles and has comprehensive documentation.',
    performance:
      'Performance metrics look good. Consider implementing lazy loading for large datasets to improve initial load time.',
    security:
      'Security practices are solid. Ensure to regularly update dependencies and run security audits.',
    architecture:
      'The architecture is scalable and maintainable. Good use of design patterns and modular structure.',
  }

  const keywords = userMessage.toLowerCase()
  for (const [key, value] of Object.entries(responses)) {
    if (keywords.includes(key)) return value
  }

  return 'That is a great question! Based on the repository analysis, I can provide insights on multiple aspects. What specific area would you like me to focus on - code structure, performance, security, or the overall architecture?'
}

export default router
