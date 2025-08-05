import express from "express";  
import { login, signup } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register").post(signup)
router.route("/login").post(login)

export default router;