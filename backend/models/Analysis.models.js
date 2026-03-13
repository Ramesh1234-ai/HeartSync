import mongoose from 'mongoose'
const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Repository Info
    repoUrl: {
      type: String,
      required: true,
    },
    repoName: String,
    repoOwner: String,
    repoDescription: String,
    repoFullName: String, // owner/repo
    
    // Analysis Results
    stats: {
      stars: Number,
      forks: Number,
      watchers: Number,
      openIssues: Number,
      contributors: Number,
      totalCommits: Number,
    },
    
    languages: [
      {
        name: String,
        percentage: Number,
        bytes: Number,
      },
    ],
    
    // Structure
    structure: {
      totalFiles: Number,
      totalDirs: Number,
      mainLanguage: String,
    },
    
    // AI Insights (from LLM)
    aiInsight: {
      summary: String,
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
      techStack: [String],
      score: {
        codeQuality: Number, // 0-100
        documentation: Number,
        gitPractices: Number,
        overallScore: Number,
      },
    },
    
    // Metadata
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'completed', 'failed'],
      default: 'pending',
    },
    error: String,
    // Performance
    analysisTime: Number, // in ms
    // Analytics
    views: { type: Number, default: 0 },
    shared: { type: Boolean, default: false },
    shareToken: String,
  },
  { timestamps: true }
)
analysisSchema.index({ userId: 1, createdAt: -1 })
analysisSchema.index({ repoUrl: 1 })
analysisSchema.index({ status: 1 })
export default mongoose.model('Analysis', analysisSchema)
