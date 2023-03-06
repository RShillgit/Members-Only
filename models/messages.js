const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, maxLength: 50 },
    text: { type: String, required: true },
    timestamp: { type: Date, required: true }
})

// Formats date to MM/DD/YYYY
MessageSchema.methods.formatDate = (timestamp) => {

    // Day
    let day = timestamp.getDate();

    // Month
    let month = timestamp.getMonth() + 1;

    // Year
    let year = timestamp.getFullYear();

    // 2 digit months and days
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = `0${month}`;
    }

    let formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
}

MessageSchema.methods.authorName = (authors, message) => {

    let authorName;

    for (let i = 0; i < authors.length; i ++) {
        if (authors[i]._id.toString() === message.author.toString()) {
            console.log(authors[i])
            authorName = `${authors[i].first_name} ${authors[i].last_name}`;
        }
    }
    //console.log(authors)
    return authorName;
}

// Export model
module.exports = mongoose.model("Message", MessageSchema)