import express from 'express'
import verifyClerkAuth from '../middleware/auth.js'
import User from '../models/User.models.js'
import Analysis from '../models/Analysis.models.js'
import Chat from '../models/Chat.models.js'

const router = express.Router()

// Root endpoint - health check
router.get('/', (req, res) => {
  res.json({
    message: 'Users endpoint',
    available: ['/me', '/stats', '/upgrade'],
  })
})

// Get current user profile
router.get('/me', verifyClerkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-githubToken')
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
router.put('/me', verifyClerkAuth, async (req, res) => {
  try {
    const { theme, notificationsEnabled, timezone, language } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        theme,
        notificationsEnabled,
        'preferences.timezone': timezone,
        'preferences.language': language,
      },
      { new: true }
    ).select('-githubToken')

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user stats
router.get('/stats', verifyClerkAuth, async (req, res) => {
  try {
    const user = req.user
    const analysisCount = await Analysis.countDocuments({ userId: user._id })
    const chatCount = await Chat.countDocuments({ userId: user._id })

    res.json({
      analyzeLimit: user.analyzeLimit,
      analyzeUsed: user.analyzeUsed,
      plan: user.plan,
      totalAnalysis: analysisCount,
      totalChatMessages: chatCount,
      lastLogin: user.lastLogin,
      loginCount: user.loginCount,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upgrade plan
router.post('/upgrade', verifyClerkAuth, async (req, res) => {
  try {
    const { plan } = req.body

    if (!['free', 'pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' })
    }

    const limits = { free: 10, pro: 100, enterprise: 999999 }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan, analyzeLimit: limits[plan], analyzeUsed: 0 },
      { new: true }
    )

    res.json({ message: 'Plan upgraded', plan: user.plan })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
export default router
