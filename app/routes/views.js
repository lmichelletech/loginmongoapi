const format = require('../methods/format');
const Article = require('../models/article');

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
            res.redirect('signin', { message: req.flash('sign-in-msg')});
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


    













    app.get('/deletearticlerecord', isLoggedIn, function(req, res){
        if(req.user){
            res.render('dashboard.ejs', { message: req.flash('dashboard-msg'), 
            user: req.user});
        }
        else{
            res.redirect('/signin');
        }
    })
    

    app.get('/deletearticle', isLoggedIn, function(req, res){
        if(req.user){
            res.render('updatearticle.ejs', { message: req.flash('update-article-msg'), 
            user: req.user});
        }
        else{
            res.redirect('/signin');
        }
    })
    
    app.get('/articlelist', isLoggedIn, function(req, res){
        if(req.user){
            res.render('dashboard.ejs', { message: req.flash('dashboard-msg'), 
            user: req.user});
        }
        else{
            res.redirect('/signin');
        }
    })
    
    app.get('/updatearticle', isLoggedIn, function(req, res){
        if(req.user){
            res.render('updatearticle', { 
                message: req.flash('update-article-msg'), 
                user: req.user
            });
        }
        else{
            res.redirect('/signin');
        }
    })
    
    app.get('/addarticlecomment', isLoggedIn, function(req, res){
       if(req.user){
            res.render('viewarticle', { 
                message: req.flash('view-article-msg'), 
                user: req.user
            });
        }
        else{
            res.redirect('/signin');
        }
    })
    

    app.get('/addvote', isLoggedIn, function(req, res){
        if(req.user){
            res.render('viewarticle', { 
                message: req.flash('view-article-msg'), 
                user: req.user
            });
        }
        else{
            res.redirect('/signin');
        }
    })
    

    
    app.get('/createarticle', isLoggedIn, function(req, res){
        if(req.user){
            res.render('createarticle', { 
                message: req.flash('create-article-msg'), 
                user: req.user,
                article: req.article
            });
        }
        else{
            res.redirect('/signin');
        }
    })
    
 

    app.post('/createarticle', isLoggedIn, function(req, res){
        if(req.user){
            var current_date=new Date();
            var art = new Article({
                title: req.body.title,
                user_id: req.user,
                text: req.body.text,
                articledate: current_date,
                category: req.body.category,
                tags: req.body.tags
            });
        
            art.save(function(err) {
                if(err){
                    req.flash('create-article-msg', 'create error in database')
                    console.log('an error ocurred saving to database...');
                    return res.render('createarticle.ejs');
                }
                else {
                    req.flash('create-article-msg', 'created article successfully...')
                    console.log('saved article successfully...');
                }
                res.redirect('/dashboard');
            });

        }
        else{
            res.redirect('/signin');
        }
    })
    
    

    app.get('*', function(req, res){
        res.render('404');
    })

}

