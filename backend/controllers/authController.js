// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// exports.register = async (req, res) => {
//   const { username, email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ username, email, password: hashedPassword });
//   await user.save();
//   res.status(201).json({ message: "User registered" });
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !await bcrypt.compare(password, user.password)) {
//     return res.status(400).json({ message: "Invalid credentials" });
//   }
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//   res.json({ token, user });
// };


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
