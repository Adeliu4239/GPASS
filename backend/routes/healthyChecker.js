const express = require("express");
const router = express.Router({});
const healthyCheckerController = require('../controllers/healthCheckerController');

router.get('/', healthyCheckerController.check);

module.exports = router;