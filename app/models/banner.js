const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoURI = require('../util/mongo_URI');
const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true
});

const Banner = new Schema({
    referente: {
        type: String
    },
    titulo: {
        type: String,
    },
    descricao: {
        type: String,
    },
    image: {
        type: Object
    },
    fixed: {
        type: Boolean,
        required: true,
        default: false
    },
    textobotao: {
        type: String,
    },
    linkbotao: {
        type: String
    },
    genero: {
        type: String
    },
    ativo: {
        type: Boolean
    }
});

module.exports = mongoose.model('Banner', Banner);