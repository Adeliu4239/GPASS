const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const uploadFiles = require("../../utils/uploadFiles");

router.post("/signup",uploadFiles.upLoadFlies().single('picture'), userController.signup);
router.post("/signin", userController.signin);
router.get("/logout", userController.logout);
router.get("/profile", userController.authorization, userController.getUserProfile);


module.exports = router;
