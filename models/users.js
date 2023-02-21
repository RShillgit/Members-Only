const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 50},
    last_name: {type: String, required: true, maxLength: 50},
    username: {type: String, required: true, maxLength: 50},
    password: {type: String, required: true},
    membership_status: {type: Boolean, required: true},
    messages: [{ type: Schema.Types.ObjectId, ref: "Messages" }]
})

// Export model
module.exports = mongoose.model("User", UserSchema);
