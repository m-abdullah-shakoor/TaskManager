const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    console.error("No token provided in Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = auth;
