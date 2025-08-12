import db from "../database/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { deleteMediaFromCLoudinary, uploadMedia } from "../utils/cloudinary.js";

const saltRounds = 10;

export const signup = async (req, res) => {
  try {
    console.log(
      "signup called inside user.controller.js and data recieved is:",
      req.body
    );
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    return res.status(201).json({
      success: true,
      message: "User created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register, try again",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(400).json({
        success: false,
        message: "User not found",
      });

    const user = result.rows[0];
    const userHashedPassword = user.password;

    const isMatch = await bcrypt.compare(password, userHashedPassword);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Incorrect Password!!",
      });
    generateToken(res, user, `Welcome back ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login, try again",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout, try again",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    //console.log("User is obtained from isAuthenticated => getUserProfile as",req.user);
    
    const userId = req.user.userId;
    
    const result = await db.query(
      `SELECT users.id, users.name, users.email, users.role, users.photo_url,  COALESCE(ARRAY_AGG(user_courses.course_id), '{}') AS courses 
      FROM users 
      LEFT JOIN user_courses ON users.id = user_courses.user_id 
      WHERE id = $1
      GROUP BY users.id, users.name, users.email, users.role, users.photo_url;`,
      [userId]
    );
    const user = result.rows[0];

    //console.log("User is extracted from database based on userId inside req.user as: ",user);

    if (!user)
      return res.status(404).json({
        message: "Profile not found!",
        success: false,
      });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile, try again",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const userName = req.body.name;
    const profilePhoto = req.file;
    // Get user from backend
    const userResult = await db.query(
      `SELECT users.name as name, users.photo_url as photo_url FROM users WHERE id = $1;`,
      [userId]
    );
    const user = userResult.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    let photoUrl;
    if (profilePhoto) {
      // If user already has a profile photo - delete it.
      if (user.photo_url) {
        const publicId = user.photo_url.split("/").pop().split(".")[0]; //extract publicId from photo_url
        await deleteMediaFromCLoudinary(publicId);
      }

      // Upload new image to cloudinary
      const cloudResponse = await uploadMedia(profilePhoto.path);
      photoUrl = cloudResponse.secure_url;
    }

    //update db fields for name and photo_url accordingly - can refactor this section and use dynamic construction of query
    if (!userName && !photoUrl) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update.",
      });
    }
    if (userName && photoUrl) {
      await db.query(
        "UPDATE users SET name = $1, photo_url = $2 WHERE id = $3",
        [userName, photoUrl, userId]
      );
    } else if (userName) {
      await db.query("UPDATE users SET name = $1 WHERE id = $2", [
        userName,
        userId,
      ]);
    } else if (photoUrl) {
      await db.query("UPDATE users SET photo_url = $1 WHERE id = $2", [
        photoUrl,
        userId,
      ]);
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
