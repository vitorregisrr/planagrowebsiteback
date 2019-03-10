const Depoimento = require('../../models/depoimento'),
cloudinary = require('../../util/cloudinary');

//DEPOIMENTO
exports.getDepoimentos = (req, res, next) => {
    Depoimento.find()
        .then(deps => {
            res.render('admin/depoimento/depoimentos', {
                pageTitle: "Gerenciar Depoimentos",
                deps: deps,
                path: "admin/depoimentos",
                robotsFollow: false,
                errorMessage: [],
                contact: false
            });
        })
        .catch(err => next(err, 500));
};

//POST NEW DEPOIMENTO
exports.postNewDepoimento = (req, res, next) => {
    const form = {
        nome: req.body.nome,
        depoimento: req.body.depoimento,
    }

    fileHelper.compressImage(req.file)
        .then(newPath => {
            cloudinary.uploader.upload(newPath, {
                    folder: 'planagro'
                })
                .then(image => {
                    fileHelper.delete(newPath);
                    new Depoimento({
                            ...form,
                            image: image,
                        })
                        .save()
                        .then(resul => {
                            res.redirect('/admin/depoimentos');
                        })
                        .catch(err => {
                            fileHelper.delete(req.file.path);
                            next(err);
                        });
                })
                .catch(err => next(JSON.stringify(err)))
        })
        .catch(err => next(err));
};

//GET NEW DEPOIMENTO
exports.getNewDepoimento = (req, res, next) => {
    res.render('admin/depoimento/novodepoimento', {
        pageTitle: "Novo Depoimento",
        path: "admin/depoimentos",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

//GET EDIT DEPOIMENTO
exports.getEditDepoimento = (req, res, next) => {
    const depId = req.params.depId;

    Depoimento.findOne({
            _id: depId
        })
        .then(dep => {
            if (!dep) {
                return res.redirect('/admin/depoimentos')
            }
            res.render('admin/depoimento/editardepoimento', {
                pageTitle: "Editar Depoimento",
                path: "/admin/depoimentos",
                dep: dep,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT DEPOIMENTO
exports.postEditDepoimento = (req, res, next) => {
    const form = {
        nome: req.body.nome,
        depoimento: req.body.depoimento,
        id: req.body._id,
    }

    Depoimento.findOne({
            _id: form.id
        })
        .then(dep => {

            if (!dep) {
                return next(new Error('Houve um erro e o seu depoimento não foi encontrado, volte e tente novamente.'));
            }

            dep.nome = form.nome;
            dep.depoimento = form.depoimento;

            if (req.file) {

                if (dep.image) {
                    cloudinary.uploader.destroy(dep.image.public_id)
                }

                fileHelper.compressImage(req.file, 100)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath, {
                                folder: 'planagro'
                            })
                            .then(image => {
                                fileHelper.delete(newPath);
                                dep.image = image;
                                dep.save();
                                return res.redirect('/admin/depoimentos');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                dep.save();
                return res.redirect('/admin/depoimentos');
            }
        })
        .catch(err => next(err));
}

//DELETE DEPOIMENTO
exports.deleteDepoimento = (req, res, next) => {
    const id = req.body._id;

    Depoimento.findOneAndDelete({
            _id: id
        })
        .then(dep => {
            cloudinary.uploader.destroy(dep.image.public_id)
                .then(resul => {
                    res.redirect('/admin/depoimentos')
                })
                .catch(err => next(err))
        })
        .catch(err => {
            next(err, 500)
        });
};
