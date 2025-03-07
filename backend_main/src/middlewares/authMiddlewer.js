import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

const SECRET_KEY = process.env.SECRET_KEY || "kunj";

// ✅ Middleware to verify authentication from cookies
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // Get token from cookies
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.usera.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized, please login again" });
    }

    req.user = user; // Attach user info to the request
    next();
  } catch (error) {
    console.log("error in aturise",error);
    
    return res.status(401).json({ success: false, message: "Invalid token, please login again" });
  }
};
const authorizeRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token; // Get token from cookies
      if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded; // Attach user info to request object

      // Check if user's role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      }

      next(); // Proceed to the next middleware or route
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
  };
};
export { authenticateUser, authorizeRoles };

