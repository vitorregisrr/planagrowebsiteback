const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Depoimento = new Schema({
    nome: {
        type: String,
        required: true
    },
    depoimento: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('Depoimento', Depoimento);