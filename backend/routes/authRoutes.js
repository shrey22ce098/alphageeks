

import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";


const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error); // Logs the exact error
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/login", loginUser);

export default router;
