var express = require('express')
var app = express()
var mysql = require('mysql')
var logger = require("./utils/logger");
/**
 * This middleware provides a consistent API
 * for MySQL connections during request/response life cycle
 */
var myConnection  = require('express-myconnection');
/**
 * Store database credentials in a separate config.js file
 * Load the file/module and its values
 */
var config = require('./utils/config');
var dbOptions = {
    host:      config.database.host,
    user:       config.database.user,
    password: config.database.password,
    port:       config.database.port,
    database: config.database.db
}
/**
 * 3 strategies can be used
 * single: Creates single database connection which is never closed.
 * pool: Creates pool of connections. Connection is auto release when response ends.
 * request: Creates new connection per new request. Connection is auto close when response ends.
 */


app.use(myConnection(mysql, dbOptions, 'pool'));
logger.log('info', 'DB will connect to database %s at host %s at port %d', config.database.db, config.database.host, config.database.port);

/**
 * import routes/index.js
 * import routes/person.js
 */
var index = require('./routes/index')
var person = require('./routes/person')
var pets = require('./routes/pets')


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
app.use('/pets', pets)

app.listen(config.server.port, function(){
    logger.info('Server running at port %d: %s',config.server.port, config.server.host);
    console.log('Server running at port %d: %s',config.server.port, config.server.host);
})
