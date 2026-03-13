/**
 * AI Services Middleware
 * Handles validation and preprocessing for AI-related requests
 */

/**
 * Validate AI request payload
 */
export const validateAIRequest = (req, res, next) => {
  const { message, type, context } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Message is required and must be a string",
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      error: "Message cannot be empty",
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      error: "Message exceeds maximum length of 5000 characters",
    });
  }

  if (type && !["analysis", "chat", "generation", "review"].includes(type)) {
    return res.status(400).json({
      error: "Invalid request type",
    });
  }

  next();
};

/**
 * Validate code analysis request
 */
export const validateCodeAnalysis = (req, res, next) => {
  const { code, language, analysisType } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      error: "Code is required and must be a string",
    });
  }

  if (!language) {
    return res.status(400).json({
      error: "Programming language is required",
    });
  }

  const supportedLanguages = [
    "javascript",
    "python",
    "java",
    "cpp",
    "csharp",
    "go",
    "rust",
    "typescript",
    "php",
    "ruby",
  ];

  if (!supportedLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({
      error: `Language ${language} is not supported`,
      supported: supportedLanguages,
    });
  }

  const validAnalysisTypes = [
    "quality",
    "performance",
    "security",
    "style",
    "bugs",
  ];
  if (analysisType && !validAnalysisTypes.includes(analysisType)) {
    return res.status(400).json({
      error: "Invalid analysis type",
      supported: validAnalysisTypes,
    });
  }

  next();
};

/**
 * Validate documentation generation request
 */
export const validateDocGeneration = (req, res, next) => {
  const { code, style } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      error: "Code is required",
    });
  }

  const validStyles = ["jsdoc", "docstring", "xml", "markdown"];
  if (style && !validStyles.includes(style.toLowerCase())) {
    return res.status(400).json({
      error: "Invalid documentation style",
      supported: validStyles,
    });
  }

  next();
};

/**
 * Sanitize user input to prevent prompt injection
 */
export const sanitizeInput = (req, res, next) => {
  const { message, query, prompt } = req.body;

  const sanitize = (text) => {
    if (!text) return text;
    return text
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Remove control characters
      .trim()
      .slice(0, 5000); // Max length
  };

  if (message) req.body.message = sanitize(message);
  if (query) req.body.query = sanitize(query);
  if (prompt) req.body.prompt = sanitize(prompt);

  next();
};

/**
 * Check user quota for AI operations
 */
export const checkAIQuota = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check monthly quota based on plan
    const quotas = {
      free: 50,
      pro: 500,
      enterprise: Infinity,
    };

    const userQuota = quotas[user.plan] || 50;

    // Check if user has exceeded quota (you can store this in user model)
    const usedThisMonth = user.aiRequestsUsed || 0;

    if (usedThisMonth >= userQuota) {
      return res.status(429).json({
        error: "AI quota exceeded",
        limit: userQuota,
        used: usedThisMonth,
        resetDate: "Next month",
      });
    }

    // Store quota info in request for later use
    req.userQuota = {
      limit: userQuota,
      used: usedThisMonth,
      remaining: userQuota - usedThisMonth,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Rate limit for AI endpoints (stricter than general API limit)
 */
export const aiRateLimit = (req, res, next) => {
  // This would typically use express-rate-limit with a store
  // For now, we'll implement basic rate limiting logic
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 10;

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user._id.toString();
  const key = `ai_rate_${userId}`;

  // In production, use Redis or similar
  if (!global.requestCounts) {
    global.requestCounts = {};
  }

  if (!global.requestCounts[key]) {
    global.requestCounts[key] = [];
  }

  const requests = global.requestCounts[key];
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      error: "Too many AI requests, please wait before trying again",
      retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
    });
  }

  recentRequests.push(now);
  global.requestCounts[key] = recentRequests;

  next();
};
