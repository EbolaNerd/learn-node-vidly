const winston = require('winston');
require('winston-mongodb');

const logpath = './logs/';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(), 
    defaultMeta: { 
      service: 'user-service'
    },
    transports: [
      new winston.transports.File({ filename: logpath + 'error.log', level: 'error' }),
      new winston.transports.File({ filename: logpath + 'combined.log', level: 'info' }),
      new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'info'})
    ]
  });

module.exports = function(err, req, res, next) {
  logger.info(err.message, { metadata: { error: err } });
  res.status(500).send('Something failed.');
};