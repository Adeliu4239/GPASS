require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();
const { authenticateGoogle, handleGoogleCallback } = require("../controllers/authController");
const userController = require("../controllers/userController");

router.get(
  "/google",
  authenticateGoogle
);

router.get(
  "/google/callback",
  handleGoogleCallback,
  userController.signin
);

module.exports = router;
