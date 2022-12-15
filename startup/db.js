
const mongoose = require('mongoose');
const logger = require('../utils/logger');

module.exports = function(db_connectionString) {
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(db_connectionString)
      .then(() => logger.info('Connected to MongoDB...', { metadata: 'metabitch!'}));
}

