import { Redis } from 'ioredis'

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

const redis = new Redis(redisPort, redisHost);

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  redis.on('connection', (stream) => {
    console.log('Someone connected to Redis!');
  });

export default redis;