import e, { Router } from "express";
import { resolve } from "path";
import { readFileSync } from "fs";
import { validarJWT } from '../middlewares/validar-jwt';
import ApiController from "../Controllers/ApiController";
const route = Router();

/**
 * @swagger
 * /api/seaslp/index/:
 *   get:
 *     summary: Obtener versión de la API
 *     description: Endpoint para obtener la versión de la API.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     responses:
 *       200:
 *         description: Versión de la API obtenida exitosamente.
 */

/**
 * @swagger
 * /api/seaslp/index/list-slp:
 *   get:
 *     summary: Obtener lista de municipios
 *     description: Endpoint para obtener la lista de municipios.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     responses:
 *       200:
 *         description: Lista de municipios obtenida exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/seaslp/index/partidas-gen:
 *   get:
 *     summary: Obtener partidas genéricas
 *     description: Endpoint para obtener las partidas genéricas.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     responses:
 *       200:
 *         description: Partidas genéricas obtenidas exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/seaslp/index/entes-publicos:
 *   get:
 *     summary: Buscar entes públicos por nombre
 *     description: Endpoint para buscar entes públicos por nombre.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         description: Nombre del ente público a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entes públicos obtenidos exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/seaslp/index/productos-servicios:
 *   get:
 *     summary: Obtener productos/servicios (requiere JWT)
 *     description: Endpoint para obtener productos/servicios. Requiere JWT para acceder.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Productos/servicios obtenidos exitosamente.
 *       401:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error interno del servidor.
 */

/**
 * @swagger
 * /api/seaslp/index/producto-servicio/{key}:
 *   get:
 *     summary: Buscar producto/servicio por clave (requiere JWT)
 *     description: Endpoint para buscar producto/servicio por clave. Requiere JWT para acceder.
 *     tags: 
 *       - Operaciones relacionadas con la API
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: Clave del producto/servicio a buscar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto/servicio encontrado exitosamente.
 *       401:
 *         description: Acceso no autorizado.
 *       500:
 *         description: Error interno del servidor.
 */



route.get("/", (req, res) => {
  // console.log(process.env)
  res.json({
    version: 1.0,
  });
});

route.get("/list-slp", (req, res) => {
  const ruta = resolve(__dirname, "../documents/municipios.json");
  const fileContents = readFileSync(ruta, "utf8");
  try {
    const data = JSON.parse(fileContents);
    res.json({
      municipios: data,
    });
  } catch (err) {
    console.error(err);
  }
});

route.get("/partidas-gen", (req, res) => {
  const ruta = resolve(
    __dirname,
    "../documents/conceptos-partidas-genéricas- específicas-y-analíticas.json"
  );
  const fileContents = readFileSync(ruta, "utf8");
  try {
    const data = JSON.parse(fileContents);
    res.json({
      partidas: data,
    });
  } catch (err) {
    console.error(err);
  }
});

route.get("/entes-publicos", (req, res) => {
  const search = req.query.search;
  let ArrayEnte = [];
  const ruta = resolve(__dirname, "../documents/entesPublicos.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayEnte.push(fileContents);

  try {
    const datos = JSON.parse(ArrayEnte);
    let data = datos.filter(({ nombre_ente }) => nombre_ente.includes(search.toUpperCase()))
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});

route.get("/productos-servicios", [validarJWT], ApiController.cfdi);
route.get("/producto-servicio/:key", [validarJWT], ApiController.searchcfdi);


//aqui va lo de registro de entes publicos
route.get("/estados", (req, res) => {
  const search = req.query.search;
  let ArrayEstado = [];
  const ruta = resolve(__dirname, "../documents/estados.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayEstado.push(fileContents);

  try {
    const datos = JSON.parse(ArrayEstado);
    // console.log(datos);
    let data = datos.filter(({ nombre }) => nombre.includes(search.toUpperCase()))
    //console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/paises", (req, res) => {
  const search = req.query.search;
  let ArrayPaises = [];
  const ruta = resolve(__dirname, "../documents/paises.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayPaises.push(fileContents);

  try {
    const datos = JSON.parse(ArrayPaises);
    // console.log(datos);
    let data = datos.filter(({ nombre }) => nombre.includes(search.toUpperCase()))
    //console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/paisesAll", (req, res) => {

  let ArrayPaises = [];
  const ruta = resolve(__dirname, "../documents/paises.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayPaises.push(fileContents);

  try {
    const datos = JSON.parse(ArrayPaises);
    // console.log(datos);
    let data = datos;
    //console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/codigos", (req, res) => {
  const search = req.query.search || '';

  const ruta = resolve(__dirname, "../documents/colonias.json");
  const fileContents = readFileSync(ruta, "utf8");

  try {
    const datos = JSON.parse(fileContents);
    const filteredData = datos.filter(({ cp }) => cp.includes(search));

    return res.status(200).json({
      data: filteredData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
route.get("/colonias", (req, res) => {
  //console.log("entre a codigopostal");
  const search = req.query.search.toUpperCase();
  let ArrayCodigosPostales = [];
  const ruta = resolve(__dirname, "../documents/colonias.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayCodigosPostales.push(fileContents);

  try {
    const datos = JSON.parse(ArrayCodigosPostales);
    //console.log(datos);
    let data = datos.filter(({ colonia }) => colonia.toUpperCase().includes(search));
    //console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/municipiosByNombre", (req, res) => {
  //console.log("entre MunicipiosByNombre:");
  const search = req.query.search;
  //console.log("entre MunicipiosByNombre:"+search);
  let ArrayMunicipio = [];
  const ruta = resolve(__dirname, "../documents/mun_estados.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayMunicipio.push(fileContents);

  try {
    const datos = JSON.parse(ArrayMunicipio);
    //console.log(datos);
    let data = datos.filter(({ nombre_municipio }) => nombre_municipio.includes(search.toUpperCase()))
    console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/municipiosdeEstado", (req, res) => {
  //console.log("entre MunicipiosByNombre:");
  const search = req.query.search;
  //console.log("entre MunicipiosByNombre:"+search);
  let ArrayMunicipio = [];
  const ruta = resolve(__dirname, "../documents/mun_estados.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayMunicipio.push(fileContents);

  try {
    const datos = JSON.parse(ArrayMunicipio);
    //console.log(datos);
    let data = datos.filter(({ nombre_estado }) => nombre_estado.includes(search.toUpperCase()))
    // console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
});
route.get("/cucopAll", (req, res) => {
  //console.log("entre cucop si 1:"+req.query.search);

  let ArrayCucop = [];
  const ruta = resolve(__dirname, "../documents/cucop.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayCucop.push(fileContents);

  try {
    const datos = JSON.parse(ArrayCucop);

    let data = datos

    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    console.log("errror cucop" + err);
  }
});
route.get("/cucop", (req, res) => {
  //console.log("entre cucop si 1:"+req.query.search);
  const search = req.query.search;
  let ArrayCucop = [];
  const ruta = resolve(__dirname, "../documents/cucop.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayCucop.push(fileContents);
  // console.log("entre cucop ArrayCucop:"+ArrayCucop);
  try {
    const datos = JSON.parse(ArrayCucop);
    //console.log(datos);
    let data = datos.filter(({ DESCRIPCION }) => DESCRIPCION.includes(search.toUpperCase()))
    ///console.log(data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error("aaa" + err);
    console.log("aaa" + err);
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
    console.log("entre a buscar  search" + search.toUpperCase());
    //console.log(datos);
    let data = datos.filter(({ CLAVECUCoP }) => CLAVECUCoP.includes(search))
    // console.log("daa filter"+data);
    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error("eee" + err);
  }
});
route.get("/esquemaAll", (req, res) => {
  //console.log("entre cucop si 1:"+req.query.search);

  let ArrayEsquema = [];
  const ruta = resolve(__dirname, "../documents/esquemas.json");
  const fileContents = readFileSync(ruta, "utf8");
  ArrayEsquema.push(fileContents);

  try {
    const datos = JSON.parse(ArrayEsquema);

    let data = datos

    return res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
    console.log("error esquemas" + err);
  }
});
export default route;
