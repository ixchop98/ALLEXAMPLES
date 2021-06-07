const validator = require('../helpers/validations');
const Topic = require('../models/Topic');

const controller = {

    //CREAR UN COMENTARIO
    create: async (req, res) => {
        const {content} = req.body;
        const validate_content = await validator.content_topic(content);
        if(validate_content){
            //COMENTARIO INVALIDO
            return res.status(400).json({errors: {validate_content}});
        }
        const {id} = req.params;
        try{
            const topic = await Topic.findById(id);
            if(!topic){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'No existe el topic'});
            }
            const comment = {
                user: req.user.sub,
                content: content
            };
            
            //GUARDAR EL COMENTARIO EN EL TOPIC
            topic.comments.push(comment);

            await topic.save();
            return res.json({comment});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //EDITAR UN COMENTARIO
    update: async (req, res) => {
        const {content} = req.body;
        const validate_content = await validator.content_topic(content);
        if(validate_content){
            //CONTENIDO INVALIDO
            return res.status(400).json({errors: {validate_content}});
        }
        const {idTopic, idComment} = req.params;
        try{
            const topic = await Topic.findById(idTopic);
            if(!topic){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'No existe el topic'});
            }
            const comment = await topic.comments.id(idComment);
            if(comment.user != req.user.sub){
                //NO ES SU COMENTARIO
                return res.status(403).json({message: 'No es el dueño del comentario'});
            }
            comment.content = content;
            const upTopic = await Topic.findOneAndUpdate({'comments._id': idComment}, {'$set': {'comments.$.content': content}}, {new: true});
            const upComment = await upTopic.comments.id(idComment);
            return res.json({comment: upComment});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    },

    //ELIMINAR UN COMENTARIO
    delete: async (req, res) => {
        const {id} = req.params;
        try{
            const topic = await Topic.findOne({'comments._id': id});
            if(!topic){
                //NO EXISTE EL TOPIC
                return res.status(404).json({message: 'No existe el topic'});
            }
            const comment = await topic.comments.id(id);
            if(comment.user != req.user.sub){
                //NO ERES EL DUEÑO DEL COMENTARIO
                return res.status(403).json({message: 'No eres el dueño del comentario'});
            }
            await comment.remove(); //BORRAR EL COMENTARIO
            await topic.save(); //GUARDAR EL TOPIC MODIFICADO
            return res.json({comment});
        }catch(error){
            console.log(error);
        }
        return res.status(500).json({message: 'Error en el servidor'});
    }

};

module.exports = controller;