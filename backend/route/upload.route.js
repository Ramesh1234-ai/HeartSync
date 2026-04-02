import express from "express";
import { Upload } from "../controller/upload.controller";
const router =express.Router();
router.post("/",Upload);
export default router;