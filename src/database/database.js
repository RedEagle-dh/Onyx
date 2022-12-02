const Redis = require('ioredis');
require("dotenv").config({path: "../../.env"});
/* module.exports = redis.createClient({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER
}); */


const { Logger } = require("../Log/getLogger");
const __Log = new Logger();

function getDatabase() {
    try {
        const __Database = new Redis(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`)
        __Log.info("Successfully connected to database!")
        return __Database
    } catch (e) {
        __Log.fatal(`Error while trying to connect to database - ${e}`)
        return null
    }
}


module.exports = { getDatabase }