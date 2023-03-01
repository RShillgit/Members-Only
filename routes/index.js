var express = require('express');
const passport = require('passport');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only'});
});

/* GET login page. */
router.get('/login', indexController.loginGET);

/* POST login page */
// TODO Error messages
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', successRedirect: '/home'}));

/* GET sign-up page. */
router.get('/sign-up', indexController.signupGET);

/* POST sign-up page */
router.post('/sign-up', indexController.signupPOST);

/* GET logged in home page */
router.get('/home', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('authedIndex', {
      title: 'Logged in Home Page',
    })
  } else {
    res.redirect('/')
  }
})

/* GET club page */
router.get('/club', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('club');
  } else {
    res.redirect('/')
  }
});

/* POST club page */
router.post('/club', indexController.clubPOST);

/* GET admin page */
router.get('/admin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('admin');
  } else {
    res.redirect('/')
  }
});

/* POST admin page */
router.post('/admin', indexController.adminPOST);

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

module.exports = router;
