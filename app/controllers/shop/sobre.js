const Sobre = require('../../models/sobre'),
    Funcionario = require('../../models/funcionario'),
    Depoimento = require('../../models/depoimento');
const Banner = require('../../models/banner');

exports.getSobre = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Depoimento.find()
                .then(deps => {
                    Funcionario.find()
                        .then(funcs => {
                            Banner.find({referente: 'sobre-banner'}).then(banner => {

                                res.render('shop/sobre', {
                                    pageTitle: "Sobre a Empresa",
                                    path: "/sobre",
                                    sobre: sobre,
                                    deps: deps,
                                    funcs: funcs,
                                    banner: banner,
                                    robotsFollow: true,
                                    contact: true
                                });

                            }).catch(err => next(err));
                        })
                        .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
}