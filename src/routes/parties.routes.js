import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import E_fileUpload from 'express-fileupload';
import PartiesController from '../Controllers/PartiesController';
const route = Router();
route.use(E_fileUpload())


route.get("/identifier/:ocid", [validarJWT], PartiesController.identifierShow);
route.post("/identifier/:ocid", [validarJWT], PartiesController.identifierCreate);
route.put("/identifier/:id", [validarJWT], PartiesController.identifierUpdate);

route.get("/contactPoint/:ocid", [validarJWT], PartiesController.contactPointShow);
route.post("/contactPoint/:ocid", [validarJWT], PartiesController.contactPoint);
route.put("/contactPoint/:id", [validarJWT], PartiesController.contactPointUpdate);

route.get("/address/:ocid", [validarJWT], PartiesController.addressShow);
route.post("/address/:ocid", [validarJWT], PartiesController.address);
route.put("/address/:id", [validarJWT], PartiesController.addressUpdate);

route.get("/getdata/:ocid/:key", [validarJWT], PartiesController.getDataParties);

route.get("/partiesid/:ocid/", [validarJWT], PartiesController.getPartiesAllOcid);

route.get("/partiesall/:ocid/", [validarJWT], PartiesController.getPartiesAll);

route.post("/:ocid", [validarJWT], PartiesController.partiesCreate);


route.get("/:id", [validarJWT], PartiesController.partiesShow);

route.put("/:id", [validarJWT], PartiesController.partiesUpdate);

route.delete("/:_id", [validarJWT], PartiesController.deletePartie);

module.exports = route;