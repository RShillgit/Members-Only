var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only'});
});

/* GET sign-up page. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', { title: 'Sign Up'});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});

module.exports = router;
