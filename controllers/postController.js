const Post = require('../models/Post');
const User = require('../models/User');

const moment = require('moment');

const userService = require('../services/userServices');

exports.post_list = function(req, res, next) {
    userService.getUserLocation(req.user._id, function(err, location, range){
        if(err){ return next(err); }

        else{
            Post.aggregate([{
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: location
                    },
                    spherical: true,
                    maxDistance: range,
                    distanceField: 'distance'
                }
            }]).exec(function(err, postsByDistance){
                if(err) { return next(err); }
                else{
                    User.populate(postsByDistance, {path: 'owner', select: 'name'}, function(err, populatedPosts){
                        if(err){ return next(err) }
                        else{
                            res.render('post/post_list', {post_list: populatedPosts});
                        }
                    });
                }
            });
        };   
    });
}
    

exports.get_create = function(req, res, next){
    res.render('post/create_form');
};

exports.post_create = function (req, res, next){
    User.findById(req.user._id)
    .exec(function(err, userFound){
        if(err){
            return next(err);
        }
        else if(userFound){
            var{title, description, duration, lat, long} = req.body;
            var hours = duration.split(":")[0];
            var minutes = duration.split(":")[1];
            var expiration = new moment(Date.now());
            expiration.add(hours, 'h');
            expiration.add(minutes, 'm');
            var post = new Post(
                {
                    title: title,
                    description: description,
                    creationDate: Date.now(),
                    expirationDate: expiration.toDate(),
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

exports.post_detail = function(req, res, next){
    Post.findById(req.params.id).populate('owner', {'name':1, 'surname':1, 'username':1, '_id':1 })
    .exec(function(err, postFound){
        if(err){
            return next(err);
        }
        else if(postFound){
            res.render('post/post_detail', {post: postFound});
        }
    });
}
