/**
 * AI Service Module
 * Handles all AI-related operations using Google Gemini API
 */

import axios from "axios";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Initialize AI service
 */
const initializeAI = () => {
  if (!GEMINI_API_KEY) {
    console.warn(
      "⚠️ Google API Key not found. AI features will use mock responses."
    );
  }
};

/**
 * Generate AI response for a given prompt
 */
export const generateAIResponse = async (prompt, options = {}) => {
  try {
    const {
      model = "gemini-2.0-flash",
      maxTokens = 500,
      temperature = 0.7,
      topP = 1,
    } = options;

    if (!GEMINI_API_KEY) {
      return getMockResponse(prompt);
    }

    const response = await axios.post(
      `${GEMINI_API_URL}/${model}:generateContent`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
          topP,
        },
      },
      {
        params: {
          key: GEMINI_API_KEY,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      content: response.data.candidates[0].content.parts[0].text,
      model,
      tokensUsed: response.data.usageMetadata?.promptTokenCount || 0,
      success: true,
    };
  } catch (error) {
    console.error("AI generation error:", error.message);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
};

/**
 * Analyze code quality using AI
 */
export const analyzeCodeQuality = async (code, language, analysisType) => {
  const prompt = `
Analyze the following ${language} code for ${analysisType || "quality, performance, and best practices"}:

\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis including:
1. Code Quality Issues (if any)
2. Performance Optimizations
3. Security Concerns (if any)
4. Best Practices Recommendations
5. Overall Rating (1-10)

Format the response in markdown.
  `;

  return generateAIResponse(prompt, { maxTokens: 1500 });
};

/**
 * Generate documentation for code
 */
export const generateDocumentation = async (code, language, style = "markdown") => {
  const styleGuides = {
    jsdoc: "JSDoc format",
    docstring: "Python docstring format",
    xml: "XML documentation format",
    markdown: "Markdown format",
  };

  const prompt = `
Generate comprehensive documentation for the following ${language} code in ${styleGuides[style] || "Markdown"} format:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Function/class descriptions
2. Parameters and return types
3. Usage examples
4. Error handling information

Format the documentation in ${styleGuides[style] || "Markdown"} format.
  `;

  return generateAIResponse(prompt, { maxTokens: 1000 });
};

/**
 * Generate code refactoring suggestions
 */
export const refactorCode = async (code, language) => {
  const prompt = `
Review and suggest refactoring improvements for the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Refactored code with improvements
2. Explanation of changes
3. Benefits of the refactoring
4. Best practices applied

Be specific and provide actual improved code.
  `;

  return generateAIResponse(prompt, { maxTokens: 1500 });
};

/**
 * Generate code from description
 */
export const generateCodeFromDescription = async (description, language) => {
  const prompt = `
Generate ${language} code based on the following description:

${description}

Requirements:
1. Write clean, production-ready code
2. Follow ${language} best practices
3. Include proper error handling
4. Add comments for clarity
5. Make it maintainable and scalable

Provide the complete code implementation.
  `;

  return generateAIResponse(prompt, { maxTokens: 1500 });
};

/**
 * Explain code functionality
 */
export const explainCode = async (code, language) => {
  const prompt = `
Provide a clear explanation of the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Include:
1. Overall Purpose
2. How it works step by step
3. Key Logic Breakdown
4. Important Details
5. Potential Edge Cases

Make it understandable for developers of all skill levels.
  `;

  return generateAIResponse(prompt, { maxTokens: 1000 });
};

/**
 * Analyze GitHub repository
 */
export const analyzeRepository = async (repoData) => {
  const { repoName, language, fileCount, description, topics } = repoData;

  const prompt = `
Analyze the GitHub repository with the following information:
- Repository: ${repoName}
- Primary Language: ${language}
- Total Files: ${fileCount}
- Description: ${description || "No description provided"}
- Topics: ${topics?.join(", ") || "None"}

Provide:
1. Repository Overview
2. Code Quality Assessment
3. Architecture Analysis
4. Strengths and Weaknesses
5. Improvement Recommendations
6. Overall Assessment Score (1-10)

Be professional and constructive.
  `;

  return generateAIResponse(prompt, { maxTokens: 1500 });
};

/**
 * Answer questions about code
 */
export const answerCodeQuestion = async (code, language, question) => {
  const prompt = `
Given the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

Answer this question: ${question}

Provide a detailed, clear answer that helps the developer understand the code better.
  `;

  return generateAIResponse(prompt, { maxTokens: 800 });
};

/**
 * Identify bugs in code
 */
export const identifyBugs = async (code, language) => {
  const prompt = `
Analyze the following ${language} code for potential bugs, errors, and vulnerabilities:

\`\`\`${language}
${code}
\`\`\`

For each issue found, provide:
1. Issue Type (bug, vulnerability, logic error, etc.)
2. Location in code
3. Description of the problem
4. Impact
5. Suggested Fix

If no issues found, state that clearly.
  `;

  return generateAIResponse(prompt, { maxTokens: 1200 });
};

/**
 * Mock response for when API key is not available
 */
const getMockResponse = (prompt) => {
  const mockResponses = {
    analysis: `
## Code Analysis

### Quality
Your code follows good practices with clear structure.

### Performance
Consider optimizing loops and database queries.

### Security
No critical security issues detected.

### Recommendations
1. Add more error handling
2. Consider using design patterns
3. Add comprehensive documentation
4. Implement unit tests

### Overall Rating: 7/10
    `,
    documentation: `
## Function Documentation

### Description
This function processes and returns data.

### Parameters
- input (string): The input data

### Returns
- (Object): Processed result

### Example
\`\`\`javascript
const result = processData("sample");
\`\`\`
    `,
    refactoring: `
## Refactoring Suggestions

Your code could be improved by:
1. Using more descriptive variable names
2. Breaking down into smaller functions
3. Using helper functions for repeated logic
4. Following SOLID principles

## Refactored Code
[Code improvements would be suggested here]
    `,
  };

  const responseType = prompt.toLowerCase().includes("analysis")
    ? "analysis"
    : prompt.toLowerCase().includes("documentation")
      ? "documentation"
      : "refactoring";

  return {
    content: mockResponses[responseType] || mockResponses.analysis,
    model: "gemini-2.0-flash (mock)",
    tokensUsed: 0,
    success: true,
    isMock: true,
  };
};

// Initialize on import
initializeAI();

export default {
  generateAIResponse,
  analyzeCodeQuality,
  generateDocumentation,
  refactorCode,
  generateCodeFromDescription,
  explainCode,
  analyzeRepository,
  answerCodeQuestion,
  identifyBugs,
};