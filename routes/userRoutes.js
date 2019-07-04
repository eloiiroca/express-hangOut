const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/userController');

router.get('/', user_controller.allUsers);

module.exports = router;