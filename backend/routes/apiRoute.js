const express = require('express');
const router = express.Router();
const API_VERSION = '1.0';

const userRoute = require('./api/userRoute');
const examRoute = require('./api/examRoute');

router.use(`/${API_VERSION}/user`, userRoute);
router.use(`/${API_VERSION}/exams`, examRoute);

module.exports = router;