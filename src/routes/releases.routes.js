import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import E_fileUpload from 'express-fileupload';
import ReleaseController from '../Controllers/ReleaseController';
const route = Router();
route.use(E_fileUpload())

//route.post("/count", [validarJWT], ReleaseController.countCreate);
//route.put("/countAct", [validarJWT], ReleaseController.countUpdate);

route.post("/contrato", [validarJWT], ReleaseController.contratoCreate);

route.get("/contratoO/:ocid",  ReleaseController.contratoShowFinal);
route.get("/contratoOP/:ocid", ReleaseController.contratoShowPublica);
route.get("/contratoU", [validarJWT], ReleaseController.contratoShow);
route.get("/contratoAll",  ReleaseController.allContratos);
route.get("/contratoUser", [validarJWT], ReleaseController.contratoByUser);

route.get("/contratos", [validarJWT], ReleaseController.contratoByUserOCID);

route.put("/contratoUpdate/:ocid", [validarJWT], ReleaseController.contratoUpdate);
route.put("/contratoUpdateStatus/:ocid", [validarJWT], ReleaseController.contratoUpdateStatus);
route.get("/getInfoEjecucion/:ocid", [validarJWT], ReleaseController.getInfoEjecucion);
module.exports = route;