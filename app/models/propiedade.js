const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseAutoIncrement = require('mongoose-auto-increment');
const mongoURI = require('../util/mongo_URI');
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

const Propiedade = new Schema({

    titulo: {
        type: String,
        required: true,
    },

    propietario: {
        type: String,
        required: true,
    },

    descricao: {
        type: String,
        required: true,
    },

    // rural/urbana
    zona: {
        type: String,
        required: true,
    },

    tipo: {
        type: String,
        required: true,
    },

    preco: {
        type: Number,
        required: true,
    },

    ativo: {
        type: Boolean,
        required: true,
    },

    destaque: {
        type: Boolean,
        required: true,
    },

    mainImage: {
        type: Object,
    },

    images: {
        type: Array,
        required: false
    },

    vantagens: {
        type: Array
    },

    cidade: {
        type: String,
        required: false,
    },

    municipio: {
        type: String,
        required: false,
    },

    //Zona Rural
    extensao: {
        type: Number,
        required: false,
    },

    localidade: {
        type: String,
        required: false,
    },

    acudes: {
        type: Number,
        required: false,
    },

    barragens: {
        type: Number,
        required: false,
    },

    mangueiras: {
        type: Number,
        required: false,
    },

    galpoes: {
        type: Number,
        required: false,
    },

    sedes: {
        type: Number,
        required: false,
    },

    //Zona Urbana
    area: {
        type: Number,
        required: false,
    },

    cep: {
        type: String,
        required: false,
    },

    bairro: {
        type: String,
        required: false,
    },

    rua: {
        type: String,
        required: false,
    },

    numero: {
        type: String,
        required: false,
    },

    cidade: {
        type: String,
        required: false,
    },


    dormitorios: {
        type: Number,
        required: false,
    },

    banheiros: {
        type: Number,
        required: false,
    },

    suites: {
        type: Number,
        required: false,
    },

    cozinhas: {
        type: Number,
        required: false,
    },

    patio: {
        type: Boolean,
        required: false,
    },

    piscina: {
        type: Boolean,
        required: false,
    },

    mobiliado: {
        type: Boolean,
        required: false,
    },

    codigo: {
        type: Number
    }
});

mongooseAutoIncrement.initialize(connection, {
    useNewUrlParser: true
});

Propiedade.plugin(mongooseAutoIncrement.plugin, {
    model: 'Propiedade',
    field: 'codigo',
    startAt: 100,
    incrementBy: 4
});

module.exports = mongoose.model('Propiedade', Propiedade);