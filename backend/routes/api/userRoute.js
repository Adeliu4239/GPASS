const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const uploadPictures = require("../../utils/uploadPictures");

router.post("/signup",uploadPictures.uploadPicture().single('picture'), userController.signup);
router.post("/signin", userController.signin);
router.get("/logout", userController.logout);
router.get("/profile", userController.authorization, userController.getUserProfile);


module.exports = router;
