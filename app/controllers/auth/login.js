const User = require('../../models/user');
transporter = require('../../util/email-transporter')();

exports.getLogin = (req, res, next) => {
    if (!req.user) {
        return res.render('admin/auth/login', {
            pageTitle: 'Login',
            path: '/login',
            form: null,
            errorMessage: req.errors,
            robotsFollow: false,
        })
    }
    return res.redirect('/');
}

exports.postLogin = (req, res, next) => {
    const form = {
        ...req.body
    };

    User.findOne({
            usuario: form.usuario
        })
        .then(user => {
            if (!user) {
                return res
                    .status(422)
                    .render('admin/auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: ["Usuário não encontrado!"],
                        form: {
                            values: {
                                email: '',
                                password: ''
                            },
                            hasError: ['email']
                        },
                        robotsFollow: false,
                    })
            }

            if (user.password == form.password) {
                req.session.user = user;
                return req.session.save(err => {
                    if (err) {
                        next(err);
                    }
                    return res.redirect('/admin');
                });
            }else{
                return res
                    .status(422)
                    .render('admin/auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: ["Senha inválida!"],
                        form: {
                            values: {
                                usuario: form.usuario
                            },
                            hasError: ['password']
                        },
                        robotsFollow: false,
                    })
            }
            
        })
        .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}