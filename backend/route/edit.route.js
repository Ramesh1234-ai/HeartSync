import express from "express";
import { HandleEdit } from "../controller/edit.controller.js"
const router=express.Router()
router.post("/edit/{id}",HandleEdit)
export default router;