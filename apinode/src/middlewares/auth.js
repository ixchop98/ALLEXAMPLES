const jwt = require('jsonwebtoken');
const config = require('../config');
const moment = require('moment');

exports.auth = (req, res, next) => {

    //COMPROBAR SI VIENE TOKEN
    const token = req.headers['x-access-token'];
    if(token){
        try{
            const decoded = jwt.verify(token, config.secret);       //VERIFICAR TOKEN CON FIRMA

            //COMPROBAR SI EL TOKEN HA EXPIRADO
            if(!(decoded.exp <= moment().unix())){

                //PASARLE A LA REQUEST LA INFO DEL PAYLOAD
                req.user = decoded;
                return next();  //PASAR A LA SIGUIENTE PETICION
            }
            return res.status(401).json({message: 'the token has expired', exp: true, date: Date.now()});
        }catch(error){
            return res.status(401).json({message: 'unidentified user'});
        }
    }
    return res.status(401).json({message: 'no token provided'});
};