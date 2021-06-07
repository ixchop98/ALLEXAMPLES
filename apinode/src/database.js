
//MODULO DE LA BASE DE DATOS
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/db_forum', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Database is connected');
}).catch((error) => {
    console.log(error);
});