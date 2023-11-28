const express = require('express');
const router = express.Router();

router.use("/", express.static('views/login'));




module.exports = router;
