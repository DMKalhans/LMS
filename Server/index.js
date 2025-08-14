import express from "express";
import dotenv from "dotenv";
import db from "./database/db.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import courseRoute from "./routes/course.route.js"
import mediaRoute from "./routes/media.route.js";

dotenv.config({});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute)

app.listen(port, () => {
  console.log(`Server is running at port ${port} `);
});
