const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//all in one line
const userSchema = mongoose.Schema({
    email: {type: String, lowercase: true, trim: true},
    password: String,
    name: {type: String, trim: true},
    title: String,
    school: String,
    birthdate: Date,
    emailConfirmed: {type: Boolean, default: false},
    emailConfirmationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    img: String
});

//generate hash
//methods here is almost like saying prototype
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//validate hash by comparing password with hash
userSchema.methods.isValidPassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isEmailConfirmed = function(){
    return this.emailConfirmed;
};

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };
//create the model and expose it to our app
module.exports = mongoose.model('User', userSchema);