import Router from "express";
import { validarJWT } from "../middlewares/validar-jwt";
import E_fileUpload from "express-fileupload";
import ContractsController from "../Controllers/ContractsController";
const route = Router();
route.use(E_fileUpload());

route.post("/", [validarJWT], ContractsController.contractCreate);
route.post("/contractperiod", [validarJWT], ContractsController.ContractPeriod);
route.post("/value", [validarJWT], ContractsController.value);

route.get("/:ocid/:awardid", [validarJWT], ContractsController.contractShowOne);

route.get("/all/:ocid/:awardid/", [validarJWT], ContractsController.contractShowAll);
route.get("/id/:ocid/:awardid/", [validarJWT], ContractsController.contractShowAllID);


route.get("/data/:ocid/:contract_id/:awardid/", [validarJWT], ContractsController.getContracto);


route.get("/award/data/contract/:awardid", [validarJWT], ContractsController.ContratactbyId);
route.get("/award/ocid/contract/:ocid", [validarJWT], ContractsController.ContratactOCID);
route.get("/award/ocid/all/:ocid", [validarJWT], ContractsController.ContratactOCIDS);

route.get(
  "/contractperiod/:id",
  [validarJWT],
  ContractsController.ContractPeriodShow
);
route.get("/value/:id", [validarJWT], ContractsController.ValuesShow);

route.put("/", [validarJWT], ContractsController.contratosUpdate);

route.put("/:id", [validarJWT], ContractsController.OneContratUpdate);

route.put(
  "/contractperiod/:id",
  [validarJWT],
  ContractsController.ContractPeriodUpdate
);
route.put("/value/:id", [validarJWT], ContractsController.valueUpdate);

// route.post("/contractIm", [validarJWT], ContractsController.contractImCreate);
// route.get("/contractIm/:id", [validarJWT], ContractsController.contractImShow);
// route.post("/implementation", [validarJWT], ContractsController.implementation);
route.post("/contractEn", [validarJWT], ContractsController.contractEnCreate);
// route.get("/contractEn/:id", [validarJWT], ContractsController.contractEnShow);


route.delete("/:id", [validarJWT], ContractsController.ContractDelete);

module.exports = route;
