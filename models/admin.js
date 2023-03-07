const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    hash: {type: String, required: true},
    salt : {type: String, required: true}
})

// Export model
module.exports = mongoose.model("Admin", AdminSchema);