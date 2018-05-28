var express = require('express')
var app = express()
var mysql = require('mysql')
var Sequelize = require('sequelize');
const winston = require('winston');
var expressWinston = require('express-winston-2');
// express-winston-2 logger makes sense BEFORE the router.
    app.use(expressWinston.logger({
      transports: [
        new winston.transports.Console({
          json: true,
          colorize: true
        }),
		new (winston.transports.File)({
                filename: 'errors.log',
                // File will only record errors
                level: 'info'
        })
      ]
    }));
 
/**
 * This middleware provides a consistent API 
 * for MySQL connections during request/response life cycle
 */ 
//var myConnection  = require('express-myconnection')
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */ 
var config = require('./config')
/*
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port, 
    database: config.database.db
}
*/
//Setting up the config
var sequelize = new Sequelize(config.database.db, config.database.user, config.database.password, {
  host: config.database.host,
  dialect: 'mysql'|'sqlite',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: 'database.sqlite'
});


//app.use();

//winston.log('info', 'test message %s', 'my string');
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */ 
//app.use(myConnection(mysql, dbOptions, 'pool'))
//Checking connection status
sequelize.authenticate().complete(function (err) {
 if (err) {
    console.log('There is connection in ERROR');
 } else {
    console.log('Connection has been established successfully');
 }
});

//Create person Table Structure
var person = sequelize.define('person', {
    id: Sequelize.INTEGER,
    name:Sequelize.STRING,
    age: Sequelize.INTEGER
});


//Applying Item Table to database
sequelize.sync({force:true}).complete(function (err) {
 if(err){
    console.log('An error occur while creating table');
 }else{
    console.log('Item table created successfully');
 }
});
 
/**
 * import routes/index.js
 * import routes/person.js
 */ 
var index = require('./routes/index')
var person = require('./routes/person')
 
 
/**
 * body-parser module is used to read HTTP POST data
 * it's an express middleware that reads form's input 
 * and store it as javascript object
 */ 
var bodyParser = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 * and exposes the resulting object (containing the keys and values) on req.body.
 */ 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
 
 
/**
 * This module let us use HTTP verbs such as PUT or DELETE 
 * in places where they are not supported
 */ 
var methodOverride = require('method-override')
 
/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
 
 
app.use('/', index)
app.use('/person', person)
 
app.listen(config.server.port, function(){
    console.log('Server running at port %d: %s',config.server.port, config.server.host )
})

/*
level - Level of messages to log.
filename - The file to be used to write log data to.
handleExceptions - Catch and log unhandled exceptions.
json - Records log data in JSON format.
maxsize - Max size of log file, in bytes, before a new file will be created.
maxFiles - Limit the number of files created when the size of the logfile is exceeded.
colorize - Colorize the output. This can be helpful when looking at console logs.

*/