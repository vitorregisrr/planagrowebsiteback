const { check, body, validationResult } = require('express-validator/check'),
Propriedade = require('../../models/propiedade'),
Cliente = require('../../models/cliente');

exports.propiedade = [
    [
        body('titulo', 'O título deve ter entre 5 e 40 caracteres.')
        .isLength({
            max: 40,
            min: 5
        }),

        body('genero', 'O gênero é obrigatório')
        .isString()
        .custom((value, { req }) => {
            if (req.body.genero == 'Ambos' || req.body.genero == 'Venda' || req.body.genero == 'Aluguél') {
                return true;
            }
            throw new Error('O tipo escolhido é inválido.')
        })
        .withMessage('Gênero inválido.'),

        body('precoaluguel', 'O campo preço do aluguél é inválido')
        .isNumeric()
        .withMessage('Preço para aluguél inválido, deve ser um número.')
        .toFloat(),

        body('precovenda', 'O campo preço da venda é inválido')
        .isNumeric()
        .withMessage('Preço para venda inválido, deve ser um número.')
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
            Cliente.find()
            .select('codigo nome')
            .then(clientes => {
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
                    clientes,
                    contact: false
                })
            })
            .catch( err => next(err, 500));
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

        body('genero', 'O genero é obrigatório')
        .isString()
        .custom((value, { req }) => {
            if (req.body.genero == 'Ambos' || req.body.genero == 'Venda' || req.body.genero == 'Aluguél') {
                return true;
            }
            throw new Error('O tipo escolhido é inválido.')
        })
        .withMessage('Genêro inválido.'),

        body('precoaluguel', 'O campo preço do aluguél é inválido')
        .isNumeric()
        .withMessage('Preço para aluguél inválido, deve ser um número.')
        .toFloat(),

        body('precovenda', 'O campo preço da venda é inválido')
        .isNumeric()
        .withMessage('Preço para venda inválido, deve ser um número.')
        .toFloat(),

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
                Cliente.find()
                .select('codigo nome')
                .then(clientes => {
                    return res
                    .status(422)
                    .render('admin/propriedade/editarpropriedade', {
                        path: 'admin/propiedades',
                        pageTitle: 'Editar Propiedade',
                        errorMessage: errors.array(),
                        prop: prop,
                        clientes,
                        robotsFollow: false,
                        contact: false
                    })
                })
                .catch( err => next(err, 500))
            })
            .catch( err => next(err));
        } else {
            next();
        }
    }
]