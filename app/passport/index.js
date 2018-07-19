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
      // Local signin strategy
  passport.use('local-sign-in', new LocalStrategy({
      
    // By default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is signed in or not)
  },
  function (req, email, password, done) {
    if (email)
      email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
    // asynchronous
    
    process.nextTick(function () {
      User.findOne({
        'email': email
      }, 
      function (err, user) {
          console.log("start sign in")
        // if there are any errors, return the error
        if (err) {
            console.log('database error');
            
            return done(err);
        }

        // if no user is found, return the message
        else if (!user) {
            console.log("not user found")
            return done(null, false, req.flash('sign-in-msg', 'No user found'));
        }

        // if password is invalid, return message
        else if (!user.isValidPassword(password)) {
            console.log("not valid password")
          return done(null, false, req.flash('sign-in-msg', 'Oops! Wrong password'));
        }

        // if email hasn't been confirmed, return message
        else if (!user.isEmailConfirmed()) {
            console.log('unconfirmed email')
          return done(null, false, req.flash('sign-in-msg', 'Your email has not been confirmed yet'));
        }

        // all is well, return user
        else return done(null, user);
      });
    });
  }));


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
                                    newUser.password = newUser.generateHash(password);
                                    newUser.name = req.body.name;
                                    newUser.birthdate = req.body.birthdate;
                                    newUser.emailConfirmed = false;
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
                    return done(null, false, req.flash('update-profile-msg', 'Please enter your current password for the changes to take effect.'));
                }

                else {
                    var user = req.user;
                    if (req.body.new_password && req.body.new_password_confirmation && req.body.new_password === req.body.new_password_confirmation) {
                        user.password = user.generateHash(req.body.new_password);
                    }

                    user.name = req.body.name;
                    user.birthdate = req.body.birthdate;

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user, req.flash('update-profile-msg', 'Profile updated successfully!'));
                    });
                }
            });
        }));
























        // Local update strategy
    passport.use('local-password-reset', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, password, done) {
            
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    return done(null, false, req.flash('password-reset-msg', 'You must be logged in to reset your password'));
                }

                // if password is invalid, return message
                else if (!req.user.isValidPassword(password)) {
                    return done(null, false, req.flash('password-reset-msg', 'Please enter your current password for the changes to take effect.'));
                }

                else {
                    var user = req.user;
                    if (req.body.new_password && req.body.new_password_confirmation && req.body.new_password === req.body.new_password_confirmation) {
                        user.password = user.generateHash(req.body.new_password);
                    }

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user, req.flash('password-reset-msg', 'Password reset successfully!'));
                    });
                }
            });
        }));
}