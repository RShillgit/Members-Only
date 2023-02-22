var express = require('express');
var router = express.Router();

const messageController = require('../controllers/messageController');

/* GET message home page. */
router.get('/', function(req, res, next) {
    res.send('Not implemented')
  });

module.exports = router;