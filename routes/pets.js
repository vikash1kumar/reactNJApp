var express = require('express')
var app = express()
//const router = express.Router();
const HttpStatus = require('http-status-codes');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
var logger = require("../utils/logger");
// SHOW LIST OF PETS
app.get('/', function (req, res) {
	logger.info('Fetching all pets records from: %s', req.connection.remoteAddress);
	try {
		req.getConnection(function(error, conn) {
			if (error) {
				logger.error('Error while connecting to Database...');
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: error, message: error.message });
			}else{
				conn.query('SELECT * FROM pet ORDER BY id DESC',function(err, rows, fields) {
					//if(err) throw err
					if (err) {
						logger.error('Error while fetching records...');
						res.status(HttpStatus.INTERNAL_SERVER_ERROR)
						res.json({ error: err, message: err.message });
					} else {
						res.json(rows);
					}
				})
			}
		})
	}
	catch (err) {
		res.status(HttpStatus.INTERNAL_SERVER_ERROR)
		res.json({ error: err, message: err.message });
	}
})

// ADD NEW PET POST ACTION
app.post('/add', function(req, res, next){
		console.log(req.body.name)
        var pet = {
            name: req.body.name,
            personId: req.body.personid
        }
		try{
			req.getConnection(function(error, conn) {
				if (error) {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: error, message: error.message });
				}else{
					conn.query('INSERT INTO pet SET ?', pet, function(err, result) {
						if (err) {
							res.status(HttpStatus.INTERNAL_SERVER_ERROR)
							res.json({ error: err, message: err.message });
						} else {
							res.status(HttpStatus.CREATED);
							res.json({ 'message': 'Data added successfully!' });
						}
					})
				}
			})
		}catch(err){
			res.status(HttpStatus.INTERNAL_SERVER_ERROR)
			res.json({ error: err, message: err.message });
		}
})

// EDIT PETS POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
        var pet = {
            name: req.body.name,
            personId: req.body.personid
        }

        req.getConnection(function(error, conn) {
			if (error) {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: error, message: error.message });
			}else{
				conn.query('UPDATE pet SET ? WHERE id = ' + req.params.id, pet, function(err, result) {
					//if(err) throw err
					if (err) {
						res.status(HttpStatus.INTERNAL_SERVER_ERROR);
						res.json({ error: error, message: error.message });
					} else {
						res.json({ 'message': 'Data updated successfully!' });
					}
				})
			}
        })
})

// DELETE PETS
app.delete('/delete/(:id)', function(req, res, next) {
    var pet = { id: req.params.id }

    req.getConnection(function(error, conn) {
		if (error) {
				res.status(HttpStatus.INTERNAL_SERVER_ERROR)
				res.json({ error: error, message: error.message });
		}else{
			conn.query('DELETE FROM pet WHERE id = ' + req.params.id, pet, function(err, result) {
				if (err) {
					res.status(HttpStatus.INTERNAL_SERVER_ERROR);
				res.json({ error: error, message: error.message });
				} else {
					res.status(202);
					res.json({ 'message': 'Pet deleted successfully! id = ' + req.params.id });
				}
			})
		}
    })
})

module.exports = app
