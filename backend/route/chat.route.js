import express from "express";
import {
  createChat,
  getUserChats,
  getChatById,
  addMessageToChat,
  deleteChat,
} from "../controller/chat.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAuth);

/**
 * POST /api/chat
 * Create a new chat
 */
router.post("/", createChat);

/**
 * GET /api/chats
 * Get all chats for logged-in user
 */
router.get("/", getUserChats);

/**
 * GET /api/chats/:id
 * Get a single chat by ID
 */
router.get("/:id", getChatById);

/**
 * PUT /api/chats/:id/message
 * Add a message to an existing chat
 */
router.put("/:id/message", addMessageToChat);

/**
 * DELETE /api/chats/:id
 * Delete a chat
 */
router.delete("/:id", deleteChat);

export default router;
