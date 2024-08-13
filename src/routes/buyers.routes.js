import Router from "express";
import { validarJWT } from "../middlewares/validar-jwt";
import BuyersController from "../Controllers/BuyersController";

const route = Router();
route.post("/", [validarJWT], BuyersController.buyer);

route.get("/buyersAll", BuyersController.buyerAll);
route.get("/buyersAllapi", [validarJWT], BuyersController.buyerAllApi);
route.get("/buyersUser", [validarJWT], BuyersController.buyerShowByUser);
route.get("/:ocid", BuyersController.buyerShow);

route.put("/:id", [validarJWT], BuyersController.buyerUpdate);
module.exports = route;
