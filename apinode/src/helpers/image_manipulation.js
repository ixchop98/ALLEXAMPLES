const fs = require('fs');

module.exports = {
    deleteImage: async (path) => {      //ELIMINA UNA IMAGEN DEL SISTEMA
        try{
            fs.unlinkSync(path);
        }catch(error){
            console.log('Error al borrar:   ' + error);
            return false;
        }
        return true;
    } 
};