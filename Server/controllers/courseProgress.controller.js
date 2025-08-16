import db from "../database/db.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get course details with lectures
    const get_course_query = `
      SELECT 
        c.*,
        u.name as instructor_name,
        u.photo_url as instructor_photo_url,
        u.email as instructor_email
      FROM courses c
      LEFT JOIN instructor_courses ic ON c.id = ic.course_id
      LEFT JOIN users u ON ic.instructor_id = u.id
      WHERE c.id = $1
    `;
    const courseResult = await db.query(get_course_query, [id]);
    const courseDetails = courseResult.rows[0];

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get course lectures
    const get_lectures_query = `
      SELECT l.* 
      FROM lectures l
      JOIN course_lectures cl ON l.id = cl.lecture_id
      WHERE cl.course_id = $1
      ORDER BY l.created_at ASC
    `;
    const lecturesResult = await db.query(get_lectures_query, [id]);
    const lectures = lecturesResult.rows;

    // Get course progress
    const get_progress_query = `
      SELECT * FROM course_progress 
      WHERE course_id = $1 AND user_id = $2
    `;
    const progressResult = await db.query(get_progress_query, [id, userId]);
    const courseProgress = progressResult.rows[0];

    // If no progress found, return course details with empty progress
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails: {
            ...courseDetails,
            lectures: lectures,
          },
          progress: [],
          completed: false,
        },
      });
    }

    // Return the user's course progress along with course details
    return res.status(200).json({
      success: true,
      data: {
        courseDetails: {
          ...courseDetails,
          lectures: lectures,
        },
        progress: courseProgress.lecture_progress || [],
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log("Error in getCourseProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course progress",
    });
  }
};

export const updateLectureProgress = async (req, res) => {
  try {
    const { id, lectureId } = req.params;
    const userId = req.user.userId;

    await db.query("BEGIN");

    // Get or create course progress
    const get_progress_query = `
      SELECT * FROM course_progress 
      WHERE course_id = $1 AND user_id = $2
    `;
    let progressResult = await db.query(get_progress_query, [id, userId]);
    let courseProgress = progressResult.rows[0];

    if (!courseProgress) {
      // Create new course progress
      const create_progress_query = `
        INSERT INTO course_progress (user_id, course_id, completed, lecture_progress, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const newProgressResult = await db.query(create_progress_query, [
        userId,
        id,
        false,
        JSON.stringify([{ lecture_id: lectureId, viewed: true }]),
      ]);
      courseProgress = newProgressResult.rows[0];
    } else {
      // Update existing progress
      let lectureProgress = courseProgress.lecture_progress || [];

      // Find if this lecture already exists in progress
      const existingLectureIndex = lectureProgress.findIndex(
        (progress) => progress.lecture_id === lectureId
      );

      if (existingLectureIndex !== -1) {
        // Update existing lecture progress
        lectureProgress[existingLectureIndex].viewed = true;
      } else {
        // Add new lecture progress
        lectureProgress.push({ lecture_id: lectureId, viewed: true });
      }

      // Update course progress
      const update_progress_query = `
        UPDATE course_progress 
        SET lecture_progress = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      await db.query(update_progress_query, [
        JSON.stringify(lectureProgress),
        courseProgress.id,
      ]);
    }

    // Check if all lectures are completed
    const count_total_lectures_query = `
      SELECT COUNT(*) as total_count
      FROM lectures l
      JOIN course_lectures cl ON l.id = cl.lecture_id
      WHERE cl.course_id = $1
    `;
    const totalLecturesResult = await db.query(count_total_lectures_query, [
      id,
    ]);
    const totalLectures = parseInt(totalLecturesResult.rows[0].total_count);

    // Get updated progress to check completion
    const updated_progress_query = `
      SELECT * FROM course_progress 
      WHERE course_id = $1 AND user_id = $2
    `;
    const updatedResult = await db.query(updated_progress_query, [id, userId]);
    const updatedProgress = updatedResult.rows[0];

    const completedLectures = (updatedProgress.lecture_progress || []).filter(
      (progress) => progress.viewed
    ).length;

    // If all lectures are completed, mark course as completed
    if (totalLectures === completedLectures) {
      const update_course_query = `
        UPDATE course_progress 
        SET completed = true, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `;
      await db.query(update_course_query, [updatedProgress.id]);
    }

    await db.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully.",
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.log("Error in updateLectureProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress",
    });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Get all lectures for this course
    const get_lectures_query = `
      SELECT l.id
      FROM lectures l
      JOIN course_lectures cl ON l.id = cl.lecture_id
      WHERE cl.course_id = $1
    `;
    const lecturesResult = await db.query(get_lectures_query, [id]);
    const lectures = lecturesResult.rows;

    // Create lecture progress for all lectures as viewed
    const allLectureProgress = lectures.map((lecture) => ({
      lecture_id: lecture.id,
      viewed: true,
    }));

    // Get or create course progress
    const get_progress_query = `
      SELECT * FROM course_progress 
      WHERE course_id = $1 AND user_id = $2
    `;
    const progressResult = await db.query(get_progress_query, [id, userId]);
    const courseProgress = progressResult.rows[0];

    if (!courseProgress) {
      // Create new completed course progress
      const create_progress_query = `
        INSERT INTO course_progress (user_id, course_id, completed, lecture_progress, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      await db.query(create_progress_query, [
        userId,
        id,
        true,
        JSON.stringify(allLectureProgress),
      ]);
    } else {
      // Update existing progress
      const update_progress_query = `
        UPDATE course_progress 
        SET completed = true, lecture_progress = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;
      await db.query(update_progress_query, [
        JSON.stringify(allLectureProgress),
        courseProgress.id,
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Course marked as completed.",
    });
  } catch (error) {
    console.log("Error in markAsCompleted:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed",
    });
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Update course progress to incomplete and clear lecture progress
    const update_progress_query = `
      UPDATE course_progress 
      SET completed = false, lecture_progress = '[]', updated_at = CURRENT_TIMESTAMP
      WHERE course_id = $1 AND user_id = $2
    `;
    await db.query(update_progress_query, [id, userId]);

    return res.status(200).json({
      success: true,
      message: "Course marked as incomplete.",
    });
  } catch (error) {
    console.log("Error in markAsInCompleted:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incomplete",
    });
  }
};
