const { check, body, validationResult } = require('express-validator/check'),
    fs = require('fs');

exports.depoimento = [
    [
        body('nome', 'O nome deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
        }),

        body('depoimento', 'O depoimento deve te rentre 30 e 500 caracteres.')
        .isLength({
            min: 30
        }),

        body('image', 'Imagem inválida, por favor escolha uma imagem!')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Formato de imagem inválida, aceitos: png, jpeg e jpg.')
            }

            return true;
        })
        .trim()
    ],

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlink(req.file.path, err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            return res
                .status(422)
                .render('admin/depoimento/novodepoimento', {
                    path: 'admin/depoimentos',
                    pageTitle: 'Novo Depoimento',
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


exports.editDepoimento = [
    body('nome', 'O nome deve ter entre 25 e 5 caracteres.')
    .isLength({
        max: 25,
        min: 5
    }),

    body('depoimento', 'O depoimento deve ter entre 100 e 500 caracteres.')
    .isLength({
        min: 30
    }),

    //Calback Function
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .render('admin/depoimento/editardepoimento', {
                    path: 'admin/depoimentos',
                    pageTitle: 'Editar Depoimento',
                    errorMessage: errors.array(),
                    dep: {
                        ...req.body
                    },
                    robotsFollow: false,
                    contact: false
                })
        } else {
            next();
        }
    }
]