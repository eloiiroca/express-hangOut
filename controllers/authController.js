var User = require('../models/user');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.local_register_get = function(req, res, next){
    res.render('auth/register_form');
}

exports.local_register_post = [

    //Validate fields
    body('name').isAlpha().withMessage('Only alphabetical characters allowed'),
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

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render('auth/register_form', {user: req.body, errors: errors.array()});
        }
        else{
            userFound = {
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
                    userFound.email = true;
                    res.render('auth/register_form', {user: req.body, user: userFound});
                }
                else if(results.usernameFound){
                    userFound.username = true;
                    res.render('auth/register_form', {user: req.body, user: userFound});
                }
                else{
                    var{name, surname, username, email, birthdate} = req.body;
                    var user = new User(
                       {
                            name: name,
                            surname: surname,
                            username: username,
                            email: email,
                            birthdate: birthdate
                       }
                   );
                   user.save(function(err){
                        if (err) { return next(err); }
                        res.redirect('/login');
                   })
                }
            });
        }
    }
]