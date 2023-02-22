var express = require('express');
var router = express.Router();

const indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only'});
});

/* GET login page. */
router.get('/login', indexController.loginGET);

/* POST login page */
router.post('/login', indexController.loginPOST);

/* GET sign-up page. */
router.get('/sign-up', indexController.signupGET);

/* POST sign-up page */
router.post('/sign-up', indexController.signupPOST);

/* GET club page */
router.get('/club', indexController.clubGET);

/* POST club page */
router.post('/club', indexController.clubPOST);

/* GET admin page */
router.get('/admin', indexController.adminGET);

/* POST admin page */
router.post('/admin', indexController.adminPOST);

module.exports = router;
