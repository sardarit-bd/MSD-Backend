import dotenv from "dotenv";

dotenv.config();

const environment = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,

  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || "30d",
  
  refreshSecret: process.env.REFRESH_SECRET || "your-refresh-secret-key",
  refreshExpire: process.env.REFRESH_EXPIRE || "7d",
};

export default environment;