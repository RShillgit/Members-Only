const { body, validationResult, check } = require("express-validator");

// Password Security
const bcrypt = require('bcrypt');

const connection = require('../models/users');
const users = connection.models.User;

const messages = require('../models/messages');

const async = require('async');

exports.createPOST = (req, res) => {
    res.send('create post')

    // Create new message with text
    const userID = req.session.passport.user;

    const timestamp = new Date().getTime();
    console.log(timestamp)

    const newMessage = new messages({
        author: userID,
        title: req.body.title,
        text: req.body.text,
        // TODO timestamp: ...
    })
}