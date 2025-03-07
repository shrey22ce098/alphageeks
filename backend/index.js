// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import mongoose from "mongoose";
// import chatRoutes from "./routes/chatRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors());

// // Routes
// app.use("/api/chat", chatRoutes);
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     })
//     .catch((err) => console.log("DB Connection Error:", err));


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("🤖 Health Chatbot API Running..."));

// Connect to MongoDB
connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error("❌ MongoDB Connection Error:", err));
