const config = require('config');

module.exports = function (key) {
    if(!config.get(key)) {
        console.log(`FATAL ERROR: ${key} is not defined.`);
        process.exit(1);
      }
}