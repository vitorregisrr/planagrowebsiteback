const Sobre = require('../../models/sobre');

exports.get404 = (req, res, next) => {
    Sobre.findOne()
    .then(sobre => {
        res.status(404).render('404', {
            pageTitle: 'Error 404 - Not Found',
            path: '/404',
            robotsFollow: false,
            sobre: sobre,
            contact: false
        });
    })
    .catch(err => next(err));

};

exports.get500 = (error, req, res, next) => {
    Sobre.findOne()
    .then(sobre => {
        res.status(500).render('500', {
            pageTitle: 'Error 500 - Server Error',
            path: '/500',
            error: error,
            sobre: sobre,
            robotsFollow: false,
            contact: false
        });
    })
    .catch(err => next(err));
};