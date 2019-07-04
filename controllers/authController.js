const User = require('../models/User');
const async = require('async');
const passport = require('passport');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.local_register_get = function(req, res, next){
    res.render('auth/register_form');
}

exports.local_register_post = [
    //Validate fields
    body('name').isAlpha().withMessage('Only alphabetical characters allowed in Name field'),
    body('surname').isAlpha().withMessage('Only alphabetical characters allowed'),
    body('username').isAlphanumeric().withMessage('Only alpha-numeric characters allowed'),
    body('email').isEmail().withMessage('Invalid email'),
    body('birthdate').isISO8601(),

    //Sanitize fields
    sanitizeBody('name').escape(),
    sanitizeBody('surname').escape(),
    sanitizeBody('username').escape(),
    sanitizeBody('email').escape(),
    sanitizeBody('birthdate').toDate(),
    sanitizeBody('password').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('auth/register_form', {user: req.body, errors: errors.array()});
        }
        else{
            auth_error = {
                email: false,
                username: false,
            }
            async.parallel({
                usernameFound: function(callback) {
                    User.findOne({username: req.body.username})
                        .exec(callback)
                },
                emailFound: function(callback) {
                    User.findOne({email: req.body.email})
                        .exec(callback)
                },
            }, function(err, results){
                if(err){ return next(err); }

                if(results.emailFound){
                    auth_error.email = true;
                    res.render('auth/register_form', {user: req.body, auth_error: auth_error});
                }
                else if(results.usernameFound){
                    auth_error.username = true;
                    res.render('auth/register_form', {user: req.body, auth_error: auth_error});
                }
                else{
                    var{name, surname, username, email, birthdate, password} = req.body;
                    var user = new User(
                       {
                            name: name,
                            surname: surname,
                            username: username,
                            email: email,
                            birthdate: birthdate
                       }
                   );
                   user.setPassword(password);
                   user.save(function(err){
                        if (err) { return next(err); }
                        res.redirect('/login');
                   })
                }
            });
        }
    }
]

exports.local_login_get = function(req, res, next){
    res.render('auth/login_form');
}

exports.local_login_post = [
    body('email').isEmail().withMessage('Invalid email'),

    sanitizeBody('email').escape(),
    sanitizeBody('password').escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('auth/login_form', {user: req.body, errors: errors.array()});
        }
        else{
            passport.authenticate('local',  {session: true}, (err, user, info) => {
                if(err){ return next(err); }
                if(!user){
                    res.render('auth/login_form', {info: info});
                }
                else{
                    req.logIn(user, function (err) {
                        if (err) { return next(err); }
                    });
                    res.redirect('/success');
                }
            })(req, res, next);
        }
    }
]
