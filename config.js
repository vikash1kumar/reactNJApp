require('dotenv').config();
const winston = require('winston');
require('winston-loggly-bulk');
require('dotenv').config();

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'reactnjapp-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'reactnjapp-error.log',
      level: 'error'
    })
  ]
});

winston.loggers.add('development', {
  console: {
    level: 'silly',
    colorize: 'true'
  },
  file: {
    filename: './reactnjapp.log',
    level: 'warn'
  }
});


var config = {
    database: {
        host: process.env.DB_HOST,     // database host
        user: process.env.DB_USER,         // your database username
        password: process.env.DB_PASS,         // your database password
        port: process.env.DB_PORT,         // default MySQL port
        db: process.env.DB_NAME         // your database name
    },
    server: {
        host: process.env.SERVER_HOST,
        port: process.env.SERVER_POST
    }
}
 
module.exports = config