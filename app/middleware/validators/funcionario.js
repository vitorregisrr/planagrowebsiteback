const { check, body, validationResult } = require('express-validator/check'),
fs = require('fs');

exports.funcionario = [
    [
        body('nome', 'O nome deve te rentre 5 e 25 caracteres.')
        .isLength({
            max: 25,
            min: 5
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
                .render('admin/funcionario/novofuncionario', {
                    path: 'admin/funcionarios',
                    pageTitle: 'Novo Funcionário',
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
