const winston = require('winston');

const logpath = './logs/';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: 'user-service'},
    transports: [
      new winston.transports.File({ filename: logpath + 'error.log', level: 'error'}),
      new winston.transports.File({ filename: logpath + 'combined.log'}),
    ]
  });

module.exports = function(err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).send('Something failed.');
}