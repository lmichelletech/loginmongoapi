const format = require('../methods/format');
const Article = require('../models/article');
const Comment = require('../models/comment');
const User = require('../models/user');

//hiding and showing occurs server side using browser request and response and passport
module.exports = function (app, isLoggedIn) {
    app.get('/', function (req, res) {
        //can be req.user or req.isAuthenticated()
        if (req.isAuthenticated()) {
            res.redirect('/home');
        }
        else {
            res.redirect('signin');
        }
    })

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
                  return res.render('home');
                }
                else{

                  Comment.find({}, function(err, comments){

                    if(err){
                        console.log("comment error " + err)
                        return res.send(err);
                    }
                    else{
                        User.find({}, function(err, users)
                        {
                            if(err){
                                console.log("comment user error " + err)
                                return res.send(err);
                            }
                            else{
                                req.flash('home-msg', '')
                                res.render('home.ejs', { message: req.flash('home-msg'),
                                user: req.user, users : users, articles: data, comments: comments});
                            }
                            
                        })

                    }

                  }).sort({article_date: -1})
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

    app.get('/home/category/:index', (req, res) => {
        let index = req.params.index;
        console.log("category index " + index);
        
        Article.find({category: index},function(err, result){
            if (err){
                console.log("category error " + err);
                return res.send('Error viewing category! ' + err);
            }
            if (!result) return res.send('Invalid category index. No data found.');
            if (result) {
                console.log("found category " + result);
                Comment.find({}, function(err, comments){

                    if(err){
                        console.log("comment error " + err)
                        return res.send(err);
                    }
                    else{
                        User.find({}, function(err, users)
                        {
                            if(err){
                                console.log("comment user error " + err)
                                return res.send(err);
                            }
                            else{
                                req.flash('home-msg', 'Record found')
                                res.render('home.ejs', { message: req.flash('home-msg'),
                                user: req.user, users : users, articles: result, comments: comments});
                            }
                        })
                    }
                  }).sort({article_date: -1})
            }
        })
    });


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
                        req.flash('dashboard-msg', '')
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
    
    
    app.get('/dashboard/delete/:id', (req, res) => {
        let id = req.params.id;
        console.log("delete id " + id);
        
        Article.remove({"_id":req.params.id},function(err, result){
            console.log("delete error " + err);
            res.redirect('/dashboard');
        })
    });
    


    app.get('/dashboard/category/:index', (req, res) => {
        let index = req.params.index;
        console.log("category index " + index);
        
        Article.find({category: index},function(err, result){
            if (err){
                console.log("category error " + err);
                return res.send('Error viewing category! ' + err);
            }
            if (!result) return res.send('Invalid category index. No data found.');
            if (result) {
                console.log("found category " + result);
                res.render('dashboard', {
                    message: req.flash('dashboard-msg'),
                    user: req.user,
                    articles: result
                });
            }
            console.log("work it " + req.params.index);
        })
    });

    app.get('/home/addlike/:article_id', isLoggedIn, function (req, res) {
        if (req.user) {
            console.log("article id for like ******* " + req.params.article_id);
            

            Article.update({_id: req.params.article_id},  {$inc: {'likes' : 1  }}, function (err, data) {
                if (err) return res.send('Error adding like to article! ' + err);
                if (!data) return res.send('Unable to add like because no article exists with that ID.');
                if (data) {
                    console.log("article like was added successfully");
                    return res.redirect('/home');
                }
            });
        }
        else {
            res.redirect('/signin');
        }
    })

    app.get('/updatearticle/:id', isLoggedIn, function (req, res) {
        if (req.user) {
            Article.findById(req.params.id, function (err, articles) {
            console.log("article ID******* " + req.params.id + " >>>>>>>>>>>>> " + articles.title);
                if (err) return res.send('Error getting article! ' + err);
                if (!articles) return res.send('No article exists with that ID.');
                if (articles) {
                    console.log("article count ******* " + articles._id + " ***************** " + articles);
                    res.render('updatearticle.ejs', {
                        message: req.flash('update-article-msg'),
                        user: req.user,
                        articles: articles
                    });
                }
                
            });
        }
        else {
            res.redirect('/signin');
        }
    });
    
    app.post('/updatearticle', isLoggedIn, function (req, res) {
        if (req.user) {
            Article.update({'_id': req.body.id}, {$set: {'title': req.body.title, 'text': req.body.text, 'tags': req.body.tags, 'category': req.body.category} }, function(err) {
                if(err) {
                    req.flash('update-article-msg', 'update error occurred in database')
                    console.log('an error occurred updating to database...');
                    return res.render('updatearticle', {
                        message: req.flash('update-article-msg'),
                        user: req.user
                    });
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

    app.post('/createarticle', function (req, res) {
        
            var current_date = new Date();
            var art = new Article({
                title: req.body.title,
                user_id: req.user.id,
                text: req.body.text,
                articledate: current_date,
                category: req.body.category,
                likes: 0,
                tags: req.body.tags,
                views: 0
            })

            art.save(function (err) {
                if (err) {
                    
                    console.log('an error ocurred saving to database...' + err);
                    res.redirect('/dashboard');
                }
                else {
                    console.log('saved article successfully...');
                    res.redirect('/dashboard');
                }
        })
    })

    app.post('/home/createcomment', function (req, res) {

            var current_date = new Date();
            var com = new Comment({
                text: req.body.text,
                article_id: req.body.currentArticle,
                user_id: req.user.id,
                createddate: current_date,
                likes: 0
            })

            com.save(function (err) {
                if (err) {
                    console.log('an error ocurred saving comment to database...' + err);
                    res.redirect('/home');
                }
                else {
                    console.log('saved comment successfully...');
                    res.redirect('/home');
                }
        })
    })

    app.get('/viewarticle/:id', (req, res) => {
        Article.findById(req.params.id, function (err, articles) {
            if (err) return res.send('Error viewing article! ' + err);
            if (!articles) return res.send('Invalid Article ID. No data with that ID.');
            if (articles) {
                console.log("article : " + articles.title);
                Article.update({_id: req.params.id},  {$inc: {'views' : 1  }}, function (err, data) {
                    if (err) return res.send('Error unable to increment view on article! ' + err);
                    if (!data) return res.send('Unable to increment view because no article exists with that ID.');
                    if (data) {
                        console.log("view was incremented successfully");
                        Comment.find({article_id: id}, function(err, comments){

                            if(err){
                                console.log("comment error " + err)
                                return res.send(err);
                            }
                            else{
                                req.flash('view-article-msg', 'Full Article & Comments')
                                res.render('viewarticle.ejs', { message: req.flash('view-article-msg'),
                                user: req.user, articles: articles, comments: comments});
                            }
        
                        }).sort({article_date: -1}).limit(3)
                    }
                });
            }
        });
    })

    app.get('*', function (req, res) {
        res.render('404');
    })
}