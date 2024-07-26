import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import E_fileUpload from 'express-fileupload';
import ItemsController from '../Controllers/ItemsController';
const route = Router();
route.use(E_fileUpload())

route.post("/", [validarJWT], ItemsController.items);
route.post("/classifications", [validarJWT], ItemsController.classifications);
route.post("/additionalClassifications", [validarJWT], ItemsController.additionalClassifications);
route.post("/unit/value", [validarJWT], ItemsController.itemValue);
route.post("/unit", [validarJWT], ItemsController.itemUnit);

route.get("/:ocid", [validarJWT], ItemsController.itemsShowAll);
route.get("/getitembyid/:id", [validarJWT], ItemsController.itemByID);
route.get("/getitemid/:ocid", [validarJWT], ItemsController.itemsShowID);
route.get("/item-contract/:ocid", [validarJWT], ItemsController.itemByContract);


route.get("/classifications/:id", [validarJWT], ItemsController.classificationsShow);
route.get("/additionalClassifications/:id", [validarJWT], ItemsController.additionalClassificationsShow);
route.get("/unit/value/:id", [validarJWT], ItemsController.itemValueShow);
route.get("/unit/:id", [validarJWT], ItemsController.itemUnitShow);

route.put("/:id", [validarJWT], ItemsController.itemsUpdate);
route.put("/classifications/:id", [validarJWT], ItemsController.classificationsUpdate);
route.put("/additionalClassifications/:id", [validarJWT], ItemsController.additionalClassificationsUpdate);
route.put("/unit/value/:id", [validarJWT], ItemsController.itemValueUpdate);
route.put("/unit/:id", [validarJWT], ItemsController.itemUnitUpdate);



route.delete("/:_id", [validarJWT], ItemsController.itemDelete);



module.exports = route;