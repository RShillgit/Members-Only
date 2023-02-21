const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, maxLength: 50 },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true }
})

// Export model
module.exports = mongoose.model("Message", MessageSchema)