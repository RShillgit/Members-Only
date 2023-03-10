var createError = require('http-errors');
var express = require('express');
const mongoose = require("mongoose");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
require('dotenv').config()

var indexRouter = require('./routes/index');
const messageRouter = require('./routes/message');

var app = express();
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// Set up mongoose connection
mongoose.set('strictQuery', false); 
const mongoDBURL = process.env.db_url;

const mongoDBOptions = { 
  useNewUrlParser: true,
  useUnifiedTopology: true
} 
const connection = mongoose.createConnection(mongoDBURL, mongoDBOptions); 

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDBURL);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * ----------------- SESSION -----------------
 */
const MongoStore = require('connect-mongo'); 
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

const sessionStore = MongoStore.create({ 
  mongoUrl: mongoDBURL,
  mongoOptions: mongoDBOptions,
  client: connection, // TODO - Might not be necessary
  collectionName: 'sessions' // TODO - Might not be necessary
})

app.use(session({ 
  // Set session ID to unique id
  genid: function (req) {
    return uuidv4();
    },
    secret: process.env.secretString,
    resave: false,
    saveUninitialized: true,
    store: sessionStore, 
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 Day
})); 

/**
 * ----------------- PASSPORT AUTHENTICATION -----------------
 */
const passport = require('passport'); 
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());
/**
 * -----------------------------------------------------------
 */

app.use('/', indexRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
