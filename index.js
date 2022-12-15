require('express-async-errors');
const express = require('express');
const app = express();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('./startup/config')('jwtPrivateKey');
require('./startup/db')('mongodb://localhost/vidly');
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));