const Propiedade = require('../../models/propiedade'),
    Sobre = require('../../models/sobre'),
    Depoimento = require('../../models/depoimento');


exports.getIndex = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Propiedade.find({
                    destaque: true,
                    ativo: true
                })
                .then(props => {
                    Depoimento.find()
                        .then(deps => {
                            res.render('shop/home', {
                                pageTitle: "Início",
                                path: "/",
                                props: props,
                                sobre: sobre,
                                deps: deps,
                                robotsFollow: true,
                                contact: true,
                                genero: 'Ambos',
                                csrfToken: req.csrfToken()
                            })
                        })
                        .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err))
}