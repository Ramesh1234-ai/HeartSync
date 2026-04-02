import Chat from "../model/chat.model.js";

/**
 * Extract first message as title
 * @param {string} text - First message text
 * @returns {string} - Title (max 50 chars)
 */
const generateTitle = (text) => {
  const maxLength = 50;
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

/**
 * Create a new chat
 * POST /api/chat
 */
export const createChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const messages = req.body.messages || [];

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Generate title from first user message
    let title = "New Chat";
    const firstUserMessage = messages.find((msg) => msg.role === "user");
    if (firstUserMessage) {
      title = generateTitle(firstUserMessage.content);
    }

    const chat = new Chat({
      userId,
      title,
      messages,
    });

    await chat.save();

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error("Create Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat",
      error: error.message,
    });
  }
};

/**
 * Get all chats for a user
 * GET /api/chats
 */
export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    // Get chats sorted by latest first
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select("_id title createdAt messages");

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get Chats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
      error: error.message,
    });
  }
};

/**
 * Get a single chat by ID
 * GET /api/chats/:id
 */
export const getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Get Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

/**
 * Add a message to an existing chat
 * PUT /api/chats/:id/message
 */
export const addMessageToChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, content } = req.body;

    if (!userId || !role || !content) {
      return res.status(400).json({
        success: false,
        message: "UserId, role, and content are required",
      });
    }

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Add message to chat
    chat.messages.push({
      role,
      content,
    });

    await chat.save();

    res.json({
      success: true,
      message: "Message added successfully",
      chat,
    });
  } catch (error) {
    console.error("Add Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add message",
      error: error.message,
    });
  }
};

/**
 * Delete a chat
 * DELETE /api/chats/:id
 */
export const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserId is required",
      });
    }

    const result = await Chat.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};
