import express from "express";

import {
  registerUser,
  loginUser,
  refreshToken,
  changeEmail,
  changePassword,
} from "./auth.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { changeEmailValidation, changePasswordValidation, loginValidation, registerValidation } from "../../middleware/auth.validation.js";

const router = express.Router();

// Register
router.post(
  "/register",
  validate(registerValidation),
  registerUser
);

// Login
router.post(
  "/login",
  validate(loginValidation),
  loginUser
);

// Refresh Token
router.post("/refresh", refreshToken);

// Change Email
router.patch(
  "/change-email",
  protect,
  validate(changeEmailValidation),
  changeEmail
);

// Change Password
router.patch(
  "/change-password",
  protect,
  validate(changePasswordValidation),
  changePassword
);

export default router;