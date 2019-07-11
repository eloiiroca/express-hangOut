const Post = require('../models/Post');
const User = require('../models/User')

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


exports.post_list = function(req, res, next) {
    if(req.user){
        Post.find().populate('owner')
        .exec(function(err, allPosts){
            if(err){
                return next(err);
            }
            else{
                //console.log(allPosts[0].owner);
                res.render('post/post_list', {post_list: allPosts});
            }
        });
    }
    else{
        res.redirect("/");
    }
        
};

exports.get_create = function(req, res, next){
    res.render('post/create_form');
};

exports.post_create = function (req, res, next){
    if(req.user){
        User.findById(req.user._id)
        .exec(function(err, userFound){
            if(err){
                return next(err);
            }
            else{
                var{title, description, duration, lat, long} = req.body;
                var post = new Post(
                    {
                        title: title,
                        description: description,
                        creationDate: Date.now(),
                        expirationDate: Date.now(),
                        owner: userFound,
                        loc: {
                            type: "Point",
                            coordinates: [long, lat]
                        }
                    }
                );
                post.save(function(err){
                    if(err){
                        return next(err);
                    }
                    else{
                        res.redirect('/posts')
                    }
                });
            }
        });
    }
}