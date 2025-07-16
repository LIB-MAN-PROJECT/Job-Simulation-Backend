const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema"); 

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure you have JWT_SECRET in your .env
    const user = await User.findById(decoded.id).select("-password"); // Optional: exclude password

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      companyId: user.companyId,
      
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
