const express = require('express');

const router = express.Router();

const post_controller = require('../controllers/postController');

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


router.get('/', isLogged(), post_controller.post_list);

router.get('/create', isLogged(), post_controller.get_create);

router.post('/create', isLogged(), post_controller.post_create);

module.exports = router;