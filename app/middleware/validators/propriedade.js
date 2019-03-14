const { check, body, validationResult } = require('express-validator/check'),
Propriedade = require('../../models/propiedade');

exports.propiedade = [
    [
        body('titulo', 'O título deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

        body('propietario', 'O campo propietáro é obrigatório.')
        .isLength({
            min: 1
        })
        .isString(),

        body('preco', 'O campo número é inválido')
        .isNumeric()
        .withMessage('Preço inválido, deve ser um número.')
        .toFloat(),

        body('zona', 'A Zona é obrigatória')
        .isString()
        .custom((value, {
            req
        }) => {
            if (req.zona == '') {
                throw new Error('A zona escolhida é inválida.')
            }
            return true;
        }),


        body('tipo', 'O tipo de imóvel/propiedade é obrigatório')
        .isString()
        .custom((value, {
            req
        }) => {
            if (req.tipo == '') {
                throw new Error('O tipo escolhido é inválido..')
            }
            return true;
        }),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/propriedade/novapropriedade', {
                    path: 'admin/propiedades',
                    pageTitle: 'Nova Propiedade',
                    errorMessage: errors.array(),
                    form: {
                        values: req.body,
                        hasError: errors.array().map(i => i.param)
                    },
                    robotsFollow: false,
                    contact: false
                })
        } else {
            next();
        }
    }
]


exports.editPropiedade = [
    [
        body('titulo', 'O título deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

        body('propietario', 'O campo propietáro é obrigatório.')
        .isLength({
            min: 1
        })
        .isString(),

        body('preco', 'O campo número é inválido')
        .withMessage('Preço inválido, deve ser um número.'),

        body('zona', 'A Zona é obrigatória')
        .isString()
        .custom((value, { req }) => {
            if (req.zona == '') {
                throw new Error('A zona escolhida é inválida.')
            }
            return true;
        }),


        body('tipo', 'O tipo de imóvel/propiedade é obrigatório')
        .isString()
        .custom((value, {
            req
        }) => {
            if (req.tipo == '') {
                throw new Error('O tipo escolhido é inválido.')
            }
            return true;
        }),
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {

            Propriedade.findOne({
                _id: req.body.id
            })
            .then( prop => {
                return res
                .status(422)
                .render('admin/propriedade/editarpropriedade', {
                    path: 'admin/propiedades',
                    pageTitle: 'Editar Propiedade',
                    errorMessage: errors.array(),
                    prop: prop,
                    robotsFollow: false,
                    contact: false
                })
            })
            .catch( err => next(err));
        } else {
            next();
        }
    }
]