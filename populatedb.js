console.log('This script populates some users and messages.');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const async = require('async');
const users = require('./models/users');
const messages = require('./models/messages');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const usersArray = [];
const messagesArray = [];

function userCreate(first, last, username, password, membership_status, cb) {

    userInfo = {
        first_name: first,
        last_name: last,
        username: username,
        password: password,
        membership_status: membership_status,
    }

    const user = new users(userInfo);

    user.save(function(err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New User: ' + user);
        usersArray.push(user);
        cb(null, user);
    })
}