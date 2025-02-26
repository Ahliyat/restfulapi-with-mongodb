import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import morgan from "morgan";

// Load env variables
// dotenv.config({ path: './config/config.env' });
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const PORT = process.env.PORT || 8000;

// homepage
app.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

// Auth Route
app.use("/api/v1", authRoute);

// connect to database
const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database successfully connected");
  } catch (error) {
    console.log(error);
  }
};
connection();

// listen to the server
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
