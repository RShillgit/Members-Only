const { body, validationResult, check } = require("express-validator");

const users = require('../models/users'); 

const messages = require('../models/messages');

exports.homeGET = (req, res) => {

    // If the user is logged in...
    if (req.isAuthenticated()) {
      
        // Get all messages
        messages.find({})
            .populate('author')
            .exec((err, results) => {
                if (err) return next(err);

            // Render home page with messages
            res.render('authedIndex', {
                title: 'Logged in Home Page',
                messages: results,
                admin: req.user.administrator_status,
                membership: req.user.membership_status,
            })
        })
    
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