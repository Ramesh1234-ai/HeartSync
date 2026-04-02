import express from "express";
import { handleAI } from "../controller/gemini.controller.js";
const router = express.Router();
router.post("/", handleAI);
export default router;