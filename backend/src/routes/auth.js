import express from "express";
import { body } from "express-validator";
import authController from "../controllers/authController.js";

const router = express.Router();

// Login route
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// Logout route
router.post("/logout", authController.logout);

// Refresh token route
router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  authController.refresh
);

export default router;
