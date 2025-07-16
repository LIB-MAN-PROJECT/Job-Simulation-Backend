const User = require("../models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/email");



// signup
exports.signup = async (req, res,next) => {
  try {
    const { username, email, password, role, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "student",
      firstName,
      lastName
    });

    await user.save();
    await sendWelcomeEmail(email, username)

    res.status(201).json({ message: `"User created successfully" ,an email has been sent to ${user.email}`});
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};


// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      { id:  user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    companyId: user.companyId},
      process.env.JWT_SECRET,
      // { expiresIn: "5d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      }
      
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
