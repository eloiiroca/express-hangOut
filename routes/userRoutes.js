const express = require('express');
const router = express.Router();

function isLogged() {
    return function (req, res, next) {
        if (req.user){
            next();
        }
        else{
            res.send(403);
        }
    }
}

const user_controller = require('../controllers/userController');

router.get('/', isLogged(), user_controller.allUsers);

router.get('/profile', isLogged(), user_controller.own_profile);

module.exports = router;