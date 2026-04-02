import Groq from "groq-sdk";

/**
 * Get Groq client instance with API key from environment
 */
const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};

/**
 * Trim text to maximum 100 words
 * @param {string} text - Text to trim
 * @returns {string} - Trimmed text
 */
const trimTo100Words = (text) => {
  const words = text.split(/\s+/);
  if (words.length > 100) {
    return words.slice(0, 100).join(" ") + "...";
  }
  return text;
};

/**
 * Handle AI request using Groq API
 * @param {Object} req - Express request object
 * @param {string} req.body.code - Code to analyze
 * @param {string} req.body.prompt - User prompt/instruction
 * @param {Object} res - Express response object
 */
export const handleAI = async (req, res) => {
  try {
    const { code, prompt } = req.body;

    // Validate required fields
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    // Initialize Groq client
    const groq = getGroqClient();

    // Combine code and prompt into final message
    const finalPrompt = `${prompt || "Analyze and improve this code"}:\n\n\`\`\`\n${code}\n\`\`\``;

    // Call Groq API with Mixtral-8x7b model
    const message = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 1024,
    });

    // Extract text from response
    const reply = message.choices[0].message.content;
    
    // Trim reply to 100 words
    const trimmedReply = trimTo100Words(reply);

    // Return success response
    res.json({
      success: true,
      reply: trimmedReply,
    });
  } catch (error) {
    console.error("Groq Error:", error.message);
    console.error("Full Error:", error);
    res.status(500).json({
      success: false,
      message: "AI processing failed",
      error: error.message,
    });
  }
};