const jwt = require("jsonwebtoken");
const status_codes = require("http-status-codes")

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(status_codes.BAD_REQUEST).json({ message: "Access denied. No token provided." });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("[AuthMiddleware] error", error)
    res.status(status_codes.UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
