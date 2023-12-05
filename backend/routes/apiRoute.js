const express = require('express');
const router = express.Router();
const API_VERSION = '1.0';

const authorization = require('../middleware/adminCheck');

const answerRoute = require('./api/answerRoute');
const userRoute = require('./api/userRoute');
const examRoute = require('./api/examRoute');
const exerciseRoute = require('./api/exerciseRoute');

router.use(`/${API_VERSION}/answers`, answerRoute);
router.use(`/${API_VERSION}/user`, userRoute);
router.use(`/${API_VERSION}/exams`, examRoute);
router.use(`/${API_VERSION}/exercises`, exerciseRoute);

router.use(`/${API_VERSION}/admin`, authorization, (req, res) => {
    res.status(200).json({ data: 'ok' });
    }
);

module.exports = router;