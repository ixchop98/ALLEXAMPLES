const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

//ESQUEMA PARA SUBDOCUMENTOS
const commentSchema = new Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

const topicSchema = new Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'},
    comments: [commentSchema]
});

topicSchema.plugin(mongoosePaginate);   //PAGINACION

module.exports = model('Topic', topicSchema);