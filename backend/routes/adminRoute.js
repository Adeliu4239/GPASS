const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.use(adminController.authorization);
router.use("/",express.static('views/admin'));


module.exports = router;
