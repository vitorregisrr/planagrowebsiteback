const Sobre = require('../../models/sobre');

exports.getDocumentos = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            res.render('shop/documentos', {
                pageTitle: "Documentos Necessários",
                path: "/documentos",
                robotsFollow: true,
                contact: true,
                sobre
            });
        })
        .catch(err => next(err))
}