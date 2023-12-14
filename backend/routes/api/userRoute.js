const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router.post("/signin", userController.signin);
router.post("/signinwithnycu", userController.signinWithNYCU);
router.get("/logout", userController.logout);
router.get("/profile", userController.authorization, userController.getUserProfile);


module.exports = router;
