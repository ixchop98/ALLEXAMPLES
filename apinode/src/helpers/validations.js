const validator = require('validator'); //VALIDADOR DE DATOS
const e = require('express');

module.exports = {

    //VALIDAR NOMBRE DE USUARIO
    name_user: async (name) => {
        const errorArray = [];
        try{
            if(validator.isEmpty(name, {ignore_whitespace: true})){
                errorArray.push('El nombre es requerido');
            }
            if(!validator.isAlphanumeric(name)){
                errorArray.push('El nombre no es alfanumerico');
            }
            if(errorArray.length == 0){
                return null;
            }
        }catch(error){
            errorArray.push('El nombre es requerido');
        }
        return errorArray;
    },

    //VALIDAR APELLIDO
    surname_user: async(surname) => {
        const errorArray = [];
        try{
            if(validator.isEmpty(surname, {ignore_whitespace: true})){
                errorArray.push('El apellido es requerido');
            }
            if(!validator.isAlphanumeric(surname)){
                errorArray.push('El apellido debe ser alfanumerico');
            }
            if(errorArray.length == 0){
                return null;
            }
        }catch(error){
            errorArray.push('El apellido es requerido');
        }
        return errorArray;
    },

    //VALIDAR CORREO DE UN USUARIO
    email_user: async(email) => {
        const errorArray = [];
        try{
            if(validator.isEmpty(email, {ignore_whitespace: true})){
                errorArray.push('El apellido es requerido');
            }
            if(!validator.isEmail(email)){
                errorArray.push('El formato del correo es inválido');
            }
            if(errorArray.length == 0){
                return null;
            }
        }catch(error){
            errorArray.push('El apellido es requerido');
        }
        return errorArray;
    },

    //VALIDAR CONTRASEÑA DE UN USUARIO
    password_user: async(password) => {
        const errorArray = [];
        try {
            if(validator.isEmpty(password)){
                errorArray.push('La contraseña es requerida');
            }
            if(errorArray.length == 0){
                return null;
            }
        } catch (error) {
            errorArray.push('La contraseña es requerida');
        }
        return errorArray;
    },

    //VALIDAR UNA IMAGEN
    image_user: async (mimetype) => {
        if(mimetype === 'image/gif' || mimetype === 'image/png' || mimetype === 'image/jpeg' || mimetype === 'image/webp'){
            return null;
        }
        return ['El tipo de archivo no es una imagen'];
    },

    //VALIDAR TITULO DEL TOPIC
    title_topic: async (title) => {
        const errorArray = [];
        try{
            if(validator.isEmpty(title, {ignore_whitespace: true})){
                errorArray.push('El titulo es requerido');
            }
            if(errorArray.length == 0){
                return null;
            }
        }catch(error){
            errorArray.push('El titulo es requerido');
        }
        return errorArray;
    },

    //VALIDAR CONTENIDO DE UN TOPIC
    content_topic: async(content) => {
        const errorArray = [];
        try {
            if(validator.isEmpty(content, {ignore_whitespace: true})){
                errorArray.push('El contenido es requerido');
            }
            if(errorArray.length == 0){
                return null;
            }
        } catch (error) {
            errorArray.push('El contenido es requerido');
        }
        return errorArray;
    },

    //VALIDAR LENGUAJE
    lang_topic: async(lang) => {
        const errorArray = [];
        try {
            if(validator.isEmpty(lang, {ignore_whitespace: true})){
                errorArray.push('El lenguaje es requerido');
            }
            if(errorArray.length == 0){
                return null;
            }
        } catch (error) {
            errorArray.push('El lenguaje es requerido');
        }
        return errorArray;
    },

    //VALIDAR CONTENIDO DE UN COMENTARIO
    comment_topic: async(content) => {
        const errorArray = [];
        try {
            if(validator.isEmpty(content, {ignore_whitespace: true})){
                errorArray.push('El contenido del comentario es requerido');
            }
            if(errorArray.length == 0){
                return null;
            }
        } catch (error) {
            errorArray.push('El contenido del comentario es requerido');
        }
        return errorArray;
    }

};

