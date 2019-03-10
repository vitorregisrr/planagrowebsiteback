const User = require('../../models/user');

exports.getChangePass = (req, res, next) => {
    res.render('admin/auth/trocarsenha', {
        path: '/trocarsenha',
        pageTitle: 'Resetar senha',
        errorMessage: req.flash('error'),
        form: null,
        robotsFollow: false,
    });
}

exports.postChangePass = (req, res, next) => {
    User.findOne()
    .then( user => {
        if(user.password == req.body.currentpassword){
            
        }
    })
    .catch( err => next(err));
}