const Propiedade = require('../../models/propiedade'),
    Sobre = require('../../models/sobre'),
    getQueryFilter = require('../../util/query-filter');
const Banner = require('../../models/banner');

exports.getComprar = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 24;
    let totalItems;

    const query = getQueryFilter(req);
    const sort = {
        vendido: 1,
        date: -1
    }

    console.log(query);
    console.log('---------------------------');
    console.log(req.body);
    console.log('---------------------------');
    console.log(req.query);

    if (req.body.genero || req.query.genero) {
        if (!query.$and) {
            query.$and = [];
        }
        query.$and.push({ $or: [{ "genero": req.query.genero || req.body.genero }, { "genero": "Ambos" }] })
    }

    //configurando o ordenador conforme aluguel
    //  1: CRESCENTE -1:DESCRESCENTE

    if (req.body.genero == 'Aluguel', req.query.genero == 'Aluguel') {
        if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precoaluguel = 1; }
        if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precoaluguel = -1; }
        if (req.body.ordenador == 'dc' || req.query.ordenador == 'dc') { sort.dormitorios = -1; }
        if (req.body.ordenador == 'dd' || req.query.ordenador == 'dd') { sort.dormitorios = 1; }
        if (req.body.ordenador == 'sc' || req.query.ordenador == 'sc') { sort.suites = -1; }
        if (req.body.ordenador == 'sd' || req.query.ordenador == 'sd') { sort.suites = 1; }
        if (req.body.ordenador == 'bc' || req.query.ordenador == 'bc') { sort.banheiros == -1; }
        if (req.body.ordenador == 'bd' || req.query.ordenador == 'bd') { sort.banheiros == 1; }
    }

    if (req.body.genero == 'Venda', req.query.genero == 'Venda') {
        if (req.body.ordenador == 'pc' || req.query.ordenador == 'pc') { sort.precovenda = 1; }
        if (req.body.ordenador == 'pd' || req.query.ordenador == 'pd') { sort.precovenda = -1; }
        if (req.body.ordenador == 'dc' || req.query.ordenador == 'dc') { sort.dormitorios = -1; }
        if (req.body.ordenador == 'dd' || req.query.ordenador == 'dd') { sort.dormitorios = 1; }
        if (req.body.ordenador == 'sc' || req.query.ordenador == 'sc') { sort.suites = -1; }
        if (req.body.ordenador == 'sd' || req.query.ordenador == 'sd') { sort.suites = 1; }
        if (req.body.ordenador == 'bc' || req.query.ordenador == 'bc') { sort.banheiros == -1; }
        if (req.body.ordenador == 'bd' || req.query.ordenador == 'bd') { sort.banheiros == 1; }
    }

    if (sort.precovenda || sort.precoaluguel || sort.dormitorios || sort.suites || sort.banheiros) {
        delete sort.date;
    }

    Propiedade.find({ ...query, ativo: true })
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Propiedade.find({ ...query, ativo: true })
                .sort(sort)
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(props => {


                    if (!req.query || !req.body) {
                        props = props.sort((x, y) => {
                            return (x.destaque === y.destaque) ? 0 : x ? -1 : 1
                        })
                    }

                    Sobre.findOne()
                        .then(sobre => {
                            Banner.find({ referente: 'compra-banner' }).then(banner => {
                                Banner.find({ referente: 'entre-imoveis' }).then(bannerimoveis => {
                                    if (req.query == {} || req.body == {}) {
                                        let prop = props.sort()
                                    }
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
                                        banner: banner,
                                        bannerimoveis: bannerimoveis,
                                        contact: true,
                                        form: req.query,
                                        genero: req.body.genero || req.query.genero
                                    });
                                })
                                    .catch(err => next(err, 500));
                            })
                                .catch(err => next(err, 500));
                        })
                        .catch(err => next(err, 500));
                })
                .catch(err => next(err, 500));
        });
}

exports.getPropiedade = (req, res, next) => {
    const propCod = req.params.propCod;
    Propiedade.findOne({
        codigo: propCod
    })
        .then(prop => {
            if (!prop) {
                return res.redirect('/comprar');
            }

            if ((!prop.ativo || prop.vendido) && !req.session.user) {
                return res.redirect('/comprar');
            }

            Sobre.findOne()
                .then(sobre => {
                    return res.render('shop/propriedade', {
                        pageTitle: prop.youtube_id,
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