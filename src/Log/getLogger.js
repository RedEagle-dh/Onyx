class Logger {
    constructor() {
        
    }

    debug(message) {
        console.log(`[${new Date().toLocaleString().split(", ").join("] [")}] 🔹 \x1b[36mDEBUG\x1b[0m      : ${message}`)
        //logger.debug(message);
    }
    info(message) {
        console.log(`[${new Date().toLocaleString().split(", ").join("] [")}] 🆗 \x1b[34mINFO\x1b[0m       : ${message}`)
        //logger.info(message);
    }
    warn(message) {
        console.log(`[${new Date().toLocaleString().split(", ").join("] [")}] ⚠️  \x1b[33mWARN\x1b[0m       : ${message}`)
        //logger.warn(message);
    }
    error(message) {
        
        console.log(`[${new Date().toLocaleString().split(", ").join("] [")}] 💢 \x1b[31mERROR      : ${message}\x1b[0m`)
        //logger.error(message);
    }
    fatal(message) {
        logger.fatal(message);
    }
    success(message) {
        console.log(`[${new Date().toLocaleString().split(", ").join("] [")}] ✅ \x1b[32mSUCCESS\x1b[0m    : ${message}`)
    }
}
module.exports = { Logger };