import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoute.js";
import DoctorRoutes from "./src/routes/docterRoute.js";
import cookieParser from "cookie-parser";
// Import your signup route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5177",
    credentials: true,
  })
);
app.use(bodyParser.json()); // Parse JSON request body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Express.js API!");
});

app.use("/api", authRoutes); // ✅ Attach the signup route
app.use("/api/docter", DoctorRoutes); // ✅ Attach the signup route

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
