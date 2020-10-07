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
    cliente: require('../controllers/admin/cliente'),
    propriedade: require('../controllers/admin/propriedade'),
    user: require('../controllers/admin/user'),
    banner: require('../controllers/admin/banner')
}

//INDEX 
router.get('/admin', isAuth, setLocals, adminCtrl.info.getInfo);

//PROPRIEDADES
router.get('/admin/propiedades', isAuth, setLocals, adminCtrl.propriedade.getPropiedades);
//GET NEW
router.get('/admin/propiedades/new', isAuth, setLocals, adminCtrl.propriedade.getNewPropiedade);
//POST NEW
router.post('/admin/propiedades/new', isAuth, setLocals, validators.propriedade.propiedade, adminCtrl.propriedade.postNewPropiedade);
//GET GERAR TABELA
router.get('/admin/propiedades/gerartabela', isAuth, setLocals, adminCtrl.propriedade.getTabela);
//POST GERAR TABELA
router.post('/admin/propiedades/gerartabela', isAuth, setLocals, adminCtrl.propriedade.postTabela);
//GET EDIT
router.get('/admin/propiedades/edit/:propId', isAuth, setLocals, adminCtrl.propriedade.getEditPropiedade);
//POST EDIT
router.post('/admin/propiedades/edit', isAuth, setLocals, validators.propriedade.editPropiedade, adminCtrl.propriedade.postEditPropiedade);
//GET OUTRAS FOTOS
router.get('/admin/propiedades/outrasfotos/:propCod', isAuth, setLocals, adminCtrl.propriedade.getOutrasFotos);
//DELETE 
router.post('/admin/propiedades/delete', isAuth, setLocals, adminCtrl.propriedade.deletePropiedade);

//CLIENTES
router.get('/admin/clientes', isAuth, setLocals, adminCtrl.cliente.getClientes);
//GET PROFILE
router.get('/admin/cliente/:clienteCod', isAuth, setLocals, adminCtrl.cliente.getCliente);
//GET NEW
router.get('/admin/clientes/new', isAuth, setLocals, adminCtrl.cliente.getNewCliente);
//POST NEW
router.post('/admin/clientes/new', isAuth, setLocals, adminCtrl.cliente.postNewCliente);
//GET EDIT
router.get('/admin/clientes/edit/:clienteId', isAuth, setLocals, adminCtrl.cliente.getEditCliente);
//POST EDIT
router.post('/admin/clientes/edit', isAuth, setLocals, adminCtrl.cliente.postEditCliente);
//GET OUTRAS FOTOS
router.get('/admin/clientes/documentos/:clienteCod', isAuth, setLocals, adminCtrl.cliente.getDocumentos);
//DELETE 
router.post('/admin/clientes/delete', isAuth, setLocals, adminCtrl.cliente.deleteCliente);


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

//USER
router.get('/admin/user', isAuth, setLocals, adminCtrl.user.getUsers);
router.get('/admin/usertest', isAuth, setLocals, adminCtrl.user.getUsersTest);
router.post('/admin/user/new', isAuth, setLocals, adminCtrl.user.postNewUser);
router.get('/admin/user/new', isAuth, setLocals, adminCtrl.user.getNewUser);
router.get('/admin/user/edit/:id', isAuth, setLocals, adminCtrl.user.getEditUser);
router.post('/admin/user/edit/', isAuth, setLocals, adminCtrl.user.postEditUser);
router.post('/admin/user/delete/', isAuth, setLocals, adminCtrl.user.deleteUser);

//Banner
router.get('/admin/banner', isAuth, setLocals, adminCtrl.banner.getBanner);
router.get('/admin/banner/new', isAuth, setLocals, adminCtrl.banner.getNewBanner)
router.post('/admin/banner/new', isAuth, setLocals, adminCtrl.banner.postNewBanner); //novo banner
router.get('/admin/banner/edit/:id', isAuth, setLocals, adminCtrl.banner.getEditBanner);

//API
//NOVA FOTO  PARA UMA PROPIEDADE
router.post('/api/propiedade/novafoto', isAuth, adminCtrl.propriedade.setPropiedadeImage);

//REMOVER FOTO DA PROPIEDADE
router.post('/api/propiedade/removerfoto', isAuth, adminCtrl.propriedade.removePropiedadeImage);

//NOVO DOCUMENTO DE CLIENTE
router.post('/api/cliente/novodocumento', isAuth, adminCtrl.cliente.setNewDocumento);

//REMOVER DOCUMENTO DE CIENTE
router.post('/api/cliente/removerdocumento', isAuth, adminCtrl.cliente.removeDocumento);

//SEARCH CLIENT BY REGEX
router.get('/api/cliente/searchbyajax', isAuth, adminCtrl.cliente.searchByAjax);

module.exports = router;