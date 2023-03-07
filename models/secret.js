const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SecretSchema = new Schema({
    hash: {type: String, required: true},
})

// Export model
module.exports = mongoose.model("Secret", SecretSchema);