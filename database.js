module.exports = function(){
    // const mongoose = require('mongoose');
    
    // const db = mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true});

    //Import the mongoose module
    var mongoose = require('mongoose');

    //Set up default mongoose connection
    var mongoDB = 'mongodb://localhost:27017/blog';
    mongoose.connect(mongoDB, {useNewUrlParser: true});
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    return db;
}



