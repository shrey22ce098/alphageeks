// import express from "express";
// import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { z } from "zod";

// const router = express.Router();
// const prisma = new PrismaClient();
// const SECRET_KEY = process.env.SECRET_KEY || "kunj";

// const signupSchema = z.object({
//   // name: z.string().min(3, "Name must be at least 3 characters long"),
//   email: z.string().email("Invalid email format"),
//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters long")
//     .regex(/[0-9]/, "Password must contain at least one digit (0-9)")
//     .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@, $, !, %, *, ?, &, #)")
//     .regex(/[a-z]/, "Password must contain at least one lowercase letter")
//     .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
//   phone: z.string().length(10),
//   gender: z.enum(["male", "female", "other"]),
// });

// router.post("/", async (req, res) => {
//   try {
//     const validatedData = signupSchema.parse(req.body);
//     const { name, email, password, phone, gender } = validatedData;

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ email }, { phone }],
//       },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User with this email or phone already exists",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         gender,
//         isVerified: true,
//       },
//     });

//     const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // Set to true in production with HTTPS
//     });

//     res.status(201).json({ success: true, user: newUser, token });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       const errorDetails = error.errors.map((err) => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed. Check your details.",
//         errors: errorDetails,
//       });
//     }

//     console.error("User registration error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Registration failed",
//       error: error.message,
//     });
//   }
// });

// // ✅ Export router using ES Module syntax
// export default router;
