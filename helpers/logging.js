const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'pepojs' },
  transports: [
    new winston.transports.Console(),
  ],
});

logger.info('fulltime cummer');

const childLogger = logger.child({ cumposter: true });

childLogger.info('love 2 cum');

module.exports = logger;