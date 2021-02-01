const Sobre = require('../../models/sobre'),
    transporter = require('../../util/email-transporter')();
const Banner = require('../../models/banner');
require('dotenv').config();
const request = require('request');


exports.getContato = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Banner.find({ referente: 'contato-banner' }).then(banner => {

                res.render('shop/contato', {
                    pageTitle: "Entre em contato conosco!",
                    path: "/contato",
                    robotsFollow: true,
                    sobre: sobre,
                    banner: banner,
                    contact: true,
                    errorMessage: [],
                    csrfToken: req.csrfToken(),
                    successMessage: false,
                    form: false,
                });

            }).catch(err => next(err));
        })
        .catch(err => next(err));
}

exports.postContato = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            Banner.find({ referente: 'contato-banner' }).then(banner => {
                transporter.sendMail({
                    to: sobre.email,
                    from: req.body.email,
                    subject: 'Mensagem de contato recebida pelo site!',
                    html: `
                        <h3> Você recebeu uma nova mensagem de contato a partir do formulário do seu site! </h3>
                        <p>De: ${req.body.nome}</p>
                        <p>Telefone: ${req.body.telefone}</p>
                        <p>E mail: ${req.body.email}</p>
                        <p>Com a mensagem: ${req.body.mensagem}</p>
                        <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
                    `
                }).then(resul => {
                    res.render('shop/contato', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/contato",
                        robotsFollow: true,
                        sobre: sobre,
                        banner: banner,
                        contact: true,
                        errorMessage: [],
                        successMessage: 'Mensagem enviada, assim que possível entraremos em contato com uma resposta!',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                    .catch(err => next(err))
            })
                .catch(err => next(err))
        })
        .catch(err => next(err, 500));
}

exports.postInteresse = (req, res, next) => {
    const captcha = req.body.captcha;
    console.log(req.body.captcha);

    if (!req.body.captcha) {
        Sobre.findOne().then(sobre => {
            Banner.findOne({ referente: 'contato-banner' }).then(banner => {
                res.render('shop/contato', {
                    pageTitle: "Entre em contato conosco!",
                    path: "/contato",
                    robotsFollow: true,
                    sobre: sobre,
                    banner: banner,
                    contact: true,
                    errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                    successMessage: '',
                    csrfToken: req.csrfToken(),
                    form: false,
                });
            })
                .catch(err => next(err));
        })
            .catch(err => next(err));
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PK}&response=${req.body.captcha}`;


    request(verifyUrl, (err, response, body) => {
        if (err) {
            Sobre.findOne().then(sobre => {
                Banner.findOne({ referente: 'contato-banner' }).then(banner => {
                    res.render('shop/contato', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/contato",
                        robotsFollow: true,
                        sobre: sobre,
                        banner: banner,
                        contact: true,
                        errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                        successMessage: '',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                    .catch(err => next(err));
            })
                .catch(err => next(err));
        }

        body = JSON.parse(body);

        if (!body.success || body.score < 0.3) {
            Sobre.findOne().then(sobre => {
                Banner.find({ referente: 'contato-banner' }).then(banner => {
                    res.render('shop/contato', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/contato",
                        robotsFollow: true,
                        sobre: sobre,
                        banner: banner,
                        contact: true,
                        errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                        successMessage: '',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                    .catch(err => next(err));
            })
                .catch(err => next(err));
        }

        // Se chegou aqui é pq ele validou e não é um ROBO, então posso enviar o email e retornar success para a rota  
        Sobre.findOne()
            .then(sobre => {
                Banner.find({ referente: 'contato-banner' }).then(banner => {
                    console.log(banner);
                    transporter.sendMail({
                        to: sobre.email,
                        from: req.body.email,
                        subject: 'Mensagem de contato recebida pelo site!',
                        html: `
                        <h3> Você recebeu uma nova mensagem de contato a partir do formulário do seu site! </h3>
                        <p>De: ${req.body.nome}</p>
                        <p>Telefone: ${req.body.telefone}</p>
                        <p>E mail: ${req.body.email}</p>
                        <p>Com a mensagem: ${req.body.mensagem}</p>
                        <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
                    `
                    }).then(resul => {
                        res.render('shop/contato', {
                            pageTitle: "Entre em contato conosco!",
                            path: "/contato",
                            robotsFollow: true,
                            sobre: sobre,
                            banner: banner,
                            contact: true,
                            errorMessage: [],
                            successMessage: 'Mensagem enviada, assim que possível entraremos em contato com uma resposta!',
                            csrfToken: req.csrfToken(),
                            form: false,
                        });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
    });


}


exports.getVender = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            return res.render('shop/vender', {
                pageTitle: "Vender Imóveis ou Propiedades",
                path: "/vender",
                robotsFollow: true,
                errorMessage: [],
                sobre: sobre,
                contact: true,
                csrfToken: req.csrfToken(),
                form: false,
                successMessage: false
            })
        })
        .catch(err => next(err));
}

exports.postVender = (req, res, next) => {
    Sobre.findOne()
        .then(sobre => {
            transporter.sendMail({
                to: sobre.email,
                from: req.body.email,
                subject: 'Você recebeu uma proposta de venda no seu website!',
                html: `
                <h3> Você recebeu uma nova proposta a partir do formulário de venda do seu site! </h3>
                <h4> Dados do cliente: </h4>
                <p>De: ${req.body.nome}</p>
                <p>Telefone: ${req.body.telefone}</p>
                <p>E mail: ${req.body.email}</p>
                <p>Com a mensagem: ${req.body.mensagem}</p>

                <h4> Dados da propiedade: </h4>
                <p>Titulo: ${req.body.titulo}</p>
                <p>Zona: ${req.body.zona}</p>
                <p>Tipo: ${req.body.tipo}</p>
                <p>Descricao: ${req.body.descricao}</p>
                <p>Endereço: ${req.body.endereco}</p>
                <p>Cidade: ${req.body.cidade ? req.body.cidade : 'Não especificado'}</p>
                <p>Localidade: ${req.body.localidade ? req.body.localidade : 'Não especificado'}</p>   

                <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
            `
            })
                .then(resul => {
                    res.render('shop/vender', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/vender",
                        robotsFollow: true,
                        sobre: sobre,
                        contact: true,
                        errorMessage: [],
                        successMessage: 'Mensagem enviada, assim que possível entraremos em contato com uma resposta!',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                .catch(err => next(err))
        })

        .catch(err => next(err, 500));
}


exports.apiPostContato = (req, res, next) => {

    console.log(req.body.captcha);

    if (!req.body.captcha) {
        res.json({
            'msg': 'captcha token is undefined'
        });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PK}&response=${req.body.captcha}`;

    request(verifyUrl, (err, response, body) => {
        if (err) {
            console.log(err);
        }

        body = JSON.parse(body);

        if (!body.success || body.score < 0.3) {
            res.json({ msg: 'Erro', score: body.score });
        }

        res.json({ msg: 'You have been verifide!' })
    });
}

exports.postContatoRecaptcha = (req, res, next) => {
    console.log(req.body.captcha);

    if (!req.body.captcha) {
        Sobre.findOne().then(sobre => {
            Banner.findOne({ referente: 'contato-banner' }).then(banner => {
                res.render('shop/contato', {
                    pageTitle: "Entre em contato conosco!",
                    path: "/contato",
                    robotsFollow: true,
                    sobre: sobre,
                    banner: banner,
                    contact: true,
                    errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                    successMessage: '',
                    csrfToken: req.csrfToken(),
                    form: false,
                });
            })
                .catch(err => next(err));
        })
            .catch(err => next(err));
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_PK}&response=${req.body.captcha}`;

    request(verifyUrl, (err, response, body) => {
        if (err) {
            Sobre.findOne().then(sobre => {
                Banner.findOne({ referente: 'contato-banner' }).then(banner => {
                    res.render('shop/contato', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/contato",
                        robotsFollow: true,
                        sobre: sobre,
                        banner: banner,
                        contact: true,
                        errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                        successMessage: '',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                    .catch(err => next(err));
            })
                .catch(err => next(err));
        }

        body = JSON.parse(body);

        if (!body.success || body.score < 0.3) {
            Sobre.findOne().then(sobre => {
                Banner.find({ referente: 'contato-banner' }).then(banner => {
                    res.render('shop/contato', {
                        pageTitle: "Entre em contato conosco!",
                        path: "/contato",
                        robotsFollow: true,
                        sobre: sobre,
                        banner: banner,
                        contact: true,
                        errorMessage: ['Houve algum erro ao processar seu pedido. Tente novamente mais tarde'],
                        successMessage: '',
                        csrfToken: req.csrfToken(),
                        form: false,
                    });
                })
                    .catch(err => next(err));
            })
                .catch(err => next(err));
        }

        // Se chegou aqui é pq ele validou e não é um ROBO, então posso enviar o email e retornar success para a rota  
        Sobre.findOne()
            .then(sobre => {
                Banner.find({ referente: 'contato-banner' }).then(banner => {
                    console.log(banner);
                    transporter.sendMail({
                        to: sobre.email,
                        from: req.body.email,
                        subject: 'Mensagem de contato recebida pelo site!',
                        html: `
                        <h3> Você recebeu uma nova mensagem de contato a partir do formulário do seu site! </h3>
                        <p>De: ${req.body.nome}</p>
                        <p>Telefone: ${req.body.telefone}</p>
                        <p>E mail: ${req.body.email}</p>
                        <p>Com a mensagem: ${req.body.mensagem}</p>
                        <h5> Responda o mais rápido possível, não deixe seu cliente esperando! </h5>
                    `
                    }).then(resul => {
                        res.render('shop/contato', {
                            pageTitle: "Entre em contato conosco!",
                            path: "/contato",
                            robotsFollow: true,
                            sobre: sobre,
                            banner: banner,
                            contact: true,
                            errorMessage: [],
                            successMessage: 'Mensagem enviada, assim que possível entraremos em contato com uma resposta!',
                            csrfToken: req.csrfToken(),
                            form: false,
                        });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
    });
}
