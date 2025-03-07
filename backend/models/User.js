// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String
// });

// module.exports = mongoose.model("User", UserSchema);


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;


