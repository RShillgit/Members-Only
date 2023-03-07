const mongoose = require("mongoose");
require('dotenv').config();
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 50},
    last_name: {type: String, required: true, maxLength: 50},
    username: {type: String, required: true, maxLength: 50},
    hash: {type: String},
    salt: {type: String},
    membership_status: {type: Boolean, required: true},
    administrator_status: {type: Boolean, required: true},
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
})

module.exports = mongoose.model("User", UserSchema); 
