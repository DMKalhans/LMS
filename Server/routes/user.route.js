import express from "express";  
import { getUserProfile, login, logout, signup } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(signup)
router.route("/login").post(login)
router.route("/logout").get(logout) 
router.route("/profile").get(isAuthenticated, getUserProfile)
router.route("/learning").get(isAuthenticated, getUserProfile)

export default router;