const Banner = require('../../models/banner');
const fileHelper = require('../../util/file-helper');
const cloudinary = require('../../util/cloudinary');

exports.getBanner = (req, res, next) => {
    Banner.find().then(banners => {
        res.render('admin/banner/banner', {
            pageTitle: "Banners do Site",
            path: "admin/banner",
            errorMessage: [],
            banners: banners,
            form: false,
            robotsFollow: false,
            contact: false
        });
    })
};

exports.postNewBanner = async (req, res, next) => {
    const { titulo, descricao, textobotao, linkbotao } = req.body;
    const fixed = req.body.fixed == 'on' ? 'true' : 'false';

    const referente = 'home';

    if (req.file) {
        fileHelper.compressImage(req.file).then(newPath => {
            cloudinary.uploader.upload(newPath, { folder: 'planagro' }).then(result => {
                fileHelper.delete(newPath);
                new Banner({
                    titulo,
                    descricao,
                    textobotao,
                    linkbotao,
                    fixed,
                    referente,
                    image: result
                }).save().then(() => {
                    res.redirect('/admin');
                }).catch(err => {
                    console.log(err);
                    res.render('admin/banner/novoBanner', {
                        pageTitle: "Novo Banner",
                        path: "admin/banner",
                        errorMessage: ["Houve algum erro ao cadastrar o banner"],
                        robotsFollow: false,
                        contact: false
                    });
                });
            }).catch(err => next(err));
        }).catch(err => next(err));
    } else {
        //define form para poder colocar nos value para o 
        //usuario não perder o que já foi colocado input
        const form = { titulo, descricao, textobotao, linkbotao, fixed };
        res.render('admin/banner/novoBanner', {
            pageTitle: "Novo Banner",
            path: "admin/banner",
            form: form,
            errorMessage: ["Insira alguma imagem"],
            robotsFollow: false,
            contact: false
        });
    }
};

exports.getEditBanner = (req, res, next) => {
    const id = req.params.id;
    Banner.findById({ _id: id }).then(banner => {
        res.status(200).render('admin/user/edituser', {
            pageTitle: "Ediçãio de Banner",
            path: "admin/banner",
            robotsFollow: false,
            banner: banner,
            errorMessage: [],
            contact: false
        });
    });
};

exports.getNewBanner = (req, res, next) => {
    res.render('admin/banner/novoBanner', {
        pageTitle: "Novo Banner",
        path: "admin/banenr",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};