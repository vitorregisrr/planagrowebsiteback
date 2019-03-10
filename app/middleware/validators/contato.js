const { check, body, validationResult } = require('express-validator/check'),
    Sobre = require('../../models/sobre'),
    Propiedade = require('../../models/propiedade'),
    fs = require('fs');

exports.contato = [
    [
        body('nome', 'O nome deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('email', 'E-mail inválido')
        .isEmail()
        .normalizeEmail(),

        body('assunto', 'O assunto deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('mensagem', 'A mensagem deve ter no mínimo 5 caracteres.')
        .isLength({
            min: 5
        }),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                fs.unlink(req.files.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            Sobre.findOne()
                .then(sobre => {
                    return res
                        .status(422)
                        .render('shop/contato', {
                            path: '/contato',
                            pageTitle: 'Contato',
                            errorMessage: errors.array(),
                            form: {
                                values: req.body,
                                hasError: errors.array().map(i => i.param)
                            },
                            robotsFollow: true,
                            contact: true,
                            csrfToken: req.csrfToken(),
                            sobre: sobre,
                            successMessage: false
                        })
                })
                .catch(err => next(err));
        } else {
            next();
        }
    }
]

exports.interesse = [
    [
        body('nome', 'O nome deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('email', 'E-mail inválido')
        .isEmail()
        .normalizeEmail(),

        body('telefone', 'Telefone inválido.')
        .isString()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                fs.unlink(req.files.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            Sobre.findOne()
                .then(sobre => {
                    Propiedade.findOne({
                            codigo: req.body.codigo
                        })
                        .then(prop => {
                            return res
                                .status(422)
                                .render('shop/propriedade', {
                                    path: '/propiedade',
                                    pageTitle: prop.titulo,
                                    errorMessage: errors.array(),
                                    form: {
                                        values: req.body,
                                        hasError: errors.array().map(i => i.param)
                                    },
                                    robotsFollow: true,
                                    contact: true,
                                    csrfToken: req.csrfToken(),
                                    sobre: sobre,
                                    successMessage: false,
                                    prop: prop,
                                    mapURI: `Rua ${prop.rua}, numero ${prop.numero}. Bairro${prop.bairro}. CEP: ${prop.cep}`,
                                })
                        })
                        .catch(err => next(err));
                })
                .catch(err => next(err));

        } else {
            next();
        }
    }
]

exports.vender = [
    [
        body('nome', 'O nome deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('email', 'E-mail inválido')
        .isEmail()
        .normalizeEmail(),

        body('mensagem', 'A mensagem deve ter no mínimo 5 caracteres.')
        .isLength({
            min: 5
        }),

        body('titulo', 'O titulo deve ter no mínimo 5 caracteres.')
        .isLength({
            min: 5
        }),

        body('zona', 'Escolha uma zona!')
        .isLength({
            min: 5
        }),


        body('tipo', 'Escolha um tipo!')
        .isLength({
            min: 5
        }),

        body('endereco', 'O endereço deve ter no mínimo 5 caracteres.')
        .isLength({
            min: 5
        }),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.files) {
                fs.unlink(req.files.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }

            Sobre.findOne()
                .then(sobre => {
                    return res
                        .status(422)
                        .render('shop/vender', {
                            path: '/vender',
                            pageTitle: 'Vender',
                            errorMessage: errors.array(),
                            form: {
                                values: req.body,
                                hasError: errors.array().map(i => i.param)
                            },
                            robotsFollow: true,
                            contact: true,
                            csrfToken: req.csrfToken(),
                            sobre: sobre,
                            successMessage: false
                        })
                })
                .catch(err => next(err));
        } else {
            next();
        }
    }
]