require('express-async-errors');
const express = require('express');
const app = express();

const logger = require('./utils/logger');
require('./startup/config')('jwtPrivateKey');
require('./startup/db')();
require('./startup/routes')(app);
require('./utils/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`Listening on port ${port}...`));

module.exports = server;