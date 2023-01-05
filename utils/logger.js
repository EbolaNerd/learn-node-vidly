const winston = require('winston');
const config = require('config');

const logpath = './logs/';

module.exports = winston.createLogger({
    level: 'info',
    format: winston.format.json(), 
    defaultMeta: { 
      service: 'user-service'
    },
    transports: [
      //new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({ filename: logpath + 'error.log', level: 'error' }),
      new winston.transports.File({ filename: logpath + 'combined.log', level: 'info' })
    ]
  });