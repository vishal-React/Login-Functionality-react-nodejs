var express = require("express");
var router = express.Router();
const user = require("../models/userSchema");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;
    
    if (!password || typeof password !== "string" || password.trim() === "") {
      return next(createError(400, "Password is required."));
    }

    const userPassword = password.trim();
    // Check if email already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Email already exists."));
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);

    // Create new user
    const newUser = new user({
      username,
      email,
      password: hash,
    });

    await newUser.save();
    res.status(200).json("User has been created");
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return next(createError(400, "Email already exists."));
    }
    next(createError(400, error.message));
  }
});

router.post("/login", async (req, res, next) => {
  console.log(req.body);
  try {
    const { usernameOrEmail } = req.body;
    const users = await user.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!users) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      users.password
    );
    if (!isPasswordCorrect)
      return next(createError(401, "username or password is in correct"));

    const { _id, username } = users;
    const token = jwt.sign({ username, _id }, process.env.secretkey);

    const { password, ...userDetail } = users._doc;
    return res
      .status(200)
      .json({ meesage: "user are verified", token, details: userDetail });
  } catch (error) {
    console.log(error);
    next(createError(500, error.message));
  }
});

router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;
    const foundUser = await user.findOne({ email });
    if (!foundUser) return next(createError(404, "User not found"));

    // Generate Reset Token
    const resetToken = jwt.sign({ id: foundUser._id }, process.env.secretkey, {
      expiresIn: "15m",
    });

    foundUser.resetToken = resetToken;
    foundUser.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
    await foundUser.save();

    // Send Reset Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: foundUser.email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    next(createError(500, error.message));
  }
});

router.post("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, process.env.secretkey);
    const foundUser = await user.findOne({
      _id: decoded.id,
      resetToken: token,
    });
    if (!foundUser || foundUser.resetTokenExpiry < Date.now()) {
      return next(createError(400, "Invalid or expired token"));
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    foundUser.password = bcrypt.hashSync(password, salt);
    foundUser.resetToken = undefined;
    foundUser.resetTokenExpiry = undefined;

    await foundUser.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(createError(500, error.message));
  }
});

module.exports = router;
