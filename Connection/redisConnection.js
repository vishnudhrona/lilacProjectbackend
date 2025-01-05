// const Redis = require("ioredis");

// const redis = new Redis({
//     port: process.env.REDIS_PORT || 6379,
//     host: process.env.REDIS_HOST || 'localhost',
//     username: "default", 
//     password: "LEO9Acs9CuiBjssy7FJdtr3hg3fo320u" || '',
//     db: 0,
//     keyPrefix: "Development"
// });

// redis.on('connect', () => {
//     console.log("Redis connected")
// })

// redis.on('error', (err) => {
//     console.error('Redis Error:', err);
// });

// redis.on('end', () => {
//     console.log('Connection to Redis ended');
// });

// module.exports = redis;