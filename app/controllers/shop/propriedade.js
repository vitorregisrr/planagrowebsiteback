const Propiedade = require('../../models/propiedade'),
    Sobre = require('../../models/sobre'),
    getQueryFilter = require('../../util/query-filter');


exports.getComprar = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = getQueryFilter(req);

    Propiedade.find({ ...query, ativo: true})
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Propiedade.find({ ...query, ativo: true})
                .sort({$natural:-1, ativo: -1})
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(props => {
                    Sobre.findOne()
                        .then(sobre => {
                            res.render('shop/comprar', {
                                pageTitle: "Comprar, alugar ou arrendar propiedades rurais ou urbanas",
                                props: props,
                                path: "/comprar",
                                hasNext: currentPage < totalPages,
                                hasPrevious: currentPage > 1,
                                totalPages,
                                currentPage,
                                robotsFollow: true,
                                sobre: sobre,
                                contact: true,
                                form: req.query
                            });
                        })
                        .catch(err => next(err, 500));
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
}

exports.getPropiedade = (req, res, next) => {
    const propCod = req.params.propCod;
    Propiedade.findOne({
            codigo: propCod
        })
        .then(prop => {
            if( !prop ){
                res.redirect('/comprar')
            }
            Sobre.findOne()
                .then(sobre => {
                    return res.render('shop/propriedade', {
                            pageTitle: prop.titulo,
                            prop: prop,
                            mapURI: `Rua ${prop.rua}, numero ${prop.numero}. Bairro${prop.bairro}. CEP: ${prop.cep}`,
                            path: "/propiedade",
                            robotsFollow: true,
                            sobre: sobre,
                            contact: true,
                            errorMessage: [],
                            form: false,
                            successMessage: false,
                            csrfToken: req.csrfToken(),
                        })
                })
                .catch(err => next(err, 500))
        })
        .catch(err => next(err, 505));
}