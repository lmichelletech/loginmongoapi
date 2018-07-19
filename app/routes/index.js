//hiding and showing occurs server side using browser request and response and passport
module.exports = function(app, passport){
    //require the authentication routes
    require('./auth')(app, passport, isLoggedIn);
    //require the views routes
    require('./views')(app, isLoggedIn);
  
}

function isLoggedIn(req, res, next){
    if (req.isAuthenticated())
    return next();

    res.redirect('/');
}