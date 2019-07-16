const Post = require('../models/Post');
const User = require('../models/User');

exports.getUserLocation = function(id, callback){
    User.findById(id, function(err, userFound){
        if(!err && userFound){
            callback(err, userFound.location, userFound.range);
        }
        else{
            callback(err, null);
        }
    });
}

