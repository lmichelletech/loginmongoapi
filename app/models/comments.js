const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
var ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = mongoose.Schema({
	text: { type: String, trim: true, validate: validateText },
	article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
	user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createddate: { type: Date, default: Date.now },
    likestatus: Boolean
})

module.exports = mongoose.model('Comment', commentSchema);

