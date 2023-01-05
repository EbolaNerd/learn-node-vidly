
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(db).then(() => logger.info('Connected to MongoDB...', { metadata: db}));
}

