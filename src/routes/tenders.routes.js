import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import TendersController from '../Controllers/TendersController';
import E_fileUpload from 'express-fileupload';
const route = Router();
route.use(E_fileUpload());


route.post("/", [validarJWT], TendersController.tendersCreate);

// Values
route.post("/procuringEntity", [validarJWT], TendersController.procuringEntity);
route.get("/procuringEntity/:get", [validarJWT], TendersController.procuringEntityShow);
route.put("/procuringEntity/:get", [validarJWT], TendersController.procuringEntityUpdate);

route.post("/minValue", [validarJWT], TendersController.minValue);
route.get("/minValue/:get", [validarJWT], TendersController.minValueShow);
route.get("/minValue/:get", [validarJWT], TendersController.minValueShow);
route.put("/minValue/:get", [validarJWT], TendersController.minValueUpdate);

route.get("/value/:get", [validarJWT], TendersController.valueShow);
route.post("/value", [validarJWT], TendersController.value);
route.put("/value/:get", [validarJWT], TendersController.valueUpdate);



route.post("/tenderPeriod", [validarJWT], TendersController.tenderPeriod);
route.post("/awardPeriod", [validarJWT], TendersController.awardPeriod);
route.post("/enquiryPeriod", [validarJWT], TendersController.enquiryPeriod);


route.get("/:ocid", [validarJWT], TendersController.tendersShow);
route.get("/tenderPeriod/:get", [validarJWT], TendersController.tenderPeriodShow);
route.get("/awardPeriod/:get", [validarJWT], TendersController.awardPeriodShow);
route.get("/enquiryPeriod/:get", [validarJWT], TendersController.enquiryPeriodShow);


route.put("/", [validarJWT], TendersController.tendersUpdate);
route.put("/tenderPeriod/:get", [validarJWT], TendersController.tenderPeriodUpdate);
route.put("/awardPeriod/:get", [validarJWT], TendersController.awardPeriodUpdate);
route.put("/enquiryPeriod/:get", [validarJWT], TendersController.enquiryPeriodUpdate);


route.get("/tenders/:ocid", [validarJWT], TendersController.getDataTenders);


route.delete("/tenders/:ocid", [validarJWT], TendersController.deleteTender);

module.exports = route;
