import db from "../database/db.js";
import {
  deleteMediaFromCLoudinary,
  deleteVideoFromCLoudinary,
  uploadMedia,
} from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
  try {
    //console.log("Req.id and req.body inside createCourse is received as: ", req.user.userId, req.body);
    const { courseTitle, category } = req.body;
    const id = req.user.userId;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required.",
      });
    }

    await db.query("BEGIN");

    const courseRes = await db.query(
      `INSERT INTO courses (course_title, category) 
     VALUES ($1, $2) 
     RETURNING *`,
      [courseTitle, category]
    );
    const course = courseRes.rows[0];

    const linkCourse = await db.query(
      `INSERT INTO instructor_courses (instructor_id, course_id) 
     VALUES ($1, $2) 
     RETURNING *`,
      [id, course.id]
    );
    const instructorCourse = linkCourse.rows[0];

    await db.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: { course, instructorCourse },
    });
  } catch (error) {
    try {
      await db.query("ROLLBACK");
    } catch {}
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to create the course.",
    });
  }
};

export const getInstructorCourses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await db.query(
      `SELECT * FROM courses
       JOIN instructor_courses 
       ON courses.id = instructor_courses.course_id 
       WHERE instructor_courses.instructor_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        course: [],
        message: "No courses found for the instructor.",
      });
    }
    const courses = result.rows;

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all courses.",
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;

    const result = await db.query(`SELECT * FROM courses WHERE id = $1`, [
      courseId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }
    const course = result.rows[0];

    let courseThumbnail;

    if (thumbnail) {
      if (course.course_thumbnail) {
        const publicId = course.course_thumbnail.split("/").pop().split(".")[0];
        console.log("Public id of existing thumbnail: ", publicId);
        await deleteMediaFromCLoudinary(publicId);
      }
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    await db.query(
      `UPDATE courses SET course_title = $1, subtitle = $2, description = $3, category = $4, course_level = $5,course_price = $6, course_thumbnail = $7 WHERE id = $8`,
      [
        courseTitle,
        subTitle,
        description,
        category,
        courseLevel,
        coursePrice,
        courseThumbnail?.secure_url,
        courseId,
      ]
    );
    console.log("Course updated successfully");

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit course.",
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const result = await db.query("SELECT * FROM courses WHERE id = $1", [
      courseId,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }
    const course = result.rows[0];
    return res.status(200).json({
      success: true,
      message: "Course fetched successfully.",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course.",
    });
  }
};

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { id } = req.params;

    if (!lectureTitle || !id) {
      return res.status(400).json({
        success: false,
        message: "Lecture Title and Course Id are required.",
      });
    }

    const result = await db.query(
      "INSERT INTO lectures (lecture_title) VALUES ($1) RETURNING lectures.id",
      [lectureTitle]
    );
    const lectureId = result.rows[0].id;
    await db.query(
      "INSERT INTO course_lectures (course_id, lecture_id) VALUES ($1, $2) ",
      [id, lectureId]
    );
    return res.status(201).json({
      success: true,
      message: "Lecture created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture.",
    });
  }
};

export const getCourseLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT lectures.id, lectures.lecture_title, lectures.video_url, lectures.public_id, lectures.duration_seconds, lectures.status FROM lectures
      JOIN course_lectures ON
      course_lectures.lecture_id = lectures.id
      WHERE course_lectures.course_id = $1
      ORDER BY lectures.id ASC`,
      [id]
    );
    const lectures = result.rows;
    console.log(lectures);
    return res.status(200).json({
      success: true,
      message: "Lectures retrieved successfully.",
      lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures.",
    });
  }
};

export const editLecture = async (req, res) => {
  try {
    const { lectureTitle, uploadVidInfo, isFree } = req.body;
    const { id, lectureId } = req.params;

    //If lectureTitle is not provided then update the video info only
    if (lectureTitle && uploadVidInfo) {
      await db.query(
        `UPDATE lectures SET lecture_title = $1, video_url = $2, public_id = $3 WHERE id = $4`,
        [lectureTitle, uploadVidInfo.videoUrl, uploadVidInfo.publicId, lectureId]
      );
    } else if(!lectureTitle){
      await db.query(
        `UPDATE lectures SET  video_url = $1, public_id = $2 WHERE id = $3`,
        [uploadVidInfo.videoUrl, uploadVidInfo.publicId, lectureId]
      );
    }
    else if(!uploadVidInfo){
       await db.query(
        `UPDATE lectures SET lecture_title = $1 WHERE id = $2`,
        [lectureTitle,lectureId]
      );
    }

    //Update is_preview_free in courses_lecture table
    await db.query(
      `UPDATE course_lectures SET is_preview_free = $1 where lecture_id = $2`,
      [isFree, lectureId]
    );
    console.log("Successfully updated");
    return res.status(200).json({
      success: true,
      message: "Lecture edited successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture.",
    });
  }
};

export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    //Delete the video from Cloudinary
    const result = await db.query(
      `SELECT public_id FROM lectures where id = $1`,
      [lectureId]
    );
    const public_id = result.rows[0].public_id;
    if (public_id) {
      await deleteVideoFromCLoudinary(public_id);
    }

    //Delete the lecture reference from the course_lectures table
    await db.query(`DELETE FROM course_lectures WHERE lecture_id = $1`, [
      lectureId,
    ]);

    //Delete the lecture altogether
    await db.query(`DELETE FROM lectures WHERE id = $1`, [lectureId]);
    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully.",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete lecture.",
    });
  }
};

export const getLectureById = async (req, res) => {
  try {
    const {lectureId} = req.params;

  const result = await db.query(`SELECT * FROM lectures WHERE id = $1`, [
    lectureId,
  ]);

  const lecture = result.rows[0];
  return res.status(200).json({
    success: true,
    message: "Lecture retrieved successfully.",
    lecture,
  });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture.",
    });
  }
};

