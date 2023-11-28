const express = require('express');
const router = express.Router();
const API_VERSION = '1.0';

router.use(`/${API_VERSION}/`,(req,res,next)=>{
    console.log('api route');
    next();
});

module.exports = router;