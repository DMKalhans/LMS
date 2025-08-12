import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getInstructorCourses, getLectureById, removeLecture } from "../controllers/course.controller.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/").get(isAuthenticated, getInstructorCourses);
router.route("/:id").put(isAuthenticated,upload.single("courseThumbnail"), editCourse);
router.route("/:id").get(isAuthenticated, getCourseById);
router.route("/:id/lectures").post(isAuthenticated, createLecture);
router.route("/:id/lectures").get(isAuthenticated, getCourseLecture);
router.route("/:id/lectures/:lectureId").post(isAuthenticated, editLecture);
router.route("/:id/lectures/:lectureId").delete(isAuthenticated, removeLecture);
router.route("/:id/lectures/:lectureId").get(isAuthenticated, getLectureById);

export default router;