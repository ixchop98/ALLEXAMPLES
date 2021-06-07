require('./database');
const app = require('./app');
const port = process.env.PORT || 3000;

//INICIALIZA EL SERVIDOR
async function init(){
    await app.listen(port);
    console.log('Server on port ' + port);
}

init();