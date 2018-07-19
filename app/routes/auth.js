const asynq = require('async');
//loads user schema from models to communicate with the database
const User = require('../models/user');
const nodemailer = require('nodemailer');

module.exports = function(app, passport, isLoggedIn){
    
    app.post('/signup', passport.authenticate('local-sign-up', {
        successRedirect: '/signin',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.post('/signin', passport.authenticate('local-sign-in', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
    }));

    app.get('/signout', isLoggedIn, function(req, res){
        req.logout();
        res.redirect('/');
    })

    app.get('/email-confirmation/:email_token', function(req, res){
        let token = req.params.email_token;
        console.log(token);
        asynq.waterfall([
            function(done){
                User.findOne({ 'emailConfirmationToken': token},
            function (err, user){
                if(!user){
                    req.flash('sign-up-msg', 'No user found');
                    return res.redirect('/signup');
                }

                user.emailConfirmed = true; 
                user.emailConfirmationToken = undefined;

                user.save(function (err){
                    if(err){
                        req.flash('sign-up-msg', 'Database error')
                        return res.redirect('/signup');
                    }
                    done(err, user);
                })
            });
            },
            function (user, done){
                let smtpTransport = nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user: 'fviclass@gmail.com',
                        pass: 'fviclass2017'
                    }
                });
                let mailOptions = {
                    to: user.email,
                    from: 'Email Confirmed',
                    subject: 'Your email has been confirmed',
                    text: 'Hello, \n\n' +
                    'This is a confirmation that the email for your account ' +
                    user.email + ' has been confirmed. \n'
                };
                smtpTransport.sendMail(mailOptions);
                req.flash('sign-in-msg', 'Your email has been confirmed')
                return res.redirect('/signin');
            }
        ], function(err){
            if(err) return err;
            console.log('Email Confirmed');
        })
    })

    // Handle profile update
    app.post('/updateprofile', passport.authenticate('local-profile-update', {
        successRedirect: '/updateprofile',
        failureRedirect: '/updateprofile',
        failureFlash: true // allow flash messages
    }));

    // Handle password reset
    app.post('/passwordreset', passport.authenticate('local-password-reset', {
        successRedirect: '/passwordreset',
        failureRedirect: '/passwordreset',
        failureFlash: true // allow flash messages
    }));

}