const validator = require('../helpers/validations');    //HELPER DE VALIDACIONES
const User = require('../models/User');
const moment = require('moment');
const jwt = require('../helpers/jwt');
const file = require('../helpers/image_manipulation');
const path = require('path');
const fs = require('fs');


const controller = {

    //REGISTRO DE USUARIOS
    signup: async (req, res, next) => {
        const {name, surname, email, password} = req.body;
        const validation_name = await validator.name_user(name);
        const validation_surname = await validator.surname_user(surname);
        const validation_email = await validator.email_user(email);
        const validation_password = await validator.password_user(password);
        if(!validation_name && !validation_surname && !validation_email && !validation_password){   //SI TODOS LOS CAMPOS VALIDOS PROCEDEMOS A GUARDAR
            try{
                const user = new User({
                    name: name,
                    surname: surname,
                    email: email.toLowerCase(),
                    password: password,
                    image: null,
                    role: 'USER_ROLE'
                });
                const findUser = await User.findOne({email: user.email});   //SACAR EL USUARIO CON ESE EMAIL
                if(!findUser){      //VERIFICAR DUPLICIDAD DE CORREOS
                    user.password = await user.encryptPassword(user.password);  //ENCRIPTAR CONTRASEÑA
                    await user.save();    //GUARDAR EN LA DB
                    return res.json({message: 'Usuario registrado exitosamente'});
                }
                return res.status(400).json({'message': 'El correo ya esta registrado en otra cuenta'});
            }catch(error){
                console.log(error);
                return res.status(500).json({'message': 'Error en el servidor'});
            }
        }
        return res.status(400).json({'errors':{validation_name, validation_surname, validation_email, validation_password}});
    },

    //LOGIN DE USUARIOS
    signin: async (req, res, next) =>{
        const {email, password} = req.body;
        const validation_email = await validator.email_user(email);
        const validation_password = await validator.password_user(password);
        if(!validation_email && !validation_password){      //SI TODOS LOS CAMPOS SON VALIDOS SE PROCEDE
            try{
                const user = await User.findOne({email: email.toLowerCase()}).select('-role -__v');    //SE BUSCA AL USUARIO
                if(user){       //SI ES NULL, EL CORREO ES INCORRECTO
                    if(await user.validatePassword(password, user.password)){   //VALIDAR CONTRASEÑA
                        
                        //SESION VALIDA SE GENERA EL TOKEN (2 DIAS)
                        const token = await jwt.generateToken({sub: user._id, role: user.role, iat: moment().unix()}, 60 * 60 * 24 * 2);
                        
                        //LIMPIAR LA PASSWORD PARA QUE NO SE VAYA AL FRONT
                        user.password = undefined;

                        return res.json({user: user, token: token});
                    }
                }
                return res.status(400).json({message: 'Credenciales incorrectas'});
            }catch(err){
                console.log(err);
                return res.status(500).json({message: 'Error en el servidor'});
            }
        }
        return res.status(400).json({'errors': {validation_email, validation_password}});
    },

    //ACTUALIZAR UN PERFIL DE USUARIO
    update: async (req, res) => {
        const image = req.file;
        const {name, surname, email} = req.body;
        const validation_name = await validator.name_user(name);
        const validation_surname = await validator.surname_user(surname);
        const validation_email = await validator.email_user(email);
        let validation_image = null;
        if(image){
            validation_image = await validator.image_user(image.mimetype);
        }
        if(!validation_name && !validation_surname && !validation_email && !validation_image){   //SI SON INVALIDOS SE BORRA LA IMAGEN SUBIDA(SI LA HAY)

            //DATOS DEL USUARIO DEL JWT
            const { sub } = req.user;

            let user = await User.findById(sub);
            
            //VERIFICAR SI EL USUARIO EXISTE
            if(!user){
                if(image){
                    await file.deleteImage(image.path);
                }
                return res.status(404).json({message: 'user not found'});
            }
            try{
                //VERIFICAR SI MODIFICO EL CORREO Y VER SI NO ES COOREO DE OTRO USER
                if(user.email != email.toLowerCase()){
                    const usr = await User.findOne({email: email.toLowerCase()});
                    if(usr){
                        if(image){
                            await file.deleteImage(image.path);
                        }
                        return res.status(400).json({errors: {email: ['El correo ya esta asociado a otra cuenta']}});
                    }
                }

                //VER SI SUBIO UNA IMAGEN
                if(image){

                    //VERIFICAR SI EL USUARIO TENIA IMAGEN PARA BORRARLA Y GUARDAR LA NUEVA
                    if(user.image){
                        await file.deleteImage(path.join(process.cwd(), 'uploads/users/' + user.image));
                    }
                    user.image = image.filename;
                }

                user = await User.findOneAndUpdate({_id: sub}, {name: name, surname: surname, email: email.toLowerCase(), image: user.image}, {new: true})
                                                                                                                .select('-__v -_id -password -role');
                return res.json({message: 'Usuario actualizado', user: user});

            }catch(error){
                console.log(error);
                if(image){
                    await file.deleteImage(image.path);
                }
                return res.status(500).json({message: 'Error en el servidor'});
            }
        }
        if(image){
            await file.deleteImage(image.path);
        }
        return res.status(400).json({errors: {validation_name, validation_surname, validation_email, validation_image}});
    },

    //TRAER IMAGEN DEL USUARIO
    getImage: async (req, res) => {
        const{filename} = req.params;
        const pathFile =  path.join(__dirname, '../uploads/users/' + filename);
        try{

            //VER SI EXISTE LA IMAGEN
            fs.accessSync(pathFile);
        }catch(error){
            return res.status(404).json({message: 'No existe la imagen'});
        }
        return res.sendFile(pathFile); 
    },

    //SACAR TODOS LOS USUARIOS
    getAll: async (req, res) => {
        try{
            const users = await User.find().select('-__v -password');
            return res.json({users: users});
        }catch(error){
            console.error(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //SACAR UN USUARIO EN ESPECIFICO
    getById: async (req, res) => {
        const {id} = req.params;
        try{
            const user = await User.findOne(id).select('-__v -password');
            if(!user){      //SI EL USUARIO NO EXISTE
                return res.status(404).json({message: 'El usuario no existe'});
            }
            res.json({user: user});
        }catch(error){
            console.log(error);
        }
        res.status(500).json({message: 'Error en el servidor'});
    }

};

module.exports = controller;