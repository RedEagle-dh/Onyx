const log4js = require(`log4js`);

log4js.configure({
    appenders: {
      out: { type: "stdout" },
      //app: { type: "file", filename: "application.log" },
    },
    categories: {
      default: { appenders: ["out"], level: "trace" },
      //app: { appenders: ["app"], level: "trace" },
    },
  });
const logger = log4js.getLogger("Onyx");
class Logger {
    constructor(level) {
        logger.level = level;
    }

    trace(message) {
        logger.trace(message);
    }
    debug(message) {
        logger.debug(message);
    }
    info(message) {
        logger.info(message);
    }
    warn(message) {
        logger.warn(message);
    }
    error(message) {
        logger.error(message);
    }
    fatal(message) {
        logger.fatal(message);
    }
}

module.exports = { Logger };