const redis = require('ioredis');
require("dotenv").config({path: "../../.env"});
module.exports = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER
});