// src/middleware/error.middleware.js
export const errorHandler = (err, req, res, next) => {
  // সম্পূর্ণ error object এবং stack trace দেখান
  console.error("🔥 ERROR:", err);
  console.error("📋 ERROR MESSAGE:", err.message);
  console.error("📍 ERROR STACK:", err.stack);
  
  // Error এর ধরণ অনুযায়ী status code নির্ধারণ
  let statusCode = 500;
  let errorMessage = err.message || "Internal Server Error";
  
  // নির্দিষ্ট কিছু error এর জন্য status code পরিবর্তন
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError' || err.message === 'Invalid credentials' || err.message === 'Not authorized') {
    statusCode = 401;
  } else if (err.message === 'Email already exists' || err.message === 'User not found') {
    statusCode = 404;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorMessage = 'Invalid or expired token';
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    // ডেভেলপমেন্ট environment এ stack trace দেখান
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};