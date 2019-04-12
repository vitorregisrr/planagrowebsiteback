const express = require('express'),
    router = express.Router();

const validators = {
        contato: require('../middleware/validators/contato')
    }

const shopCtrl = {
    contato: require('../controllers/shop/contato'),
    sobre: require('../controllers/shop/sobre'),
    propriedade: require('../controllers/shop/propriedade'),
    index: require('../controllers/shop/index')
}

router.get('/', shopCtrl.index.getIndex);

router.get('/sobre', shopCtrl.sobre.getSobre);

router.get('/comprar', shopCtrl.propriedade.getComprar);

router.get('/alugar', (req, res, next) => res.redirect('/comprar?genero=Aluguél'));

router.get('/propriedade/:propCod', shopCtrl.propriedade.getPropiedade);

router.post('/interesse', validators.contato.interesse, shopCtrl.contato.postInteresse);

router.get('/vender', shopCtrl.contato.getVender);
router.post('/vender', validators.contato.vender, shopCtrl.contato.postVender);

router.get('/contato', shopCtrl.contato.getContato);
router.post('/contato', validators.contato.contato, shopCtrl.contato.postContato);

module.exports = router;