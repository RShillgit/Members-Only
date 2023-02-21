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
exports.signupPOST = (req, res) => {
    res.redirect('/');

    // Create new user with these credentials

    // Log them in just like loginPOST
}