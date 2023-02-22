const { body, validationResult, check } = require("express-validator");

// Password Security
const bcrypt = require('bcrypt');

const users = require('../models/users');
const messages = require('../models/messages');

const async = require('async');