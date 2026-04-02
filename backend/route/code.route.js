import express from "express";
import HandleCode from "../controller/code.controller.js"
const Router=express.Router();
Router.post("/",HandleCode);
export default Router;