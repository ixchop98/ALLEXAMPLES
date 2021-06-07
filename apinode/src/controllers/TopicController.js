const Topic = require('../models/Topic');
const validator = require('../helpers/validations');
const config = require('../config');

const controller = {

    //CREAR UN NUEVO TOPIC
    create: async (req, res) => {
        const {title, content, code, lang } = req.body;
        const validate_title = await validator.title_topic(title);
        const validate_content = await validator.content_topic(content);
        const validate_lang = await validator.lang_topic(lang);

        //COMPROBAR SI SON VALIDOS (TRUE ES QUE SON INVALIDOS)
        if(validate_title || validate_content || validate_lang){ 
            return res.status(400).json({errors: {validate_title, validate_content, validate_lang}});
        }
        try{
            const {sub} = req.user;      //RECOGER ID DEL USUARIO EN SESION
            const topic = new Topic({
                title,
                content,
                code,
                lang,
                user: sub
            });
            const topicStore = await topic.save();
            return res.json({message: 'Topic creado correctamente', topic: topicStore});
        }catch(error){
            console.log(error);
            return res.status(500).json({message: 'Error en el servidor'});
        }

    },

    //SACAR TODOS LOS TOPICS
    getAll: async (req, res) => {
        try{
            //VER SI VIENE PAGINA, SINO DEVOLVER TODOS
            const {page} = req.params;
            let topics = null;
            if(page && page !== '0'){
                const option = await config.optionsTopics(5, page);
                topics = await Topic.paginate({}, option);
            }else{

                //DEVOLVER LOS TOPICS CON FINES DE ADMINISTRACION TODOS
                topics = await Topic.find().populate({path: 'user', select: '-password -__v -role'});
                return res.json({topics: topics});  
            }

            //DEVUELVE TOPICS PAGINADOS
            return res.json({topics: topics.docs, totalDocs: topics.totalDocs, totalPages: topics.totalPages, page: topics.page});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //SACAR LOS TOPICS DE UN USUARIO
    getByUser: async (req, res) => {
        const {id} = req.params;
        try{
            const topics = await Topic.find({user: id}).sort({date: 'desc'});
            return res.json({topics});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //SACAR UN TOPIC POR ID
    getById: async (req, res) => {
        const {id} = req.params;
        try{
            const topic = await Topic.findById(id).populate({path: 'user', select: '-__v -password -role'});
            if(!topic){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'El topic no existe'});
            }
            return res.json({topic});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //ACTUALIZAR UN TOPIC
    update: async (req, res) => {
        const {title, content, lang, code} = req.body;
        const {id} = req.params;
        const validate_title = await validator.title_topic(title);
        const validate_content = await validator.content_topic(content);
        const validate_lang = await validator.lang_topic(lang);
        if(validate_title || validate_content || validate_lang){
            //CAMPOS INVALIDOS
            return res.status(400).json({errors: {validate_title, validate_content, validate_lang}});
        }
        const {sub} = req.user;     //ID DEL USUARIO DEL TOKEN
        try{
            const exist = await Topic.findById(id);
            if(!exist){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'No existe el topic'});
            }
            if(exist.user != sub){
                //NO ES EL DUEÑO DEL TOPIC
                return res.status(403).json({message: 'No eres el dueño del topic'});
            }
            const topic = await Topic.findOneAndUpdate({_id: id}, {title, content, lang, code}, {new: true});
            return res.json({topic});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json('Error en el servidor');
    },

    //BORRAR UN TOPIC
    delete: async (req, res) => {
        const {id} = req.params;
        try{
            const exist = await Topic.findById(id);
            if(!exist){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'No existe el topic'});
            }
            const {sub} = req.user;     //ID DEL USUARIO
            if(exist.user != sub){
                //NO ES EL DUEÑO DEL TOPIC
                return res.status(403).json({message: 'No es el dueño del topic'});
            }
            const topic = await Topic.findOneAndDelete({_id: id});
            return res.json({message: 'Topic eliminado correctamente', topic});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //BUSCAR TOPICS
    search: async (req, res) => {
        const{coincidence} = req.params;
        try{
            const topics = await Topic.find({$or: [
                                        {title: {$regex: coincidence, $options: 'i'}},
                                        {content: {$regex: coincidence, $options: 'i'}},
                                        {lang: {$regex: coincidence, $options: 'i'}}
                                    ]}).populate({path: 'user', select: '-__v -password -role'});
            return res.json({topics});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    }

};

module.exports = controller;