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

    const referente = 'compra-banner';

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

exports.getNewBanner = (req, res, next) => {
    res.render('admin/banner/novoBanner', {
        pageTitle: "Novo Banner",
        path: "admin/banner",
        errorMessage: [],
        form: false,
        robotsFollow: false,
        contact: false
    });
};

exports.getEditBanner = (req, res, next) => {
    const id = req.params.id;
    Banner.findById({ _id: id }).then(banner => {
        res.status(200).render('admin/banner/editBanner', {
            pageTitle: "Edição de Banner",
            path: "admin/banner",
            robotsFollow: false,
            banner: banner,
            errorMessage: [],
            contact: false
        });
    });
};

exports.postEditBanner = (req, res, next) => {
    const id = req.body.id;
    const fixed = req.body.fixed == 'on' ? 'true' : 'false';
    const { titulo, descricao, linkbotao, textobotao, referente } = req.body;

    Banner.findOne({ _id: id }).then(banner => {
        console.log(banner)
        if (req.file) {
            console.log(req.file);
            fileHelper.compressImage(req.file).then(newPath => {
                cloudinary.uploader.upload(newPath, { folder: 'planagro' }).then(result => {
                    fileHelper.delete(newPath);
                    banner.image = result;
                    banner.fixed = fixed;
                    banner.titulo = titulo;
                    banner.descricao = descricao;
                    banner.linkbotao = linkbotao;
                    banner.textobotao = textobotao;
                    banner.referente = referente;
                    banner.save();
                    return res.redirect('/admin/banner');
                }).catch(err => next(err));
            }).catch(err => next(err));
        } else {
            banner.fixed = fixed;
            banner.titulo = titulo;
            banner.descricao = descricao;
            banner.linkbotao = linkbotao;
            banner.textobotao = textobotao;
            banner.referente = referente;
            banner.save();
            return res.redirect('/admin/banner');
        }
    }).catch(err => next(err));
}

exports.postRedefineDefault = (req, res, next) => {
    const referente = req.body.referente;
    
    if(referente == 'entre-imoveis') {
        return res.redirect('/admin/banner');
    } else {
        const bannerdefault = {
            fixed : true,
            titulo : 'Quer vender seu imóvel?',
            descricao : '',
            textobotao : 'ENTRE EM CONTATO',
            linkbotao : '/contato',
            image : {
                asset_id: "29c99fee070eedc3568f94739eddf0db",
                public_id: "zhmoo1l5lsrkzekyy4cn",
                version: 1602179855,
                version_id: "51090030b34ea0873c53f48e55b58da3",
                signature: "a0b345417d3ff05c2a2479dd077ba03ed9a167d7",
                width: 1920,
                height: 940,
                format: "jpg",
                resource_type: "image",
                created_at: "2020-10-08T17:57:35Z",
                tags: [],
                bytes: 176599,
                type: "upload",
                etag: "5a84dcd2eef1b28130273550ce5a47b2",
                placeholder: false,
                url: "http://res.cloudinary.com/dhenuhnbj/image/upload/v1602179855/zhmoo1l5lsrkzekyy4cn.jpg",
                secure_url: "https://res.cloudinary.com/dhenuhnbj/image/upload/v1602179855/zhmoo1l5lsrkzekyy4cn.jpg",
                access_mode: "public",
                original_filename: "1602179852170-banner1920x1170",
                original_extension: "jpeg"
            }
     
        };

        Banner.findOne({referente: referente}).then(banner => {
            banner.titulo = bannerdefault.titulo;
            banner.descricao = bannerdefault.descricao;
            banner.textobotao = bannerdefault.textobotao;
            banner.linkbotao = bannerdefault.linkbotao;
            banner.fixed = bannerdefault.fixed;
            banner.image = bannerdefault.image;

            
            console.log('----------------------------------------')
            console.log(banner)

            banner.save().then(() => {
                return res.redirect('/admin/banner');
            }).catch(err => next(err));

        }).catch(err => next(err));
    }
    
};