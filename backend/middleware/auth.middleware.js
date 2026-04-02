import { clerkClient } from "@clerk/express";
/**
 * Middleware to verify Clerk authentication
 * Extracts userId from Clerk session
 */
export const verifyAuth = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No valid session",
      });
    }

    // Attach userId to request for use in controllers
    req.userId = userId;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
