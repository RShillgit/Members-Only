var express = require('express');
var router = express.Router();

const messageController = require('../controllers/messageController');

/* GET message home page. */
router.get('/', function(req, res, next) {
    res.send('Not implemented')
  });

/* GET message create page. */
router.get('/create', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('createMessage', {
      title: 'Create Message'
    })
  } else {
    res.redirect('/')
  }
});

/* POST message create page. */
router.post('/create', messageController.createPOST);

module.exports = router;