const Sobre = require('../../models/sobre');
const Banner = require('../../models/banner');

exports.getDocumentos = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Banner.find({ referente: 'documentos-banner' }).then(banner => {
                res.render('shop/documentos', {
                    pageTitle: "Documentos Necessários",
                    path: "/documentos",
                    robotsFollow: true,
                    contact: true,
                    sobre: sobre,
                    banner: banner
                });
            }).catch(err => next(er));

        })
        .catch(err => next(err))
}