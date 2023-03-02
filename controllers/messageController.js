const { body, validationResult, check } = require("express-validator");

// Password Security
const bcrypt = require('bcrypt');

const connection = require('../models/users');
const users = connection.models.User;

const messages = require('../models/messages');

const async = require('async');

exports.createPOST = (req, res) => {

    // Create new message with text
    const userID = req.session.passport.user;

    const newMessage = new messages({
        author: userID,
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date()
    })
    newMessage.save((err, result) => {
        if (err) {
            return next(err);
        }
        // Successful, redirect to home page
        return res.redirect('/home');
    })
}