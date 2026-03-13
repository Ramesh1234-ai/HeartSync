import rateLimit from 'express-rate-limit'
// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})
// Strict limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
})
// Analysis limiter - depends on user plan
export const analysisLimiter = (req, res, next) => {
  const user = req.user
  if (!user) return res.status(401).json({ error: 'Unauthorized' })
  // Check if user has reached their daily limit
  const limits = {
    free: 10,
    pro: 100,
    enterprise: Infinity,
  }
  const limit = limits[user.plan] || 10
  const used = user.analyzeUsed || 0
  if (used >= limit) {
    return res.status(429).json({
      error: 'Analysis limit reached',
      current: used,
      limit,
      resetDate: 'Next month',
    })
  }
  next()
}
export default apiLimiter
