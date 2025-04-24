const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Access denied: User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

// Middleware to allow either Agent or Owner
exports.isAgentOrOwner = (req, res, next) => {
  if (!req.user || !["agent", "owner"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ msg: "Access denied: Only agents or owners allowed" });
  }
  next();
};
