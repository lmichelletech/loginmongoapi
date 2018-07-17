//environment node using express server
var port = process.env.PORT || 8500;
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const database = require('./database')();
//function with a parameter
require('./app/passport')(passport);

//parse the request body
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//set up ejs for our templating 
app.set('view engine', 'ejs');

//setup our middleware and our headers
//the order of middleware matters
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8500');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions) keeps session alive
    res.setHeader('Access-Control-Allow-Credentials', true);
  
    // Pass to next layer of middleware
    next();
  });
  

  //we need this for password app
  app.set('trust proxy', 1); //trust first proxy

  app.use(session({
      secret: 'secretcookiehere',
      resave: false,
      saveUninitialized: true,
      cookie: {
          secure: false
      }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


//dirname is a global variable courtesy of Node.js and it returns the absolute path
//expose our assets like css, js, images
app.use("/", express.static(__dirname + "/assets"));

//pass passport and app to our routes
//this will automatically look for index.js in each folder
require('./app/routes')(app, passport);
 

app.listen(port, function(err){
    if(err) return console.log('error ', err);

    console.log("Server listening on port " + port);
});