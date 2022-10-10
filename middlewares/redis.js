const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient({ port: process.env.REDIS_PORT });

redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;
