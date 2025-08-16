import express from "express";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  updateLectureProgress,
} from "../controllers/courseProgress.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/:id").get(isAuthenticated, getCourseProgress);
router
  .route("/:id/lecture/:lectureId/view")
  .post(isAuthenticated, updateLectureProgress);
router.route("/:id/complete").post(isAuthenticated, markAsCompleted);
router.route("/:id/incomplete").post(isAuthenticated, markAsInCompleted);

export default router;
