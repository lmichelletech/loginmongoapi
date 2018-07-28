const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//all in one line
const articleSchema = mongoose.Schema({
    title: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    articledate: Date,    
    category: [String],
    likes: Number,
    tags: String

});



//create the model and expose it to our app
//Compile model from schema
module.exports = mongoose.model('Article', articleSchema);