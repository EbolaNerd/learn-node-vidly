const express = require('express');
const app = express();

const logger = require('./utils/logger');
require('./startup/config')('jwtPrivateKey');
require('./startup/db')('mongodb://localhost/vidly');
require('./startup/routes')(app);
require('./utils/validation')();

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));