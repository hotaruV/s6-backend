import Router from 'express';
import OICController from '../Controllers/OicController';
import { validarJWT } from '../middlewares/validar-jwt';
const route = Router();

route.get('/obtener-user', validarJWT, OICController.GetUserRolID);
route.get('/update-revision/:ocid', validarJWT, OICController.updateStatusNotification);
route.get('/get-all-notifications/:ocid/:revision_id', validarJWT, OICController.getAllNotificacionsByRevitions);
route.get('/get-user-notifications/', validarJWT, OICController.getAllNotificacionsByUser);
route.get('/get-one-notifications/:_id', validarJWT, OICController.getOneNotificacion);

route.post('/create-notifications/:ocid/:revision_id', validarJWT, OICController.createNotification);
route.get('/cambiar-status/:_id/:status', validarJWT, OICController.updateNotificacionStatus);



module.exports = route;