const Propiedade = require('../../models/propiedade'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');

//PROPIEDADES
exports.getPropiedades = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    if (req.query.propietario && req.query.propietario != '') {
        query.propietario = {
            $regex: req.query.propietario,
            $options: 'i'
        }
    }

    if (req.query.titulo && req.query.titulo != '') {
        query.titulo = {
            $regex: req.query.titulo,
            $options: 'i'
        }
    }

    if (req.query.codigo && req.query.codigo != '') {
        query.codigo = req.query.codigo;
    }

    if (req.query.destaque && req.query.destaque != '') {
        query.destaque = req.query.destaque;
    }

    if (req.query.ativo && req.query.ativo != '') {
        query.ativo = req.query.ativo;
    }


    Propiedade.find(query)
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Propiedade.find(query)
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .sort({
                    $natural: -1,
                    ativo: -1
                })
                .then(props => {
                    res.render('admin/propriedade/propriedades', {
                        pageTitle: "Gerenciar Propriedades",
                        props: props,
                        path: "admin/propiedades",
                        hasNext: currentPage < totalPages,
                        hasPrevious: currentPage > 1,
                        totalPages,
                        currentPage,
                        robotsFollow: false,
                        contact: false,
                        form: req.query
                    });
                })
                .catch(err => next(err, 500));
        })
        .catch(err => next(err, 500));
};


//GET NEW PROPIEDADE
exports.getNewPropiedade = (req, res, next) => {
    res.render('admin/propriedade/novapropriedade', {
        pageTitle: "Nova Propiedade",
        path: "admin/novapropiedade",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

//POST NEW PROPIEDADE
exports.postNewPropiedade = (req, res, next) => {
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';
    req.body.destaque = req.body.destaque == 'on' ? 'true' : 'false';

    req.body.piscina = req.body.piscina == 'on' ? 'true' : 'false';
    req.body.patio = req.body.patio == 'on' ? 'true' : 'false';
    req.body.mobiliado = req.body.mobiliado == 'on' ? 'true' : 'false';

    req.body.vantagens = req.body.vantagens ? JSON.parse(req.body.vantagens) : [];

    const form = {
        ...req.body
    }

    if (req.file) {
        fileHelper.compressImage(req.file, 700)
            .then(newPath => {
                cloudinary.uploader.upload(newPath, {
                        folder: 'planagro'
                    })
                    .then(image => {
                        fileHelper.delete(newPath);

                        new Propiedade({
                                ...form,
                                mainImage: image
                            })
                            .save()

                            .then(resul => {
                                res.redirect('/admin/propiedades');
                            })

                            .catch(err => next(err));
                    })
                    .catch(err => next(JSON.stringify(err)))
            })

    } else {
        new Propiedade({
                ...form
            })
            .save()

            .then(resul => {
                res.redirect('/admin/propiedades');
            })

            .catch(err => next(err));
    }
};

exports.setPropiedadeImage = (req, res, next) => {
    const propId = req.body.id;

    Propiedade.findOne({
            _id: propId,
        })
        .then(prop => {
            if (!prop) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e a propiedade não foi encontrada.",
                });
            }

            fileHelper.compressImage(req.file, 700)
                .then(newPath => {

                    cloudinary.uploader.upload(newPath, {
                            folder: 'planagro'
                        })

                        .then(image => {
                            fileHelper.delete(newPath);
                            prop.images.push(image);
                            prop.save()
                                .then(resul => {
                                    return res.status(200).json(JSON.stringify(image));
                                })
                                .catch(err => {
                                    cloudinary.uploader.destroy(image.public_id)
                                    res.status(500).json({
                                        "message": err
                                    });
                                });
                        })
                        .catch(err => res.status(500).json({
                            "message": err
                        }))

                })
                .catch(err => res.status(500).json({
                    "message": err
                }))

        })
        .catch(err => res.status(500).json({
            "message": err
        }))
}

exports.removePropiedadeImage = (req, res, next) => {
    const propId = req.body.propId;
    const imageId = req.body.imageId;

    Propiedade.findOne({
            _id: propId,
        })

        .then(prop => {
            if (!prop) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e a propiedade não foi encontrada.",
                });
            }

            const oldImages = prop.images;

            prop.images = oldImages.filter(image => image.public_id != imageId);

            prop.save()
                .then(resul => {
                    cloudinary.uploader.destroy(imageId)
                        .then(resul => {
                            return res.status(200).json({
                                success: true
                            });
                        })
                        .catch(err => {
                            cloudinary.uploader.destroy(image.public_id)
                            res.status(500).json({
                                'message': "Falha na hora de salvar a propiedade"
                            });
                        });
                })
                .catch(err => res.status(500).json({
                    'message': "Falha na hora de apagar a imagem" + err
                }))

        })
        .catch(err => res.status(500).json({
            'message': "Falha na hora de buscar no BD" + err
        }))
}

//GET EDIT PROPIEDADE
exports.getEditPropiedade = (req, res, next) => {
    const propId = req.params.propId;

    Propiedade.findOne({
            _id: propId
        })
        .then(prop => {
            if (!prop) {
                return res.redirect('/admin/propiedades')
            }
            res.render('admin/propriedade/editarpropriedade', {
                pageTitle: "Editar Propiedade",
                path: "admin/propiedades",
                prop: prop,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT PROPIEDADE
exports.postEditPropiedade = (req, res, next) => {
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';
    req.body.destaque = req.body.destaque == 'on' ? 'true' : 'false';

    req.body.piscina = req.body.piscina == 'on' ? 'true' : 'false';
    req.body.patio = req.body.patio == 'on' ? 'true' : 'false';
    req.body.mobiliado = req.body.mobiliado == 'on' ? 'true' : 'false';

    Propiedade.findOne({
            _id: req.body.id
        })
        .then(prop => {

            if (!prop) {
                return next(new Error('Houve um erro e a sua propiedade não foi encontrada, volte e tente novamente.'));
            }

            if (req.file) {
                if (prop.mainImage) {
                    cloudinary.uploader.destroy(prop.mainImage.public_id)
                }

                fileHelper.compressImage(req.file, 700)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath, {
                                folder: 'planagro'
                            })
                            .then(image => {
                                fileHelper.delete(newPath);

                                prop.mainImage = image;
                                prop.ativo = req.body.ativo;
                                prop.destaque = req.body.destaque;
                                prop.titulo = req.body.titulo;
                                prop.propietario = req.body.propietario;
                                prop.descricao = req.body.descricao;
                                prop.zona = req.body.zona;
                                prop.preco = req.body.preco;
                                prop.tipo = req.body.tipo;
                                prop.extensao = req.body.extensao;
                                prop.area = req.body.area;
                                prop.cep = req.body.cep;
                                prop.bairro = req.body.bairro;
                                prop.rua = req.body.rua;
                                prop.numero = req.body.numero;
                                prop.vantagens = JSON.parse(req.body.vantagens);

                                //detalhes urbano
                                prop.dormitorios = req.body.dormitorios;
                                prop.suites = req.body.suites;
                                prop.cozihas = req.body.cozihas;
                                prop.banheiros = req.body.banheiros;
                                prop.piscina = req.body.piscina;
                                prop.imobiliado = req.body.imobiliado;
                                prop.patio = req.body.patio;

                                //detalhes rural
                                prop.mangueiras = req.body.mangueiras;
                                prop.galpoes = req.body.galpoes;
                                prop.sedes = req.body.sedes;
                                prop.barragens = req.body.barragens;
                                prop.acudes = req.body.acudes;

                                prop.save();
                                return res.redirect('/admin/propiedades');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                prop.ativo = req.body.ativo;
                prop.destaque = req.body.destaque;
                prop.titulo = req.body.titulo;
                prop.propietario = req.body.propietario;
                prop.descricao = req.body.descricao;
                prop.zona = req.body.zona;
                prop.preco = req.body.preco;
                prop.tipo = req.body.tipo;
                prop.extensao = req.body.extensao;
                prop.area = req.body.area;
                prop.cep = req.body.cep;
                prop.bairro = req.body.bairro;
                prop.rua = req.body.rua;
                prop.numero = req.body.numero;
                prop.vantagens = JSON.parse(req.body.vantagens);

                //detalhes urbano
                prop.dormitorios = req.body.dormitorios;
                prop.suites = req.body.suites;
                prop.cozihas = req.body.cozihas;
                prop.banheiros = req.body.banheiros;
                prop.piscina = req.body.piscina;
                prop.imobiliado = req.body.imobiliado;
                prop.patio = req.body.patio;

                //detalhes rural
                prop.mangueiras = req.body.mangueiras;
                prop.galpoes = req.body.galpoes;
                prop.sedes = req.body.sedes;
                prop.barragens = req.body.barragens;
                prop.acudes = req.body.acudes;
                prop.save();
                return res.redirect('/admin/propiedades')
            }
        })
        .catch(err => next(err));
}

//DELETE PROPIEDADE
exports.deletePropiedade = (req, res, next) => {
    const id = req.body.id;

    Propiedade.findOneAndDelete({
            _id: id
        })

        .then(prop => {
            if (!prop) {
                res.redirect('/admin/propiedades')
            }

            if (prop.mainImage) {
                cloudinary.uploader.destroy(prop.mainImage.public_id);
            }

            let destroyPromise = [];
            if (prop.images.length > 0) {
                destroyPromise = prop.images.map(img => cloudinary.uploader.destroy(img.public_id))
            }

            Promise.all(destroyPromise);

            res.redirect('/admin/propiedades')
        })

        .catch(err => next(err));
};