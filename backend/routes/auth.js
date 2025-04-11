const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/dashboard"); // Redirect to frontend after login
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("http://localhost:5173/");
  });
});

module.exports = router;
