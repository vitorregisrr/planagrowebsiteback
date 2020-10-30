const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: {
        type: String,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ativo: {
        type: Boolean
    },
    admin: {
        type: Boolean
    },
    resetToken: String,
    resetTokenExpiration: Date
});

module.exports = mongoose.model('User', User);