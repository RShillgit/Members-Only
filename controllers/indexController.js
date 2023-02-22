const { body, validationResult, check } = require("express-validator");
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
exports.loginPOST = [

    // Validate and sanitize fields.
    body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
    body("password", "Password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // There are errors. Render form again.
        if (!errors.isEmpty()) {
            res.render('login', {
                err: errors,
            })
        } 

        // No errors
        else {
            // Check database for username and password
            users.findOne({username: req.body.username})
                .exec((err, result) => {
                    if (err) return next(err);

                    // Compare inputted password to the stored hashed password
                    bcrypt.compare(req.body.password, result.password, function(err, result) {

                        // If the password matches, log the user in
                        if (result) {
                            // Render a home page only logged in users can access 
                            res.render('authedIndex', {
                                title: 'Logged in Home Page',
                            })
                        }

                        // If the password doesnt match rerender form with error message
                        else {
                            console.log(err)
                            res.render('login', {
                                err: 'This username/password combination is incorrect',
                            })
                        }
                    });
                })
        }
    }
]

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
    check("password")
    .exists()
    .isLength({ min: 1 })
    .escape(),
    check("password_confirmation", "Passwords must match")
    .exists()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validation errors
        const errors = validationResult(req);

        // There are errors. Render form again.
        if (!errors.isEmpty()) {
            res.render('sign-up', {
                err: errors.errors,
            })
        } 
        
        // No errors, check if this username already exists
        else {

            // Check if username already exists
            users.findOne({ username: req.body.username })
                .exec((err, result) => {
                    if (err) return next(err);
                    
                    // If username already exists
                    if (result) {
                        res.render('sign-up', {
                            err: [{msg: 'Username already exists'}],
                        });
                    }

                     // If it doesn't, check to see if the passwords match
                    else if (req.body.password === req.body.password_confirmation) {

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

                                // Successful, redirect to Login page 
                                // TODO: Success message?
                                return res.redirect('/login'); 
                            })
                        });
                    }
                })
        }   
    }
]

// Club GET
exports.clubGET = (req, res) => {
    res.render('club');
}

// Club POST
exports.clubPOST = (req, res) => {
    res.send('Joining secret club...');
}

// Admin GET
exports.adminGET = (req, res) => {
    res.render('admin');
}

// Admin POST
exports.adminPOST = (req, res) => {
    res.send('Changing status to admin...');
}