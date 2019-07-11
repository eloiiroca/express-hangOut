const express = require('express');

const router = express.Router();

const post_controller = require('../controllers/postController');

/* GET home page. */
router.get('/', post_controller.post_list);

router.get('/create', post_controller.get_create);

router.post('/create', post_controller.post_create);


module.exports = router;