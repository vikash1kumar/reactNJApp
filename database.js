var mysql = require('mysql')
var util = require('util')
var logger = require("./utils/logger");
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'author_data',
    waitForConnections: true,
})

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
            logger.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
            logger.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
            logger.error('Database connection was refused. With error %s', err)
        }
    }
    if (connection) connection.release()
    return
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query)

function query( sql, args ) {
        return new Promise(async ( resolve, reject ) => {
          try{
            rows = await this.connection.query( sql, args);
            resolve( rows );
          }catch(err){
            return reject( err );
          }
          });
    }

module.exports = pool
