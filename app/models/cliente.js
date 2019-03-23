const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAutoIncrement = require('mongoose-auto-increment');
const mongoURI = require('../util/mongo_URI');
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

const Cliente = new Schema({
    nome: {
        type: String,
        required: false
    },

    mainImage: {
        type: Object,
        required: false
    },

    email: {
        type: String,
        required: false
    },

    endereco: {
        type: String,
        required: false
    },

    cpf: {
        type: String,
        required: false
    },

    rg: {
        type: String,
        required: false
    },

    estadocivil: {
        type: String,
        required: false
    },

    email: {
        type: String,
        required: false
    },

    telefone: {
        type: String,
        required: false
    },

    celular: {
        type: String,
        required: false
    },

    documentos: {
        type: Array,
        required: false
    },

    codigo: {
        type: Number
    }

});

mongooseAutoIncrement.initialize(connection, {
    useNewUrlParser: true
});

Cliente.plugin(mongooseAutoIncrement.plugin, {
    model: 'Cliente',
    field: 'codigo',
    startAt: 100,
    incrementBy: 2
});


module.exports = mongoose.model('Cliente', Cliente);