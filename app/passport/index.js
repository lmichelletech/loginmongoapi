const LocalStrategy = require('passport-local').Strategy;

const crypto = require('crypto');
const nodemailer = require('nodemailer');
//load the user schema from themodels to communicate with the database
const User = require('../models/user');


//inside this file is where we are going to have all of our passport strategies
module.exports = function (passport) {
    //passport strategies go here
    //passport puts the user in the request object if the user is logged in 
    //this in turn is passed as a parameter req for routes to use
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        //our first request to the database looks for user in database
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    //passportsearches the content of the body for a key,a username and password
    //passReqToCallback allows us to pass in the req from our route (lets us check if a user is logged in or not)
    //everytime we make a request we pass the req, email, password, and next function
    passport.use('local-sign-in', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            if (email) {
                email = email.toLowerCase();
                process.nextTick(function () {

                })
            }
        },


        passport.use('local-sign-up', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
            function (req, email, password, done) {
                if (email) {
                    email = email.toLowerCase();
                    process.nextTick(function () {

                        if (!req.user) {
                            User.findOne({
                                'email': email
                            },
                                function (err, user) {
                                    if (err) return done(err);

                                    if (user) {
                                        return done(null, false, req.flash('sign-up-msg', 'That email is already taken'));
                                    }

                                    else if (password !== req.body.password_confirmation) {
                                        return done(null, false, req.flash('sign-up-msg', 'Passwords do not match'));
                                    }

                                    else {
                                        let emailHash = crypto.randomBytes(20).toString("hex");
                                        let newUser = new User();
                                        newUser.email = email;
                                        newUser.password = new User.generateHash(password);
                                        newUser.name = req.body.name;
                                        newUser.birthday = req.body.birthday;
                                        newUser.isEmailConfirmed = false;
                                        newUser.emailConfirmationToken = emailHash;

                                        newUser.save(function (err) {
                                            if (err) {
                                                return done(err);
                                            }
                                        })

                                        let smtpTransport = nodemailer.createTransport({
                                            service: 'gmail',
                                            auth: {
                                                user: 'fviclass@gmail.com',
                                                pass: 'fviclass2017'
                                            }
                                        });

                                        let mailOptions = {
                                            to: email,
                                            from: 'Blog',
                                            subject: 'Hi ' + newUser.name + ', here is your email verification',
                                            text: "Please click in link below to confirm your email or copy and paste in your browser url ban \n\n http://"
                                                + req.headers.host + "/email confirmation/" + emailHash, html: `
                <p>Please click in the link below to <br> <a href='http://${req.headers.host}/email-confirmation/${emailHash}'>
                confirm your email address</a></p> `
                                        }

                                        smtpTransport.sendMail(mailOptions);
                                        return done(null, newUser, req.flash('sign-up-msg', 'A verification email has been sent to ' + email));
                                    }
                                }
                            )
                        }
                    })


                }

                else {
                    returndone(null, req.user);
                }
            }

        ))
    ))

    // Local update strategy
    passport.use('local-profile-update', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, email, password, done) {
            if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    return done(null, false, req.flash('update-profile-msg', 'You must be logged in to update your profile information'));
                }

                // if password is invalid, return message
                else if (!req.user.isValidPassword(password)) {
                    return done(null, false, req.flash('update-profile-msg', 'Oops! Wrong password'));
                }

                else {
                    var user = req.user;
                    if (req.body.new_password && req.body.new_password_confirmation && req.body.new_password === req.body.new_password_confirmation) {
                        user.password = user.generateHash(req.body.new_password);
                    }

                    user.name = req.body.name;
                    user.birthday = req.body.birthday;

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user, req.flash('update-profile-msg', 'Profile updated successfully!'));
                    });
                }
            });
        }));
}