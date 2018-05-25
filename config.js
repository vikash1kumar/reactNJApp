require('dotenv').config();

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