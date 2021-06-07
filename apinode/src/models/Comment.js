const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    content: String,
    date: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = model('Comment', commentSchema);