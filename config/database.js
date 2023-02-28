const mongoose = require('mongoose');
const UserModel = require('../models/users');

require('dotenv').config();

const mongoDBURL = process.env.db_url;
const mongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
} 

const connection = mongoose.createConnection(mongoDBURL, mongoDBOptions); 

const User = connection.model('User', UserModel);

// Expose the connection
module.exports = connection;