const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    administrator: { type: Boolean, default: false }
}, {versionKey: false});

const User = mongoose.model('User', userSchema);
module.exports = User;
