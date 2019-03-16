const Propiedade = require('../../models/propiedade'),
    Cliente = require('../../models/cliente'),
    fileHelper = require('../../util/file-helper'),
    cloudinary = require('../../util/cloudinary');


    
//GET CLIENTE PROFILE
exports.getCliente = (req, res, next) => {
    const clienteCod = req.params.clienteCod;

    Cliente.findOne({
            codigo: clienteCod
        })
        .then(cliente => {
            if (!cliente) {
                return res.redirect('/admin/clientes')
            }
          
            Propiedade.find({ proprietarioId : cliente })
            .then( props => {
                res.render('admin/cliente/perfilcliente', {
                    pageTitle: "Perfil de "+cliente.nome,
                    path: "admin/clientes",
                    cliente: cliente,
                    props: props,
                    robotsFollow: false,
                    contact: false
                })
            })
            .catch( err => next(err, 500));
        })
        .catch(err => next(err, 500));
};

//GET CLIENTE LIST
exports.getClientes = (req, res, next) => {
    const currentPage = req.query.page ? parseInt(req.query.page) : 1,
        ITEMS_PER_PAGE = 8;
    let totalItems;

    const query = {};

    if (req.query.nome && req.query.nome != '') {
        query.nome = {
            $regex: req.query.nome,
            $options: 'i'
        }
    }

    if (req.query.cpf && req.query.cpf != '') {
        query.cpf = {
            $regex: req.query.cpf,
            $options: 'i'
        }
    }

    if (req.query.rg && req.query.rg != '') {
        query.rg = {
            $regex: req.query.rg,
            $options: 'i'
        }
    }

    if (req.query.email && req.query.email != '') {
        query.email = {
            $regex: req.query.email,
            $options: 'i'
        }
    }

    if (req.query.codigo && req.query.codigo != '') {
        query.codigo = req.query.codigo;
    }

    Cliente.find(query)
        .countDocuments()
        .then(num => {
            totalItems = num;
            const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

            Cliente.find(query)
                .skip((currentPage - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .sort({
                    $natural: -1,
                    ativo: -1
                })
                .then(clientes => {
                    res.render('admin/cliente/clientes', {
                        pageTitle: "Gerenciar Clientes",
                        clientes: clientes,
                        path: "admin/clientes",
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


//GET NEW CLIENTE
exports.getNewCliente = (req, res, next) => {
    res.render('admin/cliente/novocliente', {
        pageTitle: "Novo Cliente",
        path: "admin/novocliente",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};


//POST NEW CLIENTE
exports.postNewCliente = (req, res, next) => {
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

                        new Cliente({
                                ...form,
                                mainImage: image
                            })
                            .save()

                            .then(cliente => {
                                res.redirect('/admin/clientes/documentos/' + cliente.codigo);
                            })

                            .catch(err => next(err));
                    })
                    .catch(err => next(JSON.stringify(err)))
            })

    } else {
        new Cliente({
                ...form
            })
            .save()

            .then(cliente => {
                res.redirect('/admin/clientes/documentos/' + cliente.codigo);
            })

            .catch(err => next(err));
    }
};


//GET EDIT CLIENTE
exports.getEditCliente = (req, res, next) => {
    const clienteId = req.params.clienteId;

    Cliente.findOne({
            _id: clienteId
        })
        .then(cliente => {
            if (!cliente) {
                return res.redirect('/admin/clientes')
            }
            res.render('admin/cliente/editarcliente', {
                pageTitle: "Editar Cliente",
                path: "admin/clientes",
                cliente: cliente,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};

//POST EDIT CLIENTE
exports.postEditCliente = (req, res, next) => {
    Cliente.findOne({
            _id: req.body.id
        })
        .then(cliente => {

            if (!cliente) {
                return next(new Error('Houve um erro e o cliente não foi encontrado, volte e tente novamente.'));
            }

            if (req.file) {
                if (cliente.mainImage) {
                    cloudinary.uploader.destroy(cliente.mainImage.public_id)
                }

                fileHelper.compressImage(req.file, 700)
                    .then(newPath => {
                        cloudinary.uploader.upload(newPath, {
                                folder: 'planagro'
                            })
                            .then(image => {
                                fileHelper.delete(newPath);

                                cliente.mainImage = image;
                                cliente.nome = req.body.nome;
                                cliente.endereco = req.body.endereco;
                                cliente.cpf = req.body.cpf;
                                cliente.rg = req.body.rg;
                                cliente.email = req.body.email;
                                cliente.telefone = req.body.telefone;
                                cliente.celular = req.body.celular;
                                cliente.save();
                                return res.redirect('/admin/clientes');

                            })
                            .catch(err => next(err))
                    })
                    .catch(err => next(err));
            } else {

                cliente.nome = req.body.nome;
                cliente.endereco = req.body.endereco;
                cliente.cpf = req.body.cpf;
                cliente.rg = req.body.rg;
                cliente.email = req.body.email;
                cliente.telefone = req.body.telefone;
                cliente.celular = req.body.celular;
                cliente.save();
                return res.redirect('/admin/clientes')
            }
        })
        .catch(err => next(err));
}


//GET CLIENTE DOCUMENTOS
exports.getDocumentos = (req, res, next) => {
    const clienteCod = req.params.clienteCod;

    Cliente.findOne({
            codigo: clienteCod
        })
        .then(cliente => {
            if (!cliente) {
                return res.redirect('/admin/clientes')
            }
            res.render('admin/cliente/documentos', {
                pageTitle: "Editar Documentos",
                path: "admin/clientes",
                cliente: cliente,
                errorMessage: [],
                form: false,
                robotsFollow: false,
                contact: false
            })
        })
        .catch(err => next(err, 500));
};


exports.setNewDocumento = (req, res, next) => {
    const clienteId = req.body.id;
    const docName = req.body.docName;
    
    Cliente.findOne({
            _id: clienteId,
        })
        .then(cliente => {
            if (!cliente) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e o cliente não foi encontrado.",
                });
            }

            cloudinary.uploader.upload(req.file.path, {
                    folder: 'planagro'
                })
                .then(doc => {
                    fileHelper.delete(req.file.path);
                    cliente.documentos.push({ ...doc, titulo: docName });
                    cliente.save()
                        .then(resul => {
                            return res.status(200).json(JSON.stringify({ ...doc, titulo: docName}));
                        })
                        .catch(err => {
                            cloudinary.uploader.destroy(doc.public_id)
                            res.status(500).json({
                                "message": err
                            });
                        });
                })
                .catch( err => {
                    fileHelper.delete(req.file.path);
                    res.status(500).json({
                        "message": err
                    });
                })
        })
        .catch(err => res.status(500).json({
            "message": err
        }))

}

exports.removeDocumento = (req, res, next) => {
    const clienteId = req.body.clienteId;
    const docId = req.body.documentoId;

    Cliente.findOne({
            _id: clienteId,
        })

        .then(cliente => {
            if (!cliente) {
                return res.status(500).json({
                    "message": "Houve um erro no servidor e o cliente não foi encontrado.",
                });
            }

            const oldDocs = cliente.documentos;

            cliente.documentos = oldDocs.filter(doc => doc.public_id != docId);

            cliente.save()
                .then(resul => {
                    cloudinary.uploader.destroy(docId)
                        .then(resul => {
                            return res.status(200).json({
                                success: true
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                'message': "Falha na hora de apagar o documento do servidor."
                            });
                        });
                })
                .catch(err => res.status(500).json({
                    'message': "Falha na hora de salvar as alteracoes" + err
                }))

        })
        .catch(err => res.status(500).json({
            'message': "Falha na hora de buscar no BD" + err
        }))
}


//DELETE CLIENTE
exports.deleteCliente = (req, res, next) => {
    const id = req.body.id;

    Cliente.findOneAndDelete({
            _id: id
        })

        .then(cliente => {
            if (!cliente) {
                res.redirect('/admin/clientes')
            }

            if (cliente.mainImage) {
                cloudinary.uploader.destroy(cliente.mainImage.public_id);
            }

            let destroyPromise = [];
            if (cliente.documentos.length > 0) {
                destroyPromise = cliente.documentos.map(doc => cloudinary.uploader.destroy(doc.public_id))
            }

            Promise.all(destroyPromise);

            res.redirect('/admin/clientes')
        })

        .catch(err => next(err));
};