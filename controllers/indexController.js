const { body, validationResult } = require("express-validator");
// Password Security
const bcrypt = require('bcrypt');

const users = require('../models/users');
const messages = require('../models/messages');

const async = require('async');

// Login GET
exports.loginGET = (req, res) => {
    res.render('login', { title: 'Login'});
}

// Login POST
exports.loginPOST = (req, res) => {
    res.redirect('/');
    
    // Validate users credentials

    // Render a home page only logged in users can access 
}

// Sign up GET
exports.signupGET = (req, res) => {
    res.render('sign-up', { title: 'Sign Up'});
}

// Sign up POST
exports.signupPOST = [

    // Validate and sanitize fields.
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("first_name", "First must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("last_name", "Last name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password_confirmation", "Enter the same password to confirm.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // There are errors. Render form again.
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                err: err,
            })
        } 
        
        // No errors, check if passwords match
        else {

            if (req.body.password === req.body.password_confirmation) {

                // Create hash
                bcrypt.hash(req.body.password, 10, function(err, hash) {

                    if(err) {
                        return next(err);
                    }

                    // Create user with hashed password
                    const newUser = new users({
                        first_name: req.body.first_name,
                        last_name: req.body.last_name,
                        username: req.body.username,
                        password: hash,
                        membership_status: false,
                    })
                    newUser.save((err, result) => {
                        if (err) {
                            return next(err);
                        }
                        // Successful
                        res.redirect('/'); // change this to a logged in page
                    })
                });
            }
        }   
    }
]