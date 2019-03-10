const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Funcionario = new Schema({
    nome: {
        type: String,
        required: true
    },
    image: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model('Funcionario', Funcionario);