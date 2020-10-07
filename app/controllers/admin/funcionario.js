const Funcionario = require('../../models/funcionario'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

exports.getFuncionarios = (req, res, next) => {
    Funcionario.find()
        .then(funcs => {
            res.render('admin/funcionario/funcionarios', {
                pageTitle: "Gerenciar Funcionarios",
                funcs: funcs,
                path: "admin/funcionarios",
                robotsFollow: false,
                errorMessage: [],
                contact: false
            });
        })
        .catch(err => next(err, 500));
};


//POST NEW FUNCIONARIO
exports.postNewFuncionario = (req, res, next) => {
    const form = {
        nome: req.body.nome,
    }

    fileHelper.compressImage(req.file)
        .then(newPath => {
            cloudinary.uploader.upload(newPath, {
                    folder: 'planagro'
                })
                .then(image => {
                    fileHelper.delete(newPath);
                    new Funcionario({
                            ...form,
                            image: image,
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/funcionarios');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                });
        })
        .catch(err => next(err));
};

//GET NEW FUNCIONARIO
exports.getNewFuncionario = (req, res, next) => {
    res.render('admin/funcionario/novofuncionario', {
        pageTitle: "Novo Funcionário",
        path: "admin/funcionarios",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

//GET EDIT FUNCIONARIO
exports.getEditFuncionario = (req, res, next) => {
    const funcId = req.params.funcId;

    Funcionario.findOne({
            _id: funcId
        })
        .then(func => {
            if (!func) {
                return res.redirect('/admin/funcionarios')
            }
            res.render('admin/funcionario/editarfuncionario', {
                pageTitle: "Editar Funcionario",
                path: "/admin/funcionarios",
                func: func,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT FUNCIONARIO
exports.postEditFuncionario = (req, res, next) => {
    const form = {
        nome: req.body.nome,
        id: req.body.id,
    }

    Funcionario.findOne({
            _id: form.id
        })
        .then(func => {

            if (!func) {
                return next(new Error('Houve um erro e o funcionário não foi encontrado, volte e tente novamente.'));
            }

            func.nome = form.nome;

            if (req.file) {

                if (func.image) {
                    cloudinary.uploader.destroy(func.image.public_id);
                }

                fileHelper.compressImage(req.file, 100)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath, {
                                folder: 'planagro'
                            })
                            .then(image => {

                                fileHelper.delete(newPath);
                                func.image = image;
                                func.save();
                                return res.redirect('/admin/funcionarios');
                            })
                    })
                    .catch(err => next(err));
            } else {

                func.save();
                return res.redirect('/admin/funcionarios');
            }
        })
        .catch(err => next(err));
}

//DELETE FUNCIONARIO
exports.deleteFuncionario = (req, res, next) => {
    const id = req.body.id;

    Funcionario.findOneAndDelete({
            _id: id
        })

        .then(func => {
            cloudinary.uploader.destroy(func.image.public_id)
                .then(func => {
                    res.redirect('/admin/funcionarios')
                })
                .catch(err => next(err))
        })

        .catch(err => {
            next(err, 500)
        });
};