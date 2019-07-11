const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function(username, password, done) {
        User.findOne({email: username}, function(err, userFound){
            if(err) { return done(err); }

            if(!userFound) {
                return done(null, false, {message: 'Incorrect email'});
            }

            if(!userFound.validatePassword(password)){
                return done(null, false, {message: 'Incorrect password'});
            }
            return done(null, userFound);
        });
    }
));

