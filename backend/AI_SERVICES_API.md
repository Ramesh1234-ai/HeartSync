# AI Services API Documentation

## Overview
The AI Services module provides comprehensive AI-powered code analysis, generation, and assistance features using Google Gemini API.

---

## 📁 File Structure

```
backend/
├── middleware/
│   └── ai_services.js          # AI middleware (validation, quota, rate limiting)
├── routes/
│   └── ai_services.route.js    # AI API endpoints
└── services/
    └── ai_service.js            # Core AI logic and service functions
```

---

## 🔧 Middleware (`middleware/ai_services.js`)

### 1. **validateAIRequest**
Validates general AI request payloads.
```javascript
export const validateAIRequest = (req, res, next)
```
- Checks for `message` field (required, string, max 5000 chars)
- Validates `type` field (optional: analysis, chat, generation, review)
- Validates `context` field (optional)

### 2. **validateCodeAnalysis**
Validates code analysis requests.
```javascript
export const validateCodeAnalysis = (req, res, next)
```
- Requires `code` and `language` fields
- Validates language against supported list
- Optional `analysisType`: quality, performance, security, style, bugs

### 3. **validateDocGeneration**
Validates documentation generation requests.
```javascript
export const validateDocGeneration = (req, res, next)
```
- Requires `code` field
- Optional `style`: jsdoc, docstring, xml, markdown

### 4. **sanitizeInput**
Prevents prompt injection attacks.
```javascript
export const sanitizeInput = (req, res, next)
```
- Removes control characters
- Trims and limits input length
- Applies to message, query, and prompt fields

### 5. **checkAIQuota**
Enforces user AI request quotas.
```javascript
export const checkAIQuota = async (req, res, next)
```
- Free: 50 requests/month
- Pro: 500 requests/month
- Enterprise: Unlimited

### 6. **aiRateLimit**
Rate limits AI endpoints (10 requests per minute).
```javascript
export const aiRateLimit = (req, res, next)
```

---

## 🚀 API Endpoints (`routes/ai_services.route.js`)

All endpoints require authentication via `verifyClerkAuth` middleware.

### Base URL
```
/api/ai
```

### 1. **Health Check**
```
GET /api/ai/
```
Returns available endpoints and API info.

**Response:**
```json
{
  "message": "AI Services API",
  "version": "1.0.0",
  "endpoints": {
    "analyze": "POST /analyze-code",
    "generate": "POST /generate-code",
    "document": "POST /generate-docs",
    ...
  }
}
```

---

### 2. **Available Models**
```
GET /api/ai/available-models
```
Lists available AI models and their capabilities.

**Response:**
```json
{
  "models": [
    {
      "id": "gemini-2.0-flash",
      "name": "Gemini 2.0 Flash",
      "capabilities": ["code-analysis", "documentation", ...],
      "maxTokens": 4000
    }
  ],
  "supportedLanguages": ["javascript", "python", "java", ...]
}
```

---

### 3. **Analyze Code Quality**
```
POST /api/ai/analyze-code
```
Analyzes code for quality, performance, security, and best practices.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript",
  "analysisType": "quality"  // optional: quality, performance, security, style, bugs
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "## Code Analysis\n\n### Quality\n...",
  "model": "gemini-2.0-flash",
  "quotaRemaining": 49
}
```

---

### 4. **Generate Code**
```
POST /api/ai/generate-code
```
Generates code based on description.

**Request:**
```json
{
  "message": "Create a function that validates email addresses",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "code": "function validateEmail(email) { ... }",
  "language": "javascript",
  "quotaRemaining": 48
}
```

---

### 5. **Generate Documentation**
```
POST /api/ai/generate-docs
```
Generates documentation for code.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript",
  "style": "jsdoc"  // optional: jsdoc, docstring, xml, markdown
}
```

**Response:**
```json
{
  "success": true,
  "documentation": "/**\n * Function description\n * ...\n */",
  "style": "jsdoc",
  "quotaRemaining": 47
}
```

---

### 6. **Refactor Code**
```
POST /api/ai/refactor-code
```
Suggests code refactoring improvements.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "refactoredCode": "function example() { ... }",
  "language": "javascript",
  "quotaRemaining": 46
}
```

---

### 7. **Explain Code**
```
POST /api/ai/explain-code
```
Provides detailed explanation of code functionality.

**Request:**
```json
{
  "code": "const arr = [1,2,3].map(x => x * 2);",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "explanation": "This code uses the map function to multiply each array element by 2...",
  "quotaRemaining": 45
}
```

---

### 8. **Identify Bugs**
```
POST /api/ai/identify-bugs
```
Detects potential bugs, vulnerabilities, and logic errors.

**Request:**
```json
{
  "code": "function process(data) { ... }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "success": true,
  "bugs": "## Bug Analysis\n\n### Issues Found\n1. ...",
  "quotaRemaining": 44
}
```

---

### 9. **Answer Code Question**
```
POST /api/ai/answer-question
```
Answers specific questions about code.

**Request:**
```json
{
  "code": "function example() { ... }",
  "language": "javascript",
  "message": "What does this function do?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "This function performs the following tasks: ...",
  "quotaRemaining": 43
}
```

---

### 10. **Analyze Repository**
```
POST /api/ai/analyze-repo
```
Analyzes a GitHub repository.

**Request:**
```json
{
  "repoName": "user/awesome-project",
  "language": "javascript",
  "fileCount": 150,
  "description": "An awesome project",
  "topics": ["ai", "web-dev"]
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "## Repository Analysis\n\n### Overview\n...",
  "quotaRemaining": 42
}
```

---

### 11. **Get Usage Statistics**
```
GET /api/ai/usage
```
Retrieves user's AI quota usage.

**Response:**
```json
{
  "plan": "free",
  "quota": 50,
  "used": 8,
  "remaining": 42,
  "percentage": "16.00",
  "resetDate": "2026-04-12T00:00:00.000Z"
}
```

---

## 🔑 AI Service Functions (`services/ai_service.js`)

### 1. **generateAIResponse**
```javascript
export const generateAIResponse = async (prompt, options = {})
```
Core function for generating AI responses.

**Options:**
```javascript
{
  model: "gemini-2.0-flash",
  maxTokens: 500,
  temperature: 0.7,
  topP: 1
}
```

---

### 2. **analyzeCodeQuality**
```javascript
export const analyzeCodeQuality = async (code, language, analysisType)
```
Analyzes code quality, performance, and security.

---

### 3. **generateDocumentation**
```javascript
export const generateDocumentation = async (code, language, style)
```
Generates documentation in various formats.

---

### 4. **refactorCode**
```javascript
export const refactorCode = async (code, language)
```
Suggests code refactoring improvements.

---

### 5. **generateCodeFromDescription**
```javascript
export const generateCodeFromDescription = async (description, language)
```
Generates code from natural language description.

---

### 6. **explainCode**
```javascript
export const explainCode = async (code, language)
```
Provides detailed code explanation.

---

### 7. **analyzeRepository**
```javascript
export const analyzeRepository = async (repoData)
```
Analyzes GitHub repository metadata.

---

### 8. **answerCodeQuestion**
```javascript
export const answerCodeQuestion = async (code, language, question)
```
Answers questions about code.

---

### 9. **identifyBugs**
```javascript
export const identifyBugs = async (code, language)
```
Identifies bugs and vulnerabilities.

---

## 🔐 Authentication & Authorization

All endpoints require:
1. Valid Clerk JWT token in `Authorization: Bearer <token>` header
2. Valid user in database
3. Sufficient AI quota

---

## 📊 Supported Languages

- JavaScript/TypeScript
- Python
- Java
- C++
- C#
- Go
- Rust
- PHP
- Ruby
- And more...

---

## ⚠️ Error Handling

Standard error responses:

```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

**Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `429` - Too Many Requests (quota/rate limit exceeded)
- `500` - Server Error

---

## 🔄 Usage Example

### Request:
```bash
curl -X POST http://localhost:3000/api/ai/analyze-code \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript",
    "analysisType": "quality"
  }'
```

### Response:
```json
{
  "success": true,
  "analysis": "## Code Analysis\n\n...",
  "model": "gemini-2.0-flash",
  "quotaRemaining": 49
}
```

---

## 📝 Environment Variables

Add to `.env`:
```
GOOGLE_API_KEY=your_google_api_key
```

If not set, the API uses mock responses for testing.

---

## 🎯 Quota Limits

| Plan       | Monthly Quota | Use Case |
|-----------|--------------|----------|
| Free      | 50 requests  | Learning, small projects |
| Pro       | 500 requests | Regular usage, small teams |
| Enterprise| Unlimited    | Large organizations |

Quotas reset on the first day of each month.

---

## 🚦 Rate Limiting

- General API: 100 requests per 15 minutes
- AI Endpoints: 10 requests per minute per user
- Auth Endpoints: 5 attempts per 15 minutes

---

## 📚 Integration with Frontend

Example React hook:

```javascript
const analyzeCode = async (code, language) => {
  const response = await fetch('/api/ai/analyze-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ code, language, analysisType: 'quality' })
  });
  return response.json();
};
```

---

## 🔧 Development Notes

- Mock responses enabled when API key not set
- All requests sanitized to prevent prompt injection
- Quota tracking per user per month
- Comprehensive error messages for debugging
- Modular service architecture for easy extension

---

## 📞 Support

For issues or questions about the AI Services API:
1. Check error messages for specific details
2. Verify API key configuration
3. Check user quota and plan
4. Review request format and validation rules
