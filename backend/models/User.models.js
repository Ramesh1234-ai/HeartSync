import mongoose from 'mongoose'
const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    firstName: String,
    lastName: String,
    fullName: String,
    imageUrl: String,
    // Subscription & Plan
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    analyzeLimit: {
      type: Number,
      default: 10, // Free: 10, Pro: 100, Enterprise: Unlimited
    },
    analyzeUsed: {
      type: Number,
      default: 0,
    },
    // Settings
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    githubToken: {
      type: String, // Encrypted GitHub PAT
      default: null,
    },
    // Preferences
    preferences: {
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      apiKey: { type: String, unique: true, sparse: true }, // For API access
    },   
    // Activity
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    // Status
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
)
// Index for faster queries
userSchema.index({ clerkId: 1 })
userSchema.index({ email: 1 })
userSchema.index({ createdAt: -1 })
export default mongoose.model('User', userSchema)
