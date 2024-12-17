"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redis = new ioredis_1.Redis(redisPort, redisHost);
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});
redis.on('connection', (stream) => {
    console.log('Someone connected to Redis!');
});
exports.default = redis;
