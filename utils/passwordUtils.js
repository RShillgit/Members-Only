const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generates hash and salt based on user's password
function genPassword(password) {

    // CRYPTO SALT AND HASH

    //var salt = crypto.randomBytes(32).toString('hex');
    //var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    var salt = bcrypt.genSaltSync(10);
    var genHash = bcrypt.hashSync(password, salt);

    return {
        salt: salt,
        hash: genHash
    };
}

// Checks for valid password
function validatePassword(password, hash, salt) {

    // CRYPTO
    //var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    var hashVerify = bcrypt.hashSync(password, salt);

    if (hashVerify === hash) return true;
    else return false;
}

module.exports.validatePassword = validatePassword;
module.exports.genPassword = genPassword;