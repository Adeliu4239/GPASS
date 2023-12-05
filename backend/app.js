require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
var morgan = require('morgan');
const moment = require("moment-timezone");

// improt logger
const logger = require('./utils/logger');

// routes require
const healthyCheckerRoute = require('./routes/healthyChecker');
const apiRoute = require('./routes/apiRoute');
const adminRoute = require('./routes/adminRoute');
const authRoute = require('./routes/authRoute');
const docsRoute = require('./routes/docsRoute');
const loginRoute = require('./routes/loginRoute');

const app = express();
const port = process.env.PORT;

const logFileName = `access-log-${logger.getDate()}.log`;
var accessLogStream = fs.createWriteStream(path.join(__dirname, './logs', logFileName), { flags: 'a' })

app.use(morgan('short'));

app.use(morgan(function (tokens, req, res) {
    const taiwanTime = moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss');

    return [
        `[${taiwanTime}]\n`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        '\n',
    ].join(' ');
}, { stream: accessLogStream}));

// middleware
app.use(express.json());

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// routes
app.use('/healthcheck', healthyCheckerRoute);
app.use('/api', apiRoute);
app.use('/docs', docsRoute);
app.use("/login", loginRoute);
app.use('/admin', adminRoute);
app.use('/auth', authRoute);

app.get('/', (req, res) => {
    res.send('<h1 style="text-align: center; padding: 20px;">Hello, My Server!</h1>');
});

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('running successfully');
});
