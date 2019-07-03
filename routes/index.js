const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/authController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', auth_controller.local_register_get)

module.exports = router;
