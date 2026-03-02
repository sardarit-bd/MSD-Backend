import jwt from "jsonwebtoken";
// import { generateAccessToken } from "../../utils/generateToken.js";
import {
  registerUserService,
  loginUserService,
  changePasswordService,
  changeEmailService,
} from "./auth.service.js";
import environment from "../../config/environment.js";
import { generateAccessToken } from "../../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      environment.refreshSecret
    );

    const accessToken = generateAccessToken(decoded.id);

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const changeEmail = async (req, res, next) => {
  try {
    const user = await changeEmailService(
      req.user._id,
      req.body.newEmail
    );

    res.json({ email: user.email });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const result = await changePasswordService(
      req.user._id,
      req.body.oldPassword,
      req.body.newPassword
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};