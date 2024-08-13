import Router from "express";
import { validarJWT } from "../middlewares/validar-jwt";
import DocumentsController from "../Controllers/DocumentsController";

const route = Router();
route.get("/documents/:id", [validarJWT], DocumentsController.documentsShow);

route.post("/documents", [validarJWT], DocumentsController.documents);
route.post("/milestones", [validarJWT], DocumentsController.milestones);
route.post("/amendments", [validarJWT], DocumentsController.amendments);


route.get("/:ocid", [validarJWT], DocumentsController.documentsByUser2);
route.get("/documents/search/:type/:ocid", [validarJWT], DocumentsController.documentsByUser);
route.get("/document/search/:type/:ocid", [validarJWT], DocumentsController.documentsByUser2);
route.get("/milestones/:id", [validarJWT], DocumentsController.milestonesShow);
route.get("/milestones/search/:type/:ocid", [validarJWT], DocumentsController.milestonesByUser);
// route.get("/milestonesocid/:ocid", [validarJWT], DocumentsController.milestoneOcid);

route.get("/amendmentid/:ocid", [validarJWT], DocumentsController.amendmentsShow);
route.get("/amendmentsocid/:ocid", [validarJWT], DocumentsController.amendmentsByOcid);
route.get("/amendment/:id", [validarJWT], DocumentsController.amendmentsShowID);


route.put("/amendments/:id", [validarJWT], DocumentsController.amendmentsUpdate);

route.put("/documents/:id", [validarJWT], DocumentsController.documentsUpdate);
route.put("/milestones/:id", [validarJWT], DocumentsController.milestonesUpdate);


route.delete("/documents/:id/:ocid", [validarJWT], DocumentsController.documentsDelete);
route.delete("/milestones/:id/:ocid", [validarJWT], DocumentsController.milestonesDelete);
route.delete("/amendments/:id/:ocid", [validarJWT], DocumentsController.amendmentsDelete);

module.exports = route;
