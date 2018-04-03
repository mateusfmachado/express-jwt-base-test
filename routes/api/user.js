var router = require('express').Router();
var auth = require('../auth');

var UserController = require('../../controllers/user');

router.post('/', UserController.newUser); // APENAS PARA TESTE

router.get('/', auth.required, UserController.getUser);
router.post('/login', UserController.login);
router.put('/', auth.required, UserController.updateUser);
router.put('/alterar-senha', auth.required, UserController.updatePassword);

module.exports = router;