
import { generateAccessToken, generateRefreshToken } from "../../utils/generateToken.js";
import User from "./auth.model.js";

export const registerUserService = async (payload) => {
  const emailExists = await User.findOne({ email: payload.email });

  if (emailExists) {
    throw new Error("Email already exists");
  }

  const user = await User.create(payload);

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const loginUserService = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new Error("Invalid credentials");
  }

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken: generateAccessToken(user._id),
    refreshToken: generateRefreshToken(user._id),
  };
};

export const changeEmailService = async (userId, newEmail) => {
  const exists = await User.findOne({ email: newEmail });

  if (exists) {
    throw new Error("Email already exists");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { email: newEmail },
    { new: true }
  );

  return user;
};

export const changePasswordService = async (
  userId,
  oldPassword,
  newPassword
) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new Error("Old password incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password updated" };
};