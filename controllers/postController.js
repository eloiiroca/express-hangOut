const Post = require('../models/Post');
const User = require('../models/User')


exports.post_list = function(req, res, next) {
    Post.aggregate([{
        $geoNear: {
            near: {
                type: 'Point',
                coordinates: [2.1352, 41.3869]
            },
            spherical: true,
            maxDistance: 50000,
            distanceField: 'distance'
        }
    }]).exec(function(err, postsByDistance){
        if(err) { return next(err); }
        else{
            User.populate(postsByDistance, {path: 'owner', select: 'name'}, function(err, populatedPosts){
                if(err){ return next(err) }
                else{
                    console.log(populatedPosts);
                    res.render('post/post_list', {post_list: populatedPosts});
                }
            });
        }
    });
};   

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
                    console.log(post);
                    res.redirect('/posts')
                }
            });
        }
    });
}