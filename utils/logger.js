var appRoot = require('app-root-path');
var express = require('express')
var app = express()
const winston = require('winston');
var expressWinston = require('express-winston-2');

// express-winston-2 logger makes sense BEFORE the router.
app.use(expressWinston.logger({
    transports: [
		new (winston.transports.Console)({
      level: 'debug',
			timestamp: true,
			json: true,
			colorize: true
		}),
		new (winston.transports.File)({
			name: 'express-error-file',
      filename: appRoot+ '/logs/reactnjapp-express-errors.log',
      // File will only record errors
      level: 'error',
			timestamp: true,
			handleExceptions: true,
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5
    }),
		new (winston.transports.File)({
			name: 'express-info-file',
      filename: appRoot+ '/logs/reactnjapp-express-info.log',
      // File will only record errors
      level: 'info',
			timestamp: true,
			handleExceptions: true,
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
    })
    ]
}));

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: appRoot+ '/logs/reactnjapp-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: appRoot+ '/logs/reactnjapp-error.log',
      level: 'error'
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
