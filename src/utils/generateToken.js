import jwt from "jsonwebtoken";
import environment from "../config/environment.js";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, environment.jwtSecret, {
    expiresIn: environment.jwtExpire,
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, environment.refreshSecret, {
    expiresIn: environment.refreshExpire,
  });
};

export { generateAccessToken, generateRefreshToken };