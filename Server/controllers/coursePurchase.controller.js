import Stripe from "stripe";
import db from "../database/db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.body;

    const get_course_query = `SELECT * FROM courses WHERE id = $1`;
    const result = await db.query(get_course_query, [id]);
    const course = result.rows[0];

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    // Check if user already purchased this course
    const check_purchase_query = `
      SELECT * FROM course_purchases 
      WHERE user_id = $1 AND course_id = $2 AND status = 'completed'
    `;
    const existingPurchase = await db.query(check_purchase_query, [userId, id]);

    if (existingPurchase.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Course already purchased!",
      });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.course_title,
              images: course.course_thumbnail ? [course.course_thumbnail] : [],
            },
            unit_amount: Math.round(parseFloat(course.course_price) * 100), // Amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://lmsdeploy-t2vu.onrender.com/api/v1/course-progress/${id}`,
      cancel_url: `https://lmsdeploy-t2vu.onrender.com/api/v1/course-detail/${id}`,
      metadata: {
        courseId: id,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (!session.url) {
      return res.status(400).json({
        success: false,
        message: "Error while creating session",
      });
    }

    // Create a new course purchase record
    const create_payment_query = `
      INSERT INTO course_purchases (course_id, user_id, amount, status, payment_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const purchaseResult = await db.query(create_payment_query, [
      id,
      userId,
      parseFloat(course.course_price),
      "pending",
      session.id,
    ]);

    return res.status(200).json({
      success: true,
      url: session.url,
      purchase: purchaseResult.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
    });
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = JSON.stringify(req.body, null, 2);
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    });

    event = stripe.webhooks.constructEvent(payloadString, header, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("Checkout session completed");

    try {
      const session = event.data.object;

      // Find the purchase record
      const get_purchase_query = `SELECT * FROM course_purchases WHERE payment_id = $1`;
      const result = await db.query(get_purchase_query, [session.id]);
      const purchase = result.rows[0];

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      await db.query("BEGIN");

      // Update purchase status
      const update_purchase_query = `
        UPDATE course_purchases 
        SET status = 'completed', 
            amount = $1, 
            updated_at = CURRENT_TIMESTAMP
        WHERE payment_id = $2
      `;
      await db.query(update_purchase_query, [
        session.amount_total / 100,
        session.id,
      ]);

      // Make all lectures free for this course
      const update_lectures_query = `
        UPDATE course_lectures 
        SET is_preview_free = true 
        WHERE course_id = $1
      `;
      await db.query(update_lectures_query, [purchase.course_id]);

      // Add user to enrolled courses (using user_courses table)
      const enroll_user_query = `
        INSERT INTO user_courses (user_id, course_id, enrolled_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, course_id) DO NOTHING
      `;
      await db.query(enroll_user_query, [purchase.user_id, purchase.course_id]);

      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      console.error("Error handling webhook:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    // Get course with instructor details and lectures
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
    const course = courseResult.rows[0];

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
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

    // Check if user purchased this course
    const check_purchase_query = `
      SELECT * FROM course_purchases 
      WHERE user_id = $1 AND course_id = $2 AND status = 'completed'
    `;
    const purchaseResult = await db.query(check_purchase_query, [userId, id]);
    const purchased = purchaseResult.rows.length > 0;

    return res.status(200).json({
      course: {
        ...course,
        lectures: lecturesResult.rows,
      },
      purchased,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course details",
    });
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const userId = req.user.userId;

    const get_purchased_courses_query = `
      SELECT 
        cp.*,
        c.course_title,
        c.course_thumbnail,
        c.category,
        c.course_level,
        u.name as instructor_name
      FROM course_purchases cp
      JOIN courses c ON cp.course_id = c.id
      LEFT JOIN instructor_courses ic ON c.id = ic.course_id
      LEFT JOIN users u ON ic.instructor_id = u.id
      WHERE cp.user_id = $1 AND cp.status = 'completed'
      ORDER BY cp.created_at DESC
    `;

    const result = await db.query(get_purchased_courses_query, [userId]);
    const purchasedCourses = result.rows;

    return res.status(200).json({
      success: true,
      purchasedCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get purchased courses",
    });
  }
};
