# NexusAI Backend - Production-Ready API Server

## 🏗️ Architecture Overview

The backend is built with **Express.js**, **MongoDB**, and **Clerk Authentication** to provide a robust, scalable API for the NexusAI platform.

### Tech Stack
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk + JWT
- **Rate Limiting**: express-rate-limit
- **HTTP Client**: Axios
- **Package Manager**: npm

---

## 📁 Project Structure

```
backend/
├── server.js              # Main server entry point
├── db.js                  # MongoDB connection
├── package.json           # Dependencies
├── .env                   # Environment variables
├── middleware/
│   ├── auth.js           # Clerk authentication & JWT verification
│   └── rateLimit.js      # API rate limiting
├── models/
│   ├── User.js           # User schema with subscription info
│   ├── Analysis.js       # Repository analysis results
│   └── Chat.js           # Chat messages & conversations
└── routes/
    ├── users.js          # User management endpoints
    ├── analysis.js       # GitHub repository analysis
    └── chat.js           # AI chat conversations
```
---

## 🚀 API Endpoints

### **User Management** (`/api/users`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current user profile | ✅ Required |
| PUT | `/me` | Update user settings | ✅ Required |
| GET | `/stats` | Get user statistics | ✅ Required |
| POST | `/upgrade` | Upgrade subscription plan | ✅ Required |
**Example Request:**
```bash
curl -H "Authorization: Bearer CLERK_TOKEN" \
  http://localhost:3000/api/users/me
```
### **Repository Analysis** (`/api/analysis`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/analyze` | Start analyzing a repo | ✅ Required |
| GET | `/:id` | Get analysis results | ✅ Required |
| GET | `/` | List all analyses | ✅ Required |
| DELETE | `/:id` | Delete analysis | ✅ Required |
**Example Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/facebook/react"}' \
  http://localhost:3000/api/analysis/analyze
```
**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "status": "analyzing",
  "message": "Analysis started, you will receive updates"
}
```
### **AI Chat** (`/api/chat`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/conversations` | Start new conversation | ✅ Required |
| POST | `/:conversationId/messages` | Send message | ✅ Required |
| GET | `/conversations/:conversationId` | Get history | ✅ Required |
| GET | `/` | List conversations | ✅ Required |
| DELETE | `/conversations/:conversationId` | Delete conversation | ✅ Required |
**Example Request:**
```bash
curl -X POST \
  -H "Authorization: Bearer CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Analyze this repository"}' \
  http://localhost:3000/api/chat/conversations/abc123/messages
```
---
## 🔐 Authentication
All protected endpoints require a Clerk JWT token in the Authorization header:
```
Authorization: Bearer <CLERK_JWT_TOKEN>
```
The backend automatically:
1. ✅ Verifies the Clerk token
2. ✅ Finds or creates user in MongoDB
3. ✅ Tracks login activity
4. ✅ Manages user plan limits
---
## 💾 Database Schemas
### User Schema
```javascript
{
  clerkId: String,          // Clerk user ID
  email: String,            // Unique email
  firstName: String,        // First name
  lastName: String,         // Last name
  plan: String,             // 'free', 'pro', 'enterprise'
  analyzeLimit: Number,     // Requests per month
  analyzeUsed: Number,      // Current usage
  theme: String,            // 'light' or 'dark'
  githubToken: String,      // Encrypted GitHub PAT
  lastLogin: Date,          // Last login timestamp
  loginCount: Number,       // Total logins
}
```
### Analysis Schema
```javascript
{
  userId: ObjectId,         // Owner user
  repoUrl: String,          // GitHub repository URL
  repoName: String,         // Repository name
  repoOwner: String,        // Repository owner
  stats: {                  // Repository statistics
    stars: Number,
    forks: Number,
    contributors: Number,
    totalCommits: Number,
  },
  languages: Array,         // Language breakdown
  aiInsight: {              // AI-generated insights
    summary: String,
    strengths: Array,
    weaknesses: Array,
    techStack: Array,
    score: {
      codeQuality: Number,
      documentation: Number,
      gitPractices: Number,
      overallScore: Number,
    },
  },
  status: String,           // 'pending', 'analyzing', 'completed', 'failed'
  analysisTime: Number,     // Time taken (ms)
}
```
### Chat Schema
```javascript
{
  userId: ObjectId,         // Owner user
  conversationId: String,   // Conversation identifier
  analysisId: ObjectId,     // Related analysis (optional)
  role: String,             // 'user' or 'assistant'
  message: String,          // Message content
  model: String,            // 'gpt-4', 'gpt-3.5', etc.
  tokens: {                 // Token usage
    prompt: Number,
    completion: Number,
    total: Number,
  },
}
```
---
## ⚙️ Environment Variables

Create a `.env` file in the backend folder:

```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5174

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nexusai

# Clerk
CLERK_SECRET_KEY=your_secret_key

# GitHub (optional - adds GitHub API calls)
GITHUB_API_TOKEN=your_github_token

# AI/LLM
OPENAI_API_KEY=your_openai_key

# Rate Limiting
RATE_LIMIT_WINDOW=15     # minutes
RATE_LIMIT_MAX=100        # requests
```

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB (Local or Cloud)
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your keys
```

### 4. Start Development Server
```bash
npm run dev
```

Expected output:
```
✅ MongoDB Connected: mongodb://localhost:27017/nexusai
✅ Server running on http://localhost:3000
📚 API Documentation: /api/docs
```

---

## 🧪 Testing Endpoints

### Test User Profile
```bash
curl -X GET \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:3000/api/users/me
```

### Test Repository Analysis
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/facebook/react"}' \
  http://localhost:3000/api/analysis/analyze
```

### Test Chat
```bash
# 1. Start conversation
curl -X POST \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:3000/api/chat/conversations

# 2. Send message
curl -X POST \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is this repo about?"}' \
  http://localhost:3000/api/chat/conversations/YOUR_CONV_ID/messages
```

---

## 🔒 Security Features

✅ **Clerk Authentication**: OAuth2/OIDC via Clerk  
✅ **JWT Verification**: Token validation on protected routes  
✅ **Rate Limiting**: IP-based rate limiting (100 req/15min)  
✅ **CORS Protection**: Restricted to frontend origin  
✅ **Data Validation**: Schema validation with Mongoose  
✅ **Error Handling**: Comprehensive error messages  
---
## 📊 Subscription Plans
| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Analyses/Month | 10 | 100 | Unlimited |
| Chat Messages | 100 | 1000 | Unlimited |
| GitHub Integration | ✅ | ✅ | ✅ |
| AI Insights | ✅ | ✅ | ✅ |
| Export Reports | ❌ | ✅ | ✅ |
| API Access | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ |
---
## 🚀 Deployment
### Deploy to Heroku
```bash
heroku create nexusai-backend
heroku config:set CLERK_SECRET_KEY=your_key
git push heroku main
```
### Deploy to AWS, GCP, or Azure
1. Build Docker image
2. Set environment variables
3. Deploy container
---
## 📚 Frontend Integration
The frontend uses the API service layer in `broskiai/src/services/api.js`:
```javascript
import { analysisAPI, chatAPI, userAPI } from '@/services/api'
// Use in components
const { data } = await analysisAPI.analyze(repoUrl, getToken)
```
---

## 🔧 Troubleshooting
| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Ensure MongoDB is running: `mongod` |
| CORS error | Check FRONTEND_URL matches your frontend |
| Invalid token | Ensure CLERK_SECRET_KEY is correct |
| Rate limit exceeded | Wait 15 minutes or upgrade plan |
---
## 📝 Future Enhancements
- [ ] WebSocket for real-time analysis updates
- [ ] Email notifications for completed analyses
- [ ] Advanced analytics dashboard  
- [ ] Batch analysis operations
- [ ] Custom report generation
- [ ] Team collaboration features
- [ ] API key management
- [ ] Usage analytics & billing
---
## 📞 Support
For issues or questions:  
- Check logs: `npm run dev` shows detailed output
- Review .env configuration
- Test endpoints with curl/Postman
- Check MongoDB connection
---
**Built with ❤️ for developers who love AI**
