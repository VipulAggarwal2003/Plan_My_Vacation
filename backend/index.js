import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import packageRoute from "./routes/package.route.js";
import ratingRoute from "./routes/rating.route.js";
import bookingRoute from "./routes/booking.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import multer from "multer";
import { getAllUsers } from "./controllers/user.controller.js";
import { getAllBookings } from "./controllers/booking.controller.js";
const app = express();
dotenv.config();

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: [
      process.env.SERVER_URL,
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));

// For URL-encoded payloads
app.use(express.urlencoded({ limit: '15mb', extended: true }));
app.use(multer().any());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.get("/api/booking/get-allBookings",getAllBookings);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);

if (process.env.NODE_ENV_CUSTOM === "production") {
  //static files
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  // //rest api
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

//port
app.listen(8000, () => {
  console.log("listening on 8000");
});
