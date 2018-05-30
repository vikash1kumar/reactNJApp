var express = require('express')
var app = express()
var pool = require('../database')
//const router = express.Router();
//const router = express.Router();
const HttpStatus = require('http-status-codes');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
//router.use(bodyParser.json());
var logger = require("../utils/logger");
const restcalls = require("../integrations/restcalls");

// SHOW LIST OF PERSON
app.get('/',async function (req, res) {
	//logger.info('Fetching all person records from: %s', req.connection.remoteAddress);
	let ipAdd
	logger.info('Fetching all person records from: %s', req.connection.remoteAddress);
	try {
		ipAdd = await restcalls.getIPAddress('https://api.ipify.org/?format=json','GET')
		console.log(ipAdd);
    pool.query('SELECT * FROM person ORDER BY id DESC').then(
			result => {
				res.json(result);
			}
		);

	} catch(err) {
			logger.error('Error while fetching person data...');
			res.status(HttpStatus.INTERNAL_SERVER_ERROR)
			res.json({ error: error, message: error.message });
	}
})

// SHOW LIST OF PERSON
app.get('/people18', function(req, res, next) {
	  logger.info('Fetching person records having age greater then 18 years from: %s', req.connection.remoteAddress);
		try {
	    pool.query('SELECT * FROM person WHERE age > 18 ORDER BY id DESC').then(
				result => {
					res.json(result);
				}
			);
		} catch(err) {
			logger.error('Error while fetching person data...');
			res.status(HttpStatus.INTERNAL_SERVER_ERROR)
			res.json({ error: error, message: error.message });
		}
	})

	// ADD NEW PERSON POST ACTION
	app.post('/add', function(req, res, next){
	        var person = {
	            name: req.body.name,
	            age: req.body.age
	        }
			try{
				pool.query('INSERT INTO person SET ?', person).then(
					result => {
						res.status(HttpStatus.CREATED);
						res.json({ 'message': 'Data added successfully!' });
					}
				);
			}catch(err){
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: err, message: err.message });
			}
	})

	// EDIT PERSON POST ACTION
	app.put('/edit/(:id)', function(req, res, next) {
	        var person = {
	            name: req.body.name,
	            age: req.body.age
	        }
					try{
						pool.query('UPDATE person SET ? WHERE id = ' + req.params.id, person).then(
							result => {
								res.json({ 'message': 'Data updated successfully!' });
							}
						);
					}catch(err){
						res.status(HttpStatus.INTERNAL_SERVER_ERROR)
						res.json({ error: err, message: err.message });
					}
	})

	// DELETE PERSON
	app.delete('/delete/(:id)', function(req, res, next) {
	    var person = { id: req.params.id }
			try{
				pool.query('DELETE FROM person WHERE id = ' + req.params.id, person).then(
					result => {
						res.status(HttpStatus.ACCEPTED);
						res.json({ 'message': 'Person deleted successfully! id = ' + req.params.id });
					}
				);
			}catch(err){
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: err, message: err.message });
			}
	})
module.exports = app
