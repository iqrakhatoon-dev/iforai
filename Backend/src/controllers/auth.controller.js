const userModel = require("../models/user.model");
const BlacklistTokenModel = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * @name registerUserController
 * @description Register a new user, expects username, email, and password in the request body.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username, emaill and password",
    });
  }

  // Check if user already exists
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  //set token into cookie
  res.cookie("token", token);

  // Send response
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}



/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  // Check, user exists with email or not
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  //check, password validation
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );

  //set token into cookie
  res.cookie("token", token);

  // Send response
  res.status(200).json({
    message: "Login successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}



/**
 * @name logoutUserController
 * @description Logout user and clear the token cookie, blacklist the token
 * @access Public
 */
async function logoutUserController(req, res) {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }

  // Blacklist the token
  await BlacklistTokenModel.create({ token });

  // Clear the token cookie
  res.clearCookie("token");

  // Send response
  res.status(200).json({ message: "Logout successfully" });
}



/**
 * @name getMeController
 * @description Get the current logged in user details.
 * @access Private
 */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);
  res.status(200).json({
    message: "User details fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
