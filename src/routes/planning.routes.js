import Router from 'express';
import { resolve } from "path";
import { readFileSync } from "fs";
import { validarJWT } from '../middlewares/validar-jwt';
import E_fileUpload from 'express-fileupload';
import PlanningController from '../Controllers/PlanningController'
const route = Router();
route.use(E_fileUpload())

route.post("/", [validarJWT], PlanningController.planning);
route.get("/getPlanningbyOcid/:ocid", [validarJWT], PlanningController.getPlanningbyOcid);
route.get("/getPlanningPeriod/:id", [validarJWT], PlanningController.getPlanningPeriod);
route.get("/getPlanningCotizacion/:id", [validarJWT], PlanningController.getPlanningCotizacion);

route.get("/getPlanningItems/:id", [validarJWT], PlanningController.getPlanningItems);
route.get("/getPlanningItemsValue/:id", [validarJWT], PlanningController.getPlanningItemsValue);
route.get("/getPlanningItemsClassific/:id", [validarJWT], PlanningController.getPlanningItemsClassific);
route.get("/getPlanningItemsUint/:id", [validarJWT], PlanningController.getPlanningItemsUint);
route.get("/getPlanningItemsinvitedSuppliers/:id", [validarJWT], PlanningController.getPlanningItemsinvitedSuppliers);
route.get("/getPlanningItemsQuotes/:id", [validarJWT], PlanningController.getPlanningItemsQuotes);
route.get("/getPlanningItemsQuo/:id", [validarJWT], PlanningController.getPlanningItemsQuo);
route.get("/getPlanningItemsCotizacion/:id", [validarJWT], PlanningController.getPlanningItemsCotizacion);
route.get("/getDatosPlanningCotizaciones/:iCot/:peri/:issuingSupplier", [validarJWT], PlanningController.getDatosPlanningCotizaciones);
route.get("/getPlanningbudget/:id", [validarJWT], PlanningController.getPlanningbudget);
route.get("/getPlanningbudgetValue/:id", [validarJWT], PlanningController.getPlanningbudgetValue);
route.get("/getPlanningPeriodbudgetBreakdown/:id", [validarJWT], PlanningController.getPlanningPeriodbudgetBreakdown);
route.get("/getPlanningbudgetBreakdownValue/:id", [validarJWT], PlanningController.getPlanningbudgetBreakdownValue);
route.get("/getPlanningbudgetBreakdown/:id", [validarJWT], PlanningController.getPlanningbudgetBreakdown);
route.get("/getPlanningbudgetBreakdownbudgetLines/:id", [validarJWT], PlanningController.getPlanningbudgetBreakdownbudgetLines);
route.get("/getPlanningbudgetBreakdownbudgetLinesComponets/:id", [validarJWT], PlanningController.getPlanningbudgetBreakdownbudgetLinesComponets);
route.get("/getPlanningbudgetBreakdownbudgetLinessourceParty/:id", [validarJWT], PlanningController.getPlanningbudgetBreakdownbudgetLinessourceParty);
route.get("/getPlanningDocuments/:id", [validarJWT], PlanningController.getPlanningDocuments);
route.get("/getPlanningHitos/:id", [validarJWT], PlanningController.getPlanningHitos);

route.post("/budget", [validarJWT], PlanningController.budget);
route.get("/pla_query/:ocid", [validarJWT], PlanningController.allPlanning);

route.get("/:id", [validarJWT], PlanningController.planningShow);
route.get("/budget/:ocid", [validarJWT], PlanningController.budgetShowID);
route.get("/all/budget", [validarJWT], PlanningController.budgetShowALL);


route.get("/milestonesocid/:ocid", [validarJWT], PlanningController.PlanningRationalebyOcid);

route.put("/:id", [validarJWT], PlanningController.planningUpdate);
route.put("/deletePlanningCotizacion/:_id/:_idOcid", [validarJWT], PlanningController.deletePlanningCotizacion);
route.put("/updatePlanning_Cotizacion/:id", [validarJWT], PlanningController.updatePlanning_Cotizacion);
route.put("/savePlanning_Cotizacion/:id/:_idOcid", [validarJWT], PlanningController.savePlanning_Cotizacion);
route.put("/budget/:id", [validarJWT], PlanningController.budgetUpdate);


route.put("/saveItems/:id", [validarJWT], PlanningController.saveItems);
route.get("/getItemPlanning/:ocid", [validarJWT], PlanningController.getPlanningItems);
route.put("/saveQuotesPlanning/:ocid/:itemPlanning", [validarJWT], PlanningController.saveQuotes);


route.post("/get_qoutes/:ocid", [validarJWT], PlanningController.MostrarQuotes);
route.post("/save_item_qoutes/:id", [validarJWT], PlanningController.saveItemsForQuotes);

//se actualizan los items
route.get("/updateItemPlanning/:ocid/:id", [validarJWT], PlanningController.UpdatePlanningItems);

route.get("/cucop", (req, res) => {
  // console.log("entre cucop si 1:"+req.query.search);
  const search = req.query.search;
  let ArrayCucop = [];
  const ruta = resolve(__dirname, "../documents/cucop.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayCucop.push(fileContents);
  // console.log("entre cucop ArrayCucop:"+ArrayCucop);
  try {
    const datos = JSON.parse(ArrayCucop);
    //  console.log(datos);
    let data = datos.filter(({ DESCRIPCION }) => DESCRIPCION.includes(search.toUpperCase()))
    // console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    console.log(err);
  }
});
route.get("/getcucop", (req, res) => {
  //console.log("entre: getcucop 2fa funcion_");
  const search = req.query.search;
  let ArrayCucop = [];
  const ruta = resolve(__dirname, "../documents/cucop.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayCucop.push(fileContents);

  try {
    const datos = JSON.parse(ArrayCucop);
    // console.log(datos);
    let data = datos.filter(({ DESCRIPCION }) => DESCRIPCION.includes(search.toUpperCase()))
    // console.log("daa"+data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});

route.get("/esquemas", (req, res) => {
  const search = req.query.search;
  let ArrayEsquema = [];
  const ruta = resolve(__dirname, "../documents/esquemas.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayEsquema.push(fileContents);

  try {
    const datos = JSON.parse(ArrayEsquema);
    // console.log(datos);
    let data = datos.filter(({ esquema }) => esquema.includes(search.toUpperCase()))
    //console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});


module.exports = route;