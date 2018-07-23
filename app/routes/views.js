const format = require('../methods/format');
const Article = require('../models/article');

//hiding and showing occurs server side using browser request and response and passport
module.exports = function (app, isLoggedIn) {
    app.get('/', function (req, res) {
        //can be req.user or req.isAuthenticated()
        if (req.isAuthenticated()) {
            res.redirect('/home');
        }
        else {
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
        if (req.user) {
            var cutoff = new Date();
            cutoff.setDate(cutoff.getDate()-5);
            Article.find({"articledate": {$gt: cutoff}}, function (err, data){
            if(err){
              console.log(err);
            }
            else {
                if(!data){
                  req.flash('home-msg', 'No articles found.');
                  return res.render('/home');
                }
                else{
                  console.log("data count : " + data.length);
                  req.flash('home-msg', 'Record found')
                  res.render('home.ejs', { message: req.flash('home-msg'),
                  user : req.user, articles: data});
                }
              
            }
        
            })
        }
        else {
            res.redirect('signin');
        }
    })
    

    app.get('/signin', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/home');
        }
        else {
            res.render('signin', { message: req.flash('sign-in-msg') });
        }
    })

    app.get('/signup', function (req, res) {
        if (req.user) {
            res.redirect('/home');
        }
        else {
            res.render('signup', { message: req.flash('sign-up-msg') });
        }
    })
    app.get('/profile', isLoggedIn, function (req, res) {
        if (req.user) {
            res.render('profile', {
                message: req.flash('profile-msg'),
                user: req.user
            });
        }
        else {
            res.redirect('signin', { message: req.flash('sign-in-msg') });
        }
    })

    app.get('/updateprofile', isLoggedIn, function (req, res) {

        if (req.user) {
            res.render('updateprofile', {
                message: req.flash('update-profile-msg'),
                user: req.user
            });
        }
        else {
            res.redirect('signin', { message: req.flash('sign-in-msg') });
        }
    })

    app.get('/passwordrecovery', function (req, res) {
        res.render('passwordrecovery', { message: req.flash('password-recovery-msg') });
    })

    app.get('/passwordreset', function (req, res) {
        res.render('passwordreset.ejs', { message: req.flash('password-reset-msg') });
    })













    app.get('/articlelist', isLoggedIn, function (req, res) {
        if (req.user) {
            res.render('dashboard.ejs', {
                message: req.flash('dashboard-msg'),
                user: req.user
            });
        }
        else {
            res.redirect('/signin');
        }
    })



    app.get('/addarticlecomment', isLoggedIn, function (req, res) {
        if (req.user) {
            res.render('viewarticle', {
                message: req.flash('view-article-msg'),
                user: req.user
            });
        }
        else {
            res.redirect('/signin');
        }
    })


    app.get('/addvote', isLoggedIn, function (req, res) {
        if (req.user) {
            res.render('viewarticle', {
                message: req.flash('view-article-msg'),
                user: req.user
            });
        }
        else {
            res.redirect('/signin');
        }
    })









    app.get('/viewarticle/:_id', isLoggedIn, function (req, res) {
        if (req.user) {
            Article.find({ id: req.params.id }, function (err, data) {
                if (err) return res.send('Error viewing article! ' + err);
                if (!data) return res.send('Invalid Article ID. No data with that ID.');
                if (data) {
                    console.log("article count ******* " + data.length + " " + data);
                    res.render('viewarticle', {
                        message: req.flash('view-article-msg'),
                        user: req.user,
                        articles: data
                    });
                }
            });
        }
        else {
            res.redirect('/signin');
        }
    });



    app.get('/createarticle', isLoggedIn, function (req, res) {
        if (req.user) {
            res.render('createarticle', {
                message: req.flash('create-article-msg'),
                user: req.user,
                article: req.article
            });
        }
        else {
            res.redirect('/signin');
        }
    })

    app.post('/createarticle', isLoggedIn, function (req, res) {
        if (req.user) {
            var current_date = new Date();
            var art = new Article({
                title: req.body.title,
                user_id: req.user,
                text: req.body.text,
                articledate: current_date,
                category: req.body.category,
                tags: req.body.tags
            });

            art.save(function (err) {
                if (err) {
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
        else {
            res.redirect('/signin');
        }
    })













    app.get('/dashboard', isLoggedIn, function(req, res){
        if (req.user) {
            Article.find({}, function (err, data){
                if(err){
                console.log(err);
                }
                else {
                    if(!data){
                    req.flash('dashboard-msg', 'No articles found.');
                    return res.redirect('/dashboard');
                    }
                    else{
                    console.log("data count : " + data.length);
                    req.flash('dashboard-msg', 'Record found')
                    res.render('dashboard.ejs', { message: req.flash('dashboard-msg'),
                    user : req.user, articles: data});
                    }
                
                }
            
            })
        }
        else {
            res.redirect('/signin');
        }
    })
    
    
    app.get('/dashboard/delete/:id', isLoggedIn, (req, res) => {
        if (req.user) {
            Article.find({ id: req.params.id }).exec(function (err, data) {
                if (!err && data) {
                    console.log("deleted " + req.params.id);
                    Article.remove().exec();
                    res.render('dashboard.ejs', { message: req.flash('dashboard-msg'),
                        user : req.user, articles: data});
                } else {
                    console.log("Error deleting article!");
                    res.redirect('/dashboard', { message: req.flash('error deleting') });
                }
            });
        }
        else {
            res.redirect('/signin');
        }
    });
    
     
    app.get('/updatearticle/:_id', isLoggedIn, function (req, res) {
        if (req.user) {
            Article.find({ id: req.params.id }, function (err, data) {
                if (err) return res.send('Error getting article! ' + err);
                if (!data) return res.send('No article exists with that ID.');
                if (data) {
                    console.log("article count ******* " + data.length + " " + data);
                    res.render('updatearticle', {
                        message: req.flash('update-article-msg'),
                        user: req.user,
                        articles: data
                    });
                }
            });
        }
        else {
            res.redirect('/signin');
        }
    });
    
    




    
    app.post('/updatearticle/:_id', isLoggedIn, function (req, res) {
        if (req.user) {
            console.log("update request " + req.params.id);
            Article.update({id: req.params.id}, {$set: {title: req.body.title, text: req.body.text} }, function(err) {
 
                if(err) {
                    req.flash('update-article-msg', 'update error occurred in database')
                    console.log('an error occurred updating to database...');
                    return res.render('updatearticle.ejs');
                }
         
                else {
                    req.flash('update-article-msg', 'updated article successfully...')
                    console.log('updated article successfully...');
                    res.redirect('/dashboard');
                }
         
            });
        

        }
        else {
            res.redirect('/signin');
        }
    });
      
















    app.get('*', function (req, res) {
        res.render('404');
    })

}

