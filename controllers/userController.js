const User = require('../models/User');

exports.allUsers = function(req, res, next){
    console.log(req.user);
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