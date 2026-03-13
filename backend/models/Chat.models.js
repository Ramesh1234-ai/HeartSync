import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Conversation context
    analysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analysis',
    },
    
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    
    // Message data
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    
    message: {
      type: String,
      required: true,
    },
    
    // Metadata
    tokens: {
      prompt: Number,
      completion: Number,
      total: Number,
    },
    
    model: {
      type: String,
      default: 'gpt-4',
    },
    
    // Threading
    parentMessageId: mongoose.Schema.Types.ObjectId,
    childMessages: [mongoose.Schema.Types.ObjectId],
    
    // Feedback
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
  },
  { timestamps: true }
)

chatSchema.index({ userId: 1, conversationId: 1, createdAt: -1 })
chatSchema.index({ conversationId: 1 })

export default mongoose.model('Chat', chatSchema)
