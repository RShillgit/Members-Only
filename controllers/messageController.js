const { body, validationResult, check } = require("express-validator");

// Password Security
const bcrypt = require('bcrypt');

const connection = require('../models/users');
const users = connection.models.User;

const messages = require('../models/messages');

const async = require('async');

exports.homeGET = (req, res) => {

    // If the user is logged in...
    if (req.isAuthenticated()) {
        // TODO: Find all the users and messages, so that we can get the author name

        // Get all users and messages
        async.parallel(
            {
                allMessages(callback) {
                    messages.find({})
                        //.populate('author')
                        .exec(callback)
                },
                allUsers(callback) {
                    // Users that have messages associated with them
                    users.find({messages: {$exists: true, $type: 4, $ne: [] } })
                        .exec(callback)
                }
            },
            (err, results) => {
                if(err) {
                    console.log(err)
                    return err
                }

                // Render home page with messages
                res.render('authedIndex', {
                    title: 'Logged in Home Page',
                    authors: results.allUsers,
                    messages: results.allMessages,
                })
            })

        /*
        // Get all messages
        messages.find({})
        .exec((err, results) => {
            if (err) return next(err);

            // Render home page with messages
            res.render('authedIndex', {
                title: 'Logged in Home Page',
                messages: results,
            })
        })
        */
    
    } else {
        res.redirect('/');
    }
}

exports.createPOST = (req, res) => {

    const userID = req.session.passport.user;

    // Create new message
    const newMessage = new messages({
        author: userID,
        title: req.body.title,
        text: req.body.text,
        timestamp: new Date()
    })

    // Get the author of the message
    users.findOne({'_id': userID}).exec((err, result) => {
        if (err) return next(err);
        
        // Add message to their messages array
        result.messages.push(newMessage);
        result.save();
    })

    // Save message 
    newMessage.save((err, result) => {
        if (err) {
            return next(err);
        }

        // Successful, redirect to home page
        return res.redirect('/home');
    })
}