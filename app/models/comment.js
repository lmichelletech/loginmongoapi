const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({
	text: String,
	article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createddate: { type: Date, default: Date.now },
    likes: Number
})

module.exports = mongoose.model('Comment', commentSchema);

