/**
 * AI Services Routes
 * Endpoints for AI-powered code analysis, generation, and assistance
 */

import express from "express";
import { verifyClerkAuth } from "../middleware/auth.js";
import {
  validateAIRequest,
  validateCodeAnalysis,
  validateDocGeneration,
  sanitizeInput,
  checkAIQuota,
  aiRateLimit,
} from "../middleware/ai_services.js";
import * as AIService from "../services/ai_service.js";
import User from "../models/User.models.js";

const router = express.Router();

/**
 * Root endpoint - health check
 */
router.get("/", (req, res) => {
  res.json({
    message: "AI Services API",
    version: "1.0.0",
    endpoints: {
      analyze: "POST /analyze-code",
      generate: "POST /generate-code",
      document: "POST /generate-docs",
      refactor: "POST /refactor-code",
      explain: "POST /explain-code",
      bugs: "POST /identify-bugs",
      question: "POST /answer-question",
      repository: "POST /analyze-repo",
      models: "GET /available-models",
    },
  });
});

/**
 * Get available AI models and capabilities
 */
router.get("/available-models", (req, res) => {
  res.json({
    models: [
      {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        description: "Fast and efficient model for most tasks",
        capabilities: [
          "code-analysis",
          "documentation",
          "refactoring",
          "bug-detection",
        ],
        maxTokens: 4000,
      },
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        description: "Advanced model for complex analysis",
        capabilities: [
          "code-analysis",
          "documentation",
          "code-generation",
          "refactoring",
          "architecture-analysis",
        ],
        maxTokens: 8000,
      },
    ],
    supportedLanguages: [
      "javascript",
      "typescript",
      "python",
      "java",
      "cpp",
      "csharp",
      "go",
      "rust",
      "php",
      "ruby",
    ],
  });
});

/**
 * Analyze code quality
 * POST /api/ai/analyze-code
 */
router.post(
  "/analyze-code",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateCodeAnalysis,
  async (req, res) => {
    try {
      const { code, language, analysisType } = req.body;

      // Generate analysis
      const analysis = await AIService.analyzeCodeQuality(
        code,
        language,
        analysisType
      );

      // Update user's AI request count
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $inc: { aiRequestsUsed: 1 },
        },
        { new: true }
      );

      res.json({
        success: true,
        analysis: analysis.content,
        model: analysis.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Code analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze code",
        details: error.message,
      });
    }
  }
);

/**
 * Generate code from description
 * POST /api/ai/generate-code
 */
router.post(
  "/generate-code",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateAIRequest,
  async (req, res) => {
    try {
      const { message, language } = req.body;

      if (!language) {
        return res.status(400).json({
          error: "Programming language is required",
        });
      }

      // Generate code
      const generated = await AIService.generateCodeFromDescription(
        message,
        language
      );

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        code: generated.content,
        language,
        model: generated.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Code generation error:", error);
      res.status(500).json({
        error: "Failed to generate code",
        details: error.message,
      });
    }
  }
);

/**
 * Generate documentation
 * POST /api/ai/generate-docs
 */
router.post(
  "/generate-docs",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateDocGeneration,
  async (req, res) => {
    try {
      const { code, language, style = "markdown" } = req.body;

      // Generate documentation
      const docs = await AIService.generateDocumentation(code, language, style);

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        documentation: docs.content,
        style,
        model: docs.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Documentation generation error:", error);
      res.status(500).json({
        error: "Failed to generate documentation",
        details: error.message,
      });
    }
  }
);

/**
 * Refactor code
 * POST /api/ai/refactor-code
 */
router.post(
  "/refactor-code",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateCodeAnalysis,
  async (req, res) => {
    try {
      const { code, language } = req.body;

      // Generate refactoring suggestions
      const refactored = await AIService.refactorCode(code, language);

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        refactoredCode: refactored.content,
        language,
        model: refactored.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Code refactoring error:", error);
      res.status(500).json({
        error: "Failed to refactor code",
        details: error.message,
      });
    }
  }
);

/**
 * Explain code
 * POST /api/ai/explain-code
 */
router.post(
  "/explain-code",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateCodeAnalysis,
  async (req, res) => {
    try {
      const { code, language } = req.body;

      // Explain code
      const explanation = await AIService.explainCode(code, language);

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        explanation: explanation.content,
        model: explanation.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Code explanation error:", error);
      res.status(500).json({
        error: "Failed to explain code",
        details: error.message,
      });
    }
  }
);

/**
 * Identify bugs
 * POST /api/ai/identify-bugs
 */
router.post(
  "/identify-bugs",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateCodeAnalysis,
  async (req, res) => {
    try {
      const { code, language } = req.body;

      // Identify bugs
      const bugs = await AIService.identifyBugs(code, language);

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        bugs: bugs.content,
        model: bugs.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Bug identification error:", error);
      res.status(500).json({
        error: "Failed to identify bugs",
        details: error.message,
      });
    }
  }
);

/**
 * Answer question about code
 * POST /api/ai/answer-question
 */
router.post(
  "/answer-question",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  sanitizeInput,
  validateAIRequest,
  async (req, res) => {
    try {
      const { code, language, message } = req.body;

      if (!code || !language) {
        return res.status(400).json({
          error: "Code and language are required",
        });
      }

      // Answer question
      const answer = await AIService.answerCodeQuestion(code, language, message);

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        answer: answer.content,
        model: answer.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Question answering error:", error);
      res.status(500).json({
        error: "Failed to answer question",
        details: error.message,
      });
    }
  }
);

/**
 * Analyze GitHub repository
 * POST /api/ai/analyze-repo
 */
router.post(
  "/analyze-repo",
  verifyClerkAuth,
  aiRateLimit,
  checkAIQuota,
  validateAIRequest,
  async (req, res) => {
    try {
      const { repoName, language, fileCount, description, topics } = req.body;

      if (!repoName) {
        return res.status(400).json({
          error: "Repository name is required",
        });
      }

      // Analyze repository
      const analysis = await AIService.analyzeRepository({
        repoName,
        language: language || "Unknown",
        fileCount: fileCount || 0,
        description,
        topics,
      });

      // Update user's AI request count
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { aiRequestsUsed: 1 },
      });

      res.json({
        success: true,
        analysis: analysis.content,
        model: analysis.model,
        quotaRemaining: req.userQuota.remaining - 1,
      });
    } catch (error) {
      console.error("Repository analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze repository",
        details: error.message,
      });
    }
  }
);

/**
 * Get user's AI usage statistics
 * GET /api/ai/usage
 */
router.get("/usage", verifyClerkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "aiRequestsUsed plan"
    );

    const quotas = {
      free: 50,
      pro: 500,
      enterprise: Infinity,
    };

    const userQuota = quotas[user.plan] || 50;
    const used = user.aiRequestsUsed || 0;

    res.json({
      plan: user.plan,
      quota: userQuota,
      used,
      remaining: userQuota - used,
      percentage: ((used / userQuota) * 100).toFixed(2),
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch usage statistics",
      details: error.message,
    });
  }
});

export default router;
