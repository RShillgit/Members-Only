const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validatePassword = require('../utils/passwordUtils').validatePassword;
const connection = require('../models/users');
const User = connection.models.User;

// const User = require('../models/users');

const verifyCallback = (username, password, done) => {

    User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }

        const isValid = validatePassword(password, user.hash, user.salt);

        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false);
        }

      });

}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});


