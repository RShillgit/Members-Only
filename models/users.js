const mongoose = require("mongoose");
require('dotenv').config();
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 50},
    last_name: {type: String, required: true, maxLength: 50},
    username: {type: String, required: true, maxLength: 50},
    password: {type: String},
    hash: {type: String},
    salt: {type: String},
    membership_status: {type: Boolean, required: true},
    messages: [{ type: Schema.Types.ObjectId, ref: "Messages" }]
})

const mongoDBURL = process.env.db_url;
const mongoDBOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
} 

const connection = mongoose.createConnection(mongoDBURL, mongoDBOptions); 

const User = connection.model('User', UserSchema);

// Expose connection
module.exports = connection;
