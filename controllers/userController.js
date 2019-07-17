const User = require('../models/User');
const Post = require('../models/Post');
const async = require('async');

exports.allUsers = function(req, res, next){
    User.find().exec(function(err, allUsers){
        if (err) { return next(err); }

        else if(allUsers.length == 0){
            res.send("No users found");
        }
        else{
            res.send(allUsers);
        }
    });
}

exports.own_profile = function(req, res, next){
    console.log("Hi");
    async.parallel({
        user: function(callback) {
            User.findById(req.user._id)
            .select({hash: 0}).exec(callback)
        },
        user_posts: function(callback){
            Post.find({'owner': req.user._id}).exec(callback)
        }
    }, function(err, results){
        if(err) { return next(err); }

        else{
            res.render('user/my_profile', {user: results.user, posts: results.user_posts});
        }
    });
}