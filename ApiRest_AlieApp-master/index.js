'use strict'

var app = require('./app');
var port = 3700;

app.listen(port, () => {
	console.log("Servidor corriendo en 'localhost:3700'");
});