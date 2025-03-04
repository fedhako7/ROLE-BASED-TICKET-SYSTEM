const bcrypt = require("bcryptjs");
const User = require("../../models/userModels/userModels");

const signUpController = async (req, res) => {
  console.log("[SignUpController]: frontend request", req?.body)
  const { username, password, role, fname, lname } = req?.body;

  if (!username || !password || !role) {
    return res.json({msg: "Error username, password, role not provided."})
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
      fname,
      lname,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const loginController = async (req, res) => {

}

module.exports = { signUpController, loginController, };
