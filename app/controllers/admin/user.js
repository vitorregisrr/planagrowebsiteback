const User = require('../../models/user');

exports.postNewUser = async (req, res, next) => {
    const { email, usuario, password } = req.body;
    req.body.ativo = req.body.patio == 'on' ? 'true' : 'false';
    let ativo = req.body.ativo;

    User.findOne({ usuario: usuario }).then(result => {
        if (!result) {
            User.create({ email, usuario, password, ativo });
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

    //User.create({ email, usuario, password, ativo });
    //res.redirect('/admin/user');
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
    User.find().then(users => {
        console.log(users);
    });
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
    console.log('entrou no post');

    const { id, email, usuario, password } = req.body;
    req.body.ativo = req.body.patio == 'on' ? 'true' : 'false';
    let ativo = req.body.ativo;

    User.find({ usuario: usuario }).then(result => {
        console.log(result);
        console.log('entrou no result')
        if (result.usuario === usuario) {
            console.log('entrou no if')
            let filter = { _id: id };
            console.log('filter:', filter);
            let update = {
                email: email,
                usuario: usuario,
                password: password,
                ativo: ativo
            }
            User.findOneAndUpdate(filter, update, { new: true }).then(() => {
                console.log('Fez o update');
                res.redirect('/admin/user');
            });
            
        } else {
            console.log('entrou no else');
        }

    });
}