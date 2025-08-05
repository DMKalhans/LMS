import db from "../database/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const saltRounds = 10;

export const signup = async (req, res) => {
  try {
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
      generateToken(res, user, `Welcome Back ${user.name}`)
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login, try again",
    });
  }
};
