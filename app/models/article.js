const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//all in one line
const articleSchema = mongoose.Schema({
    id: {type: Number},
    title: String,
    user_id: {type: String, trim: true},
    text: String,
    articledate: Date,    
    category: [String],
    tags: String,
    comments: [{text: String, user_id: Number, commentdate: Date, votes: Number}],

});



//create the model and expose it to our app
module.exports = mongoose.model('Article', articleSchema);