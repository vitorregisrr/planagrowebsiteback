const User = require('../../models/user');

exports.postNewUser = async (req, res, next) => {
    const { email, usuario, password } = req.body;
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';
    req.body.admin = req.body.admin == 'on' ? 'true' : 'false';
    let ativo = req.body.ativo;
    let admin = req.body.admin;

    if (req.session.user.usuario === 'thalessalazar' || req.session.user.usuario === 'planagroadmin') {
        User.findOne({ usuario: usuario }).then(result => {
            if (!result) {
                User.create({ email, usuario, password, ativo, admin });
                res.redirect('/admin/user');
            } else {
                res.status(422).render('admin/user/newuser', {
                    pageTitle: "Criação de Usúario",
                    path: "admin/user",
                    robotsFollow: false,
                    errorMessage: ["Usuario já cadastrado"],
                    contact: false
                });
            }
        });
    } else {
        res.status(422).render('admin/user/newuser', {
            pageTitle: "Criação de Usúario",
            path: "admin/user",
            robotsFollow: false,
            errorMessage: ["Você não tem permissão para executar esta ação"],
            contact: false
        });
    }
};

exports.getUsers = async (req, res) => {
    User.find().then(users => {
        res.render('admin/user/users', {
            pageTitle: "Admnistrar Usuarios",
            path: "admin/user",
            robotsFollow: false,
            errorMessage: [],
            users: users,
            contact: false
        });
    });
};

exports.getUsersTest = (req, res) => {
    console.log(req.session);
};

exports.getNewUser = (req, res) => {
    res.render('admin/user/newuser', {
        pageTitle: "Novo Usúario",
        path: "admin/user",
        robotsFollow: false,
        errorMessage: [],
        contact: false
    });
};

exports.getEditUser = (req, res) => {
    const id = req.params.id;
    User.findById({ _id: id }).then(user => {
        res.status(200).render('admin/user/edituser', {
            pageTitle: "Ediçãio de Usúario",
            path: "admin/user",
            robotsFollow: false,
            user: user,
            errorMessage: [],
            contact: false
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postEditUser = async (req, res) => {

    const { id, email, usuario, password } = req.body;
    req.body.ativo = req.body.ativo == 'on' ? 'true' : 'false';
    req.body.admin = req.body.admin == 'on' ? 'true' : 'false';
    let ativo = req.body.ativo;
    let admin = req.body.admin;

    if (req.session.user.admin == true) {
        let filter = { _id: id };
        let update = {
            email: email,
            usuario: usuario,
            password: password,
            ativo: ativo,
            admin: admin
        }
        User.findOneAndUpdate(filter, update, { new: true }).then(() => {
            res.redirect('/admin/user');
        }).catch(err => {
            res.status(400).render('admin/user/edituser', {
                pageTitle: "Ediçãio de Usúario",
                path: "admin/user",
                robotsFollow: false,
                user: user,
                errorMessage: ["Houve algum erro ao executar esta ação, tente novamente em alguns minutos"],
                contact: false
            });
        })
    } else {
        res.status(400).render('admin/user/edituser', {
            pageTitle: "Ediçãio de Usúario",
            path: "admin/user",
            robotsFollow: false,
            user: user,
            errorMessage: ["Você não tem permissão para executar esta ação"],
            contact: false
        });
    }
};

exports.deleteUser = (req, res) => {
    if (req.session.user.usuario === 'thalessalazar' || req.session.user.usuario === 'planagroadmin') {
        let id = req.body.id;
        User.findByIdAndDelete({ _id: id }).then(() => {
            res.redirect('/admin/user');
        }).catch(err => {
            console.log(err);
            res.status(400).render('admin/user/edituser', {
                pageTitle: "Ediçãio de Usúario",
                path: "admin/user",
                robotsFollow: false,
                user: user,
                errorMessage: ["Não foi possível realizar esta operação"],
                contact: false
            });
        });
    } else {
        res.status(400).render('admin/user/edituser', {
            pageTitle: "Ediçãio de Usúario",
            path: "admin/user",
            robotsFollow: false,
            user: user,
            errorMessage: ["Você não tem permissão para executar esta ação"],
            contact: false
        });
    }
};