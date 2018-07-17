module.exports = function(app, passport){
    require('./auth')(app, passport);

    app.get('/', function(req, res){
        res.render('index.ejs');
    })
    app.get('/passwordrecovery', function(req, res){
        res.render('passwordrecovery.ejs');
    })
    app.get('/passwordreset', function(req, res){
        res.render('passwordreset.ejs');
    })
    app.get('/profile', function(req, res){
        res.render('profile.ejs');
    })
    app.get('/signin', function(req, res){
        res.render('signin.ejs');
    })
    app.get('/signup', function(req, res){
        res.render('signup.ejs');
    })
    app.get('/updateprofile', function(req, res){
        res.render('updateprofile.ejs');
    })
    app.get('*', function(req, res){
        res.render('404.ejs');
    })
}