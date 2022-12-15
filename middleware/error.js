const logger = require('../utils/logger');

module.exports = function(err, req, res, next) {
  logger.info(err.message, { metadata: { error: err } });
  res.status(500).send('Something failed.');
};