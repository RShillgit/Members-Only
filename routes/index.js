var express = require('express');
const passport = require('passport');
var router = express.Router();

const indexController = require('../controllers/indexController');
const messageController = require('../controllers/messageController');

/* GET home page. */
router.get('/', function(req, res, next) {

  // Random string
  let randomString = Math.random().toString(36).substring(2,12);

  res.render('index', {
    title: 'Members Only',
    randomString: randomString,
  });
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
router.get('/home', messageController.homeGET);

/* GET club page */
router.get('/club', indexController.clubGET);

/* POST club page */
router.post('/club', indexController.clubPOST);

/* GET admin page */
router.get('/admin', indexController.adminGET);

/* POST admin page */
router.post('/admin', indexController.adminPOST);

/* GET logout */
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

/* POST Guest login */
router.post('/guest', passport.authenticate('local', {failureRedirect: '/', successRedirect: '/home'}));

router.post('/guestt', (req, res, next) => {
    indexController.guestPOST;
    passport.authenticate('local', {failureRedirect: '/', successRedirect: '/home'});
})

module.exports = router;
