const Sobre = require('../../models/sobre');

//GET INFO
exports.getInfo = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            res.render('admin/sobre/dadoscontato', {
                pageTitle: "Admnistrar Informações",
                path: "admin/info",
                robotsFollow: false,
                errorMessage: [],
                sobre: sobre,
                contact: false
            });
        })
        .catch(err => next(err, 500));
};

//POST INFO
exports.postInfo = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {

            sobre.telefone = req.body.telefone;
            sobre.facebook = req.body.facebook;
            sobre.endereco = req.body.endereco;
            sobre.whatsapp = req.body.whatsapp;
            sobre.email = req.body.email;

            return sobre.save();
        })
        .then(() => {
            res.redirect('/admin/info')
        })
        .catch(err => next(err, 500));
};
