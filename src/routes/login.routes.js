import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import loginController from '../Controllers/loginController';
import { validarcampos } from'../middlewares/validar-campos';
import { check } from'express-validator';
const route = Router();


//ruta de login
route.post('/', [
    // check('email', 'El email es Obligatorio').isEmail(),
    check('password', 'El password es Obligatorio').not().isEmpty(),
    validarcampos
], loginController.login)

route.get('/renew', validarJWT, loginController.renewToken);

route.post('/change-password', [
    validarJWT, 
    check('lastpassword', 'El password es Obligatorio').not().isEmpty(), validarcampos]
    , loginController.ChangePass)
    
module.exports = route;