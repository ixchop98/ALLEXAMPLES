'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar archivos rutas
var user_routes = require('./routes/user');
var report_routes = require('./routes/report');
var edicion_routes = require('./routes/edicion');
var video_routes = require('./routes/video');
var archivos_routes = require('./routes/archivos');


//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//rutas
app.use('/api', user_routes);
app.use('/api', report_routes);
app.use('/api', edicion_routes);
app.use('/api', video_routes);
app.use('/api', archivos_routes);

module.exports = app;