const express = require('express'),
    router = express.Router(),
    setLocals = require('../middleware/set-locals'),
    isAuth = require('../middleware/is-auth');

const validators = {
    propriedade: require('../middleware/validators/propriedade'),
    depoimento: require('../middleware/validators/depoimento'),
    funcionario: require('../middleware/validators/funcionario')
}

const adminCtrl = {
    depoimento: require('../controllers/admin/depoimento'),
    funcionario: require('../controllers/admin/funcionario'),
    index: require('../controllers/admin/index'),
    info: require('../controllers/admin/info'),
    sobre: require('../controllers/admin/sobre'),
    propriedade: require('../controllers/admin/propriedade')
}

//INDEX 
router.get('/admin', isAuth, setLocals, adminCtrl.info.getInfo);

//PROPRIEDADES
    router.get('/admin/propiedades', isAuth, setLocals, adminCtrl.propriedade.getPropiedades);
    //GET NEW
    router.get('/admin/propiedades/new', isAuth, setLocals, adminCtrl.propriedade.getNewPropiedade);
    //POST NEW
    router.post('/admin/propiedades/new', isAuth, setLocals, validators.propriedade.propiedade, adminCtrl.propriedade.postNewPropiedade);
    //GET EDIT
    router.get('/admin/propiedades/edit/:propId', isAuth, setLocals, adminCtrl.propriedade.getEditPropiedade);
    //POST EDIT
    router.post('/admin/propiedades/edit', isAuth, setLocals, validators.propriedade.editPropiedade, adminCtrl.propriedade.postEditPropiedade);
    //DELETE 
    router.post('/admin/propiedades/delete', isAuth, setLocals, adminCtrl.propriedade.deletePropiedade);

//DEPOIMENTOS
    router.get('/admin/depoimentos', isAuth, setLocals, adminCtrl.depoimento.getDepoimentos);
    //GET NEW
    router.get('/admin/depoimentos/new', isAuth, setLocals, adminCtrl.depoimento.getNewDepoimento);
    //POST NEW
    router.post('/admin/depoimentos/new', isAuth, setLocals, validators.depoimento.depoimento, adminCtrl.depoimento.postNewDepoimento);
    //GET EDIT
    router.get('/admin/depoimentos/edit/:depId', isAuth, setLocals, adminCtrl.depoimento.getEditDepoimento);
    //POST EDIT
    router.post('/admin/depoimentos/edit', isAuth, setLocals, validators.depoimento.editDepoimento, adminCtrl.depoimento.postEditDepoimento);
    //DELETE 
    router.post('/admin/depoimentos/delete', isAuth, setLocals, adminCtrl.depoimento.deleteDepoimento);


//FUNCIONARIOS
    router.get('/admin/funcionarios', isAuth, setLocals, adminCtrl.funcionario.getFuncionarios);
    //GET NEW
    router.get('/admin/funcionarios/new', isAuth, setLocals, adminCtrl.funcionario.getNewFuncionario);
    //POST NEW
    router.post('/admin/funcionarios/new', isAuth, setLocals, validators.funcionario.funcionario, adminCtrl.funcionario.postNewFuncionario);
    //GET EDIT
    router.get('/admin/funcionarios/edit/:funcId', isAuth, setLocals, adminCtrl.funcionario.getEditFuncionario);
    //POST EDIT
    router.post('/admin/funcionarios/edit', isAuth, setLocals, adminCtrl.funcionario.postEditFuncionario);
    //DELETE 
    router.post('/admin/funcionarios/delete', isAuth, setLocals, adminCtrl.funcionario.deleteFuncionario);

//SOBRE
    //GET
    router.get('/admin/sobre', isAuth, setLocals, adminCtrl.sobre.getSobre);
    //POST
    router.post('/admin/sobre', isAuth, setLocals, adminCtrl.sobre.postSobre);

//INFO
    //GET
    router.get('/admin/info', isAuth, setLocals, adminCtrl.info.getInfo);
    //POST
    router.post('/admin/info', isAuth, setLocals, adminCtrl.info.postInfo);

//API
    //NOVA FOTO  PARA UMA PROPIEDADE
    router.post('/api/propiedade/novafoto', isAuth, adminCtrl.propriedade.setPropiedadeImage);

    //REMOVER FOTO DA PROPIEDADE
    router.post('/api/propiedade/removerfoto', isAuth, adminCtrl.propriedade.removePropiedadeImage);

module.exports = router;