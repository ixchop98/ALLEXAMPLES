const express = require('express');     //FRAMEWORK

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//MIDDLEWARE DE CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//CARGAR RUTAS
app.use('/user', require('./routes/User')); //RUTAS DE USUARIO
app.use('/topic', require('./routes/Topic'));   //RUTAS DE LOS TOPICS
app.use('/comment', require('./routes/Comment'));   //RUTAS DE LOS COMMENTS

module.exports = app;