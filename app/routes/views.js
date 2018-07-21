const format = require('../methods/format');
//hiding and showing occurs server side using browser request and response and passport
module.exports = function(app, isLoggedIn){
    app.get('/', function(req, res){
        //can be req.user or req.isAuthenticated()
        if(req.isAuthenticated()){
            res.redirect('/home');
        }
        else{
            //can also be render but should have a /
            //like res.render(/signin');
            res.redirect('signin');
        }
    })
    //
    // when you use redirect it redirects to the route
    // when you use render it literally constructs the html
    // passport makes user available in the request object
    app.get('/home', isLoggedIn, function(req, res){
        if(req.user){
            res.render('home', { user: req.user });
        }
        else{
            res.redirect('signin');
        }
    })
    
    app.get('/signin', function(req, res){
        if(req.isAuthenticated()){
            res.redirect('/home');
        }
        else{
            // Another way to do it
            // req.flash("sign-in-msg","Error Occured");
            // res.locals.messages = req.flash();
            // res.render('edit', { title: 'myApp'});

            res.render('signin', { message: req.flash('sign-in-msg')});
        }
    })
    
    app.get('/signup', function(req, res){
        if(req.user){
            res.redirect('/home');
        }
        else{
            res.render('signup', { message: req.flash('sign-up-msg')});
        }
    })
    app.get('/profile', isLoggedIn, function(req, res){
        if(req.user){
            res.render('profile', {
                message: req.flash('profile-msg'), 
                user: req.user
            });
        }
        else{
            res.render('signin', { message: req.flash('sign-in-msg')});
        }
    })

    app.get('/updateprofile', isLoggedIn, function(req, res){
        
        if(req.user){
            res.render('updateprofile', { 
                message: req.flash('update-profile-msg'), 
                user: req.user
            });
        }
        else{
            res.redirect('signin', { message: req.flash('sign-in-msg')});
        }
    })
    
    app.get('/passwordrecovery', function(req, res){
        res.render('passwordrecovery', { message: req.flash('password-recovery-msg')});
    })

    app.get('/passwordreset', function(req, res){
        res.render('passwordreset.ejs', { message: req.flash('password-reset-msg')});
    })

    app.get('/articlehome', function(req, res){
        res.render('home.ejs', { message: req.flash('submit-article-msg')});
    })
    // app.post('/createarticle', function(req, res){
    //     res.render('articleview.ejs', { message: req.flash('submit-article-msg')});
    // })

    app.get('/dashboard', function(req, res){
        res.render('dashboard.ejs', { message: req.flash('dashboard-msg')});
    })

    app.get('/deletearticle', function(req, res){
        res.render('dashboard.ejs', { message: req.flash('dashboard-msg')});
    })

    app.get('/articlelist', function(req, res){
        res.render('dashboard.ejs', { message: req.flash('dashboard-msg')});
    })

    app.get('/deletearticle', function(req, res){
        res.render('dashboard.ejs', { message: req.flash('dashboard-msg')});
    })
    app.post('/updatearticle', function(req, res){
        res.redirect('viewarticle.ejs', { message: req.flash('view-article-msg')});
    })
    app.post('/addarticlecomment', function(req, res){
        res.redirect('viewarticle.ejs', { message: req.flash('view-article-msg')});
    })
    app.post('/addvote', function(req, res){
        res.render('viewarticle.ejs', { message: req.flash('view-article-msg')});
    })

    app.get('/newarticle', function(req, res){
        res.render('newarticle.ejs', { message: req.flash('new-article-msg')});
    })

    app.post('/newarticle', function(req, res){
        res.render('newarticle.ejs', { message: req.flash('new-article-msg')});
    })

    app.get('*', function(req, res){
        res.render('404');
    })

}

