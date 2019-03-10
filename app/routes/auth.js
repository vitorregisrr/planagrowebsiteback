const express = require('express'),
    router = express.Router();

const validators = {
    auth: require('../middleware/validators/auth')
}

const authCtrl = {
    changePass: require('../controllers/auth/changepass'),
    resetPass: require('../controllers/auth/resetpass'),
    login: require('../controllers/auth/login')
}

//LOGIN
//GET
router.get('/admin/login', setLocals, authCtrl.login.getLogin);

//POST
router.post('/admin/login', setLocals, validators.auth.login, authCtrl.login.postLogin);

//LOGOUT
router.get('/admin/logout', setLocals, authCtrl.login.postLogout);

//CHANGE PASSWORD
    //GET
    router.get('/admin/mudar-senha', setLocals, authCtrl.changePass.getChangePass);
    //POST
    router.post('/admin/mudar-senha', setLocals, validators.auth.resetPassword, authCtrl.changePass.postChangePass);

//REQUEST RESET PASSWORD
    //GET
    router.get('/admin/resetpassword', setLocals, authCtrl.resetPass.getResetPassword);
    //POST
    router.post('/admin/resetpassword', setLocals, authCtrl.resetPass.postResetPassword);

//RESET PASSWORD
    //GET
    router.get('/admin/newpassword/:passwordToken', setLocals, authCtrl.resetPass.getNewPassword);
    //POST
    router.post('/admin/newpassword', validators.auth.resetPassword, setLocals, authCtrl.resetPass.postNewPassword);

module.exports = router;