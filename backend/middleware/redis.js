const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

redisClient.on('error', (err) => {
    console.log('Error ' + err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

// 將 connect 代碼包裹在 async 函數中
async function connectToRedis() {
    await redisClient.connect();
}

// 調用函數以進行連接
connectToRedis();

async function CachedProductDetails(req, res, next) {
    console.log('CachedProductDetails');
    const key = 'product_' + req.query.id;

    const value = await redisClient.get(key);

    if (value) {
        res.send(JSON.parse(value));
        console.log('CachedProductDetails return');
        return;
    } else {
        next();
    }
}

async function ExpireProduct(req, res, next) {
    if (!req.query.id) {
        next();
        return;
    }

    const key = 'product_' + req.query.id;

    await redisClient.expire(key, 0);
    next();
}

module.exports = {
    redisClient,
    CachedProductDetails,
    ExpireProduct
};