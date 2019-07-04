const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const auth_controller = require('../controllers/authController')

router.use(session({ secret: 'hangOut-secret-test', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', auth_controller.local_register_get);

router.post('/register', auth_controller.local_register_post);

router.get('/login', auth_controller.local_login_get);

router.post('/login', auth_controller.local_login_post);


router.get('/success', function(req, res){
  console.log(req.user);
    res.send("Success");
});


module.exports = router;
