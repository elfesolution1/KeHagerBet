const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;

  // Check if accessToken exists
  if (!accessToken) {
    return res.status(409).json({ error: "Please login first" });
  }

  // Verify SECRET environment variable
  if (!process.env.SECRET) {
    console.error("SECRET environment variable is not set");
    return res.status(500).json({ error: "Internal server error" });
  }

  try {
    // Verify the token
    const deCodeToken = await jwt.verify(accessToken, process.env.SECRET);
    req.role = deCodeToken.role;
    req.id = deCodeToken.id;
    next();
  } catch (error) {
    console.error("Token verification error:", error);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(409)
        .json({ error: "Token expired. Please login again." });
    } else if (error.name === "JsonWebTokenError") {
      return res
        .status(409)
        .json({ error: "Invalid token. Please login again." });
    } else {
      return res.status(409).json({ error: "Please login" });
    }
  }
};
