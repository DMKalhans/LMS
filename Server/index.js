import express from "express";
import dotenv from "dotenv";
import db from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import progressRoute from "./routes/courseProgress.route.js";

dotenv.config({});

const app = express();
const port = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // Your live Vercel URL will be loaded from this variable
];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/course-progress", progressRoute);

app.listen(port, () => {
  console.log(`Server is running at port ${port} `);
});
