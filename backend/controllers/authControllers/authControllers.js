const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModels/userModels");
const status_codes = require("http-status-codes")

const signUpController = async (req, res) => {
  console.log("[SignUpController]: frontend request", req?.body)
  const { username, password, role, name } = req?.body;

  if (!username || !password || !role) {
    return res.json({ msg: "Error username, password, role not provided." })
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username taken. Try with another username." });
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      hashedPassword,
      role,
      name,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const checkController = async (req, res) => {
  const user = req?.user; // User data from authMiddleware
  if (!user) {
    return res
      .status(status_codes.UNAUTHORIZED)
      .json({ message: "User not authenticated" });
  }
  res.status(status_codes.OK).json({ msg: "Valid user", user });
};

const meController =  (req, res) => {
  res.json({ user: req.user });
}


module.exports = { signUpController, loginController, checkController, meController, };
