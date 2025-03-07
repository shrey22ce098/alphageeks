import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { authenticateUser } from "../middlewares/authMiddlewer.js";

const router = express.Router();
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "kunj";

const signupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[0-9]/, "Password must contain at least one digit (0-9)")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    )
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  phone: z.string().length(10),
  gender: z.enum(["male", "female", "other"]),
  role: z.enum(["user", "doctor", "admin"]),
});

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Verify Your Account</h2>
        <p>Thank you for registering! Please use the following OTP to verify your account:</p>
        <h1 style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// router.post("/signup", async (req, res) => {
//   try {
//     console.log("kunj", req.body);

//     // const validatedData = signupSchema.parse(req.body);
//     const { name, email, password, phone, gender, role } = req.body;

//     const existingUser = await prisma.usera.findFirst({
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
//     const otp = generateOTP();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

//     // Create user with isVerified set to false initially
//     const newUser = await prisma.usera.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         phone,
//         gender,
//         role,
//         isVerified: false,
//         otp,
//         otpExpiry,
//       },
//     });

//     // Send OTP email
//     await sendOTPEmail(email, otp);
//     const token = jwt.sign(
//       { userId: newUser.id, role: newUser.role },
//       SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     // Set token in cookie (optional)
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // Set to true in production with HTTPS
//     });

//     res.status(201).json({
//       success: true,
//       message: "User registered. Please verify your email with the OTP sent.",
//       // userId: newUser.id
//     });
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

router.post("/signup", async (req, res) => {
  try {
    // const validatedData = signupSchema.parse(req.body);
    const { fullname, email, password, phonenumber, gender, role } = req.body;
    console.log("re", req.body);

    console.log("kunj", fullname, email, password, phonenumber, gender, role);

    const existingUser = await prisma.usera.findFirst({
      where: {
        OR: [{ email }, { phone: phonenumber }],
      },
    });

    console.log("string1");

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Create user with isVerified set to false initially
    const newUser = await prisma.usera.create({
      data: {
        name: fullname,
        email,
        password: hashedPassword,
        phone: phonenumber,
        gender,
        role,
        isVerified: false,
        otp,
        otpExpiry,
      },
    });

    console.log("string2");

    // Send OTP email
    await sendOTPEmail(email, otp);
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Set token in cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
    });

    console.log("String3");
    res.status(201).json({
      success: true,
      message: "User registered. Please verify your email with the OTP sent.",
      // userId: newUser.id
    });
  } catch (error) {
    // if (error instanceof z.ZodError) {
    //   const errorDetails = error.errors.map((err) => err.message);
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation failed. Check your details.",
    //     errors: errorDetails,
    //   });
    // }
    console.log("123");
    console.log(error);
    console.error("User registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Schema for OTP verification
const verifyOTPSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Verify OTP route
router.post("/verify-otp", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("userid--", userId);

    const { otp } = verifyOTPSchema.parse(req.body);

    const user = await prisma.usera.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    const currentTime = new Date();
    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiry ||
      user.otpExpiry < currentTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Update user to verified status
    const verifiedUser = await prisma.usera.update({
      where: { id: userId },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate JWT token after verification
    const token = jwt.sign(
      { userId: verifiedUser.id, role: verifiedUser.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production with HTTPS
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        role: verifiedUser.role,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errorDetails,
      });
    }

    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.usera.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User is already verified",
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    await prisma.usera.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry,
      },
    });
    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[0-9]/, "Password must contain at least one digit (0-9)")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    )
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
});

router.post("/login", async (req, res) => {
  try {
    // Validate input
    console.log("kunj", req.body);

    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Check if user exists
    console.log("Dev1");
    const user = await prisma.usera.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Compare passwords
    console.log("Dev2");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    console.log("Dev3");
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set token in cookie (optional)
    console.log("Dev4");
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
    });

    res
      .status(200)
      .json({ success: true, message: "Login successful", token, user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
    console.log("Dev5");
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    // Clear the authentication cookie with proper options
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    // Send success response
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error.message });
  }
});

export default router;
