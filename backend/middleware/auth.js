import { verifyToken } from '@clerk/backend'
import User from '../models/User.models.js'
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
/**
 * Middleware to verify Clerk JWT token and attach user to request
 */
export const verifyClerkAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' })
    }
    const token = authHeader.replace('Bearer ', '')
    // Verify Clerk token
    const decoded = await verifyToken(token, {
      secretKey: CLERK_SECRET_KEY,
    })
    // Find or create user in database
    let user = await User.findOne({ clerkId: decoded.sub })
    if (!user) {
      user = new User({
        clerkId: decoded.sub,
        email: decoded.email,
        firstName: decoded.first_name,
        lastName: decoded.last_name,
        fullName: `${decoded.first_name} ${decoded.last_name}`.trim(),
        imageUrl: decoded.image_url,
      })
      await user.save()
    }
    // Update last login
    user.lastLogin = new Date()
    user.loginCount = (user.loginCount || 0) + 1
    await user.save()
    // Attach to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth verification failed:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * Optional auth - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const decoded = await verifyToken(token, {
        secretKey: CLERK_SECRET_KEY,
      })
      const user = await User.findOne({ clerkId: decoded.sub })
      req.user = user
    }
  } catch (error) {
    // Silently fail - this is optional auth
  }
  next()
}

/**
 * Check if user has sufficient plan
 */
export const checkPlanLimit = (requiredPlan = 'free') => {
  return async (req, res, next) => {
    const user = req.user
    const plans = { free: 0, pro: 1, enterprise: 2 }
    
    if (plans[user.plan] < plans[requiredPlan]) {
      return res.status(403).json({ 
        error: 'Insufficient plan', 
        currentPlan: user.plan,
        requiredPlan 
      })
    }
    next()
  }
}

export default verifyClerkAuth
