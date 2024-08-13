import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import E_fileUpload from 'express-fileupload';
import AwardsController from '../Controllers/AwardsController';
const route = Router();
route.use(E_fileUpload())

route.post("/", [validarJWT], AwardsController.awardsCreate);
route.post("/contractPeriod", [validarJWT], AwardsController.contractPeriod);
route.post("/suppliers/:ocid", [validarJWT], AwardsController.suppliers);
route.post("/value", [validarJWT], AwardsController.value);

route.get("/:ocid", AwardsController.awardsAll);

route.get("/awd/:id", [validarJWT], AwardsController.awardsbyId);


route.get("/awardsbyocid/:ocid", AwardsController.awardsOCID);
route.get("/showids/:ocid", AwardsController.awardsShow);
route.get("/contractPeriod/:id", [validarJWT], AwardsController.contractPeriodShow);
route.get("/suppliersData/:ocid", [validarJWT], AwardsController.suppliersData);
route.get("/suppliersIDS/:ocid", [validarJWT], AwardsController.suppliersOCID);

route.get("/suppliers/one/:id", [validarJWT], AwardsController.suppliersID);

route.get("/value/:id", AwardsController.valueShow);


route.put("/:id", [validarJWT], AwardsController.awardsUpdate);
route.put("/update/:id", [validarJWT], AwardsController.awardsUpdateMain);


route.put("/contractPeriod/:id", [validarJWT], AwardsController.contractPeriodUpdate);
route.put("/suppliers/:id", [validarJWT], AwardsController.suppliersUpdate);
route.put("/value/:id", [validarJWT], AwardsController.valueUpdate);

route.delete("/:id", [validarJWT], AwardsController.awardsDelete);


module.exports = route;