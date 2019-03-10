exports.getIndex = (req, res, next) => {
    res.render('admin/index', {
        pageTitle: "Painel de Admnistração",
        path: "admin/info",
        robotsFollow: false,
        contact: false
    });
};