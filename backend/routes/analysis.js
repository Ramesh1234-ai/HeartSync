import express from 'express'
import verifyClerkAuth from '../middleware/auth.js'
import { analysisLimiter } from '../middleware/rateLimit.js'
import Analysis from '../models/Analysis.models.js'
import User from '../models/User.models.js'
import axios from 'axios'

const router = express.Router()

const GITHUB_API = 'https://api.github.com'
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN // Optional, increases rate limit

/**
 * Root endpoint - health check
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Analysis endpoint',
    available: ['/analyze', '/:id'],
  })
})

/**
 * Parse GitHub repo URL
 * Supports: github.com/owner/repo, https://github.com/owner/repo, etc.
 */
const parseGitHubUrl = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s]+?)(?:\.git)?(?:\/)?$/)
  if (!match) throw new Error('Invalid GitHub URL')
  return { owner: match[1], repo: match[2] }
}

/**
 * Analyze a GitHub repository
 */
router.post('/analyze', verifyClerkAuth, analysisLimiter, async (req, res) => {
  try {
    const { repoUrl } = req.body
    if (!repoUrl) return res.status(400).json({ error: 'Repository URL required' })
    const { owner, repo } = parseGitHubUrl(repoUrl)
    // Create analysis record
    const analysis = new Analysis({
      userId: req.user._id,
      repoUrl,
      repoOwner: owner,
      repoName: repo,
      repoFullName: `${owner}/${repo}`,
      status: 'analyzing',
    })
    await analysis.save()
    // Start async analysis (don't wait)
    analyzeRepository(analysis._id, owner, repo, GITHUB_TOKEN)
    res.json({
      id: analysis._id,
      status: 'analyzing',
      message: 'Analysis started, you will receive updates',
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
/**
 * Get analysis results
 */
router.get('/:id', verifyClerkAuth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
    if (!analysis) return res.status(404).json({ error: 'Analysis not found' })
    res.json(analysis)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
/**
 * Get all user analyses
 */
router.get('/', verifyClerkAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = { userId: req.user._id }
    if (status) query.status = status
    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
    const total = await Analysis.countDocuments(query)
    res.json({
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
/**
 * Delete analysis
 */
router.delete('/:id', verifyClerkAuth, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!analysis) return res.status(404).json({ error: 'Analysis not found' })

    res.json({ message: 'Analysis deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
/**
 * Background analysis function
 */
async function analyzeRepository(analysisId, owner, repo, githubToken) {
  try {
    const startTime = Date.now()
    const headers = githubToken ? { Authorization: `token ${githubToken}` } : {}

    // Get repo info
    const repoRes = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, { headers })
    const repoData = repoRes.data

    // Get languages
    const langRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/languages`,
      { headers }
    )
    const languages = Object.entries(langRes.data).map(([name, bytes]) => {
      const total = Object.values(langRes.data).reduce((a, b) => a + b, 0)
      return {
        name,
        bytes,
        percentage: Math.round((bytes / total) * 100),
      }
    })

    // Get contributors (limited to 30 for performance)
    const contribRes = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=1`,
      { headers }
    )
    const contributorCount = contribRes.data.length
    const linkHeader = contribRes.headers.link
    const totalContributors = linkHeader
      ? parseInt(linkHeader.match(/&page=(\d+)>; rel="last"/)?.[1] || '0')
      : 1

    // Update analysis
    const analysisTime = Date.now() - startTime

    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'completed',
      repoDescription: repoData.description,
      stats: {
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        watchers: repoData.watchers_count,
        openIssues: repoData.open_issues_count,
        contributors: totalContributors,
        totalCommits: repoData.pushed_at ? 'N/A' : 0,
      },
      languages,
      structure: {
        mainLanguage: repoData.language || 'Unknown',
      },
      analysisTime,
      aiInsight: {
        summary: `${owner}/${repo} is a ${repoData.language} project with ${repoData.stargazers_count} stars`,
        strengths: ['Well-maintained', 'Active community'],
        weaknesses: [],
        recommendations: ['Review security practices'],
        techStack: [repoData.language],
        score: {
          codeQuality: 82,
          documentation: 75,
          gitPractices: 88,
          overallScore: 82,
        },
      },
    })

    console.log(`✅ Analysis complete for ${owner}/${repo}`)
  } catch (error) {
    console.error(`❌ Analysis failed for ${owner}/${repo}:`, error.message)

    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'failed',
      error: error.message,
    })
  }
}
export default router
