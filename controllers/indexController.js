const { body, validationResult, check } = require("express-validator");
const genPassword = require('../utils/passwordUtils').genPassword;
const validatePassword = require('../utils/passwordUtils').validatePassword;

const passport = require('passport');

// Password Security
const bcrypt = require('bcrypt');

const users = require('../models/users'); 
const messages = require('../models/messages');
const secret = require('../models/secret');
const admin = require('../models/admin');

// Login GET
exports.loginGET = (req, res) => {
    res.render('login', { title: 'Login'});
}

// Login POST -> Can be deleted
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

                    // If the username DOESN'T exist render login form with error message
                    if (!result) {
                        res.render('login', {
                            err: [{msg: 'An account with this username does not exist'}],
                        })
                    }
                    
                    // If the username DOES exists
                    else {

                        // Compare inputted password to the stored hashed password
                        bcrypt.compare(req.body.password, result.hash, function(err, result) {

                            // If the password matches, log the user in
                            if (result) {

                                // Render logged in home page
                                res.redirect('/home');
                            }

                            // If the password doesnt match rerender form with error message
                            else {
                                res.render('login', {
                                    err: [{msg: 'This username/password combination is incorrect'}],
                                })
                                
                            }
                        });
                    }


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

                        // Hash and salt from util function
                        const saltHash = genPassword(req.body.password);

                        const salt = saltHash.salt;
                        const hash = saltHash.hash;

                        // Create user with salt and hash
                        const newUser = new users({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            username: req.body.username,
                            hash: hash,
                            salt: salt,
                            membership_status: false,
                            administrator_status: false,
                        })
                        newUser.save((err, result) => {
                            if (err) {
                                return next(err);
                            }

                            // Successful, redirect to Login page 
                            return res.redirect('/login'); 
                        })
                    }
                })
        }   
    }
]

// Club GET
exports.clubGET = (req, res) => {

    // If the user is authenticated AND a secret club member
    if (req.isAuthenticated() && req.user.membership_status === true) {
        res.render('authedClub');
    } 
    // If the user is just authenticated
    else if (req.isAuthenticated()) {
        res.render('club');
    }
    else {
        res.redirect('/')
    }
}

// Club POST
exports.clubPOST = [

            // Validate and sanitize password.
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
                    res.render('club', {
                        err: errors,
                    })
                } 
                
                // No errors
                else {
                    
                    // Check database for password
                    secret.findOne({})
                        .exec((err, result) => {
                            if (err) return next(err);

                            // Check if password matches
                            var clubVerify = bcrypt.hashSync(req.body.password, result.salt);

                            // If it does...
                            if (clubVerify === result.hash) {
                                
                                const filter = {_id: req.user._id};
                                const options = {upsert: false};
                                const updateDoc = {$set: {membership_status: true}};

                                users.updateOne(filter, updateDoc, options)
                                    .exec((err, result) => {
                                        if (err) return err;

                                        res.redirect('/club');
                                    })  
                            }
                            // If it doesn't...
                            else res.render('club', {
                                err: [{msg: 'Incorrect secret club password'}]
                            })
                        })
                }
            }
]

// Admin GET
exports.adminGET = (req, res) => {

    // If the user is authenticated AND an admin
    if (req.isAuthenticated() && req.user.administrator_status === true) {
        res.render('authedAdmin');
    } 
    // If the user is just authenticated
    else if (req.isAuthenticated()) {
        res.render('admin');
    }
    else {
        res.redirect('/')
    }
}

// Admin POST
exports.adminPOST = [

        // Validate and sanitize password.
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
                res.render('admin', {
                    err: errors,
                })
            } 
            // No errors
            else {
                
                // Check database for password
                admin.findOne({})
                    .exec((err, result) => {
                        if (err) return next(err);
                        
                        // Check if password matches
                        var adminVerify = bcrypt.hashSync(req.body.password, result.salt);

                        // If it does...
                        if (adminVerify === result.hash) {
                            
                            const filter = {_id: req.user._id};
                            const options = {upsert: false};
                            const updateDoc = {$set: {administrator_status: true}};

                            users.updateOne(filter, updateDoc, options)
                                .exec((err, result) => {
                                    if (err) return err;

                                    res.redirect('/admin');
                                })  
                        }
                        // If it doesn't...
                        else res.render('admin', {
                            err: [{msg: 'Incorrect admin password'}]
                        })

                    })
            }
        }
]

// Guest POST 
exports.guestPOST = (req, res) => {

    // create account with Hash and salt from util function
    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // Create user with salt and hash
    const newUser = new users({
        first_name: 'Guest',
        last_name: 'User',
        username: req.body.pasword,
        hash: hash,
        salt: salt,
        membership_status: false,
        administrator_status: false,
    })
    newUser.save((err, result) => {
        if (err) {
            return next(err);
        }
    }) 

    // TODO SOMEHOW AUTHENTICATE AFTER CREATING USER
}   
    