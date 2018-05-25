var express = require('express')
var app = express()
var bodyParser = require('body-parser') 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

// SHOW LIST OF PERSON
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM person ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                res.json({ 'message': err });
            } else {
                res.json(rows);
            }
        })
    })
})

// SHOW LIST OF PERSON
app.get('/people18', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM person WHERE age > 18 ORDER BY id DESC',function(err, rows, fields) {
            if (err) {
                res.json({ 'message': err });
            } else {
                res.json(rows);
            }
        })
    })
})

// ADD NEW PERSON POST ACTION
app.post('/add', function(req, res, next){
		console.log(req.body.name)
        var person = {
            name: req.body.name,
            age: req.body.age
        }
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO person SET ?', person, function(err, result) {
                if (err) {
                    res.json({ 'message': err });
                } else {
					res.json({ 'message': 'Data added successfully!' });
                }
            })
        })
})

// EDIT PERSON POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
        var person = {
            name: req.body.name,
            age: req.body.age
        }

        req.getConnection(function(error, conn) {
            conn.query('UPDATE person SET ? WHERE id = ' + req.params.id, person, function(err, result) {
                //if(err) throw err
                if (err) {
					res.json({ 'message': err });
                } else {
					res.json({ 'message': 'Data updated successfully!' });
                }
            })
        })
})

// DELETE PERSON
app.delete('/delete/(:id)', function(req, res, next) {
    var person = { id: req.params.id }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM person WHERE id = ' + req.params.id, person, function(err, result) {
            if (err) {
                res.json({ 'message': err });
            } else {
				res.json({ 'message': 'Person deleted successfully! id = ' + req.params.id });
            }
        })
    })
})

module.exports = app
