import EntesController from "../Controllers/EntesController.js";
import { Router } from "express";
import { check } from "express-validator";
import { validarcampos } from "../middlewares/validar-campos";
import { validarJWT } from "../middlewares/validar-jwt";
import { isAdminRole } from "../middlewares/validar-roles";

const route = Router();


/**
 * @swagger
 * /api/seaslp/ente/register:
 *   post:
 *     summary: Registrar nuevo ente (requiere roles de administrador)
 *     description: Registra un nuevo ente. Requiere roles de administrador.
 *     tags: 
 *       - Operaciones relacionadas con ente
 *     security:
 *       - JWT: []
 *     requestBody:
 *       description: Datos del ente a registrar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_ente:
 *                 type: string
 *               siglas_ente:
 *                 type: string
 *               estado_ente:
 *                 type: string
 *               municipio_ente:
 *                 type: string
 *             example:
 *               nombre_ente: COMISION ESTATAL DEL AGUA
 *               siglas: PE018
 *               estado_ente: 24
 *               municipio_ente: 028
 *     responses:
 *       201:
 *         description: Ente registrado exitosamente
 *       401:
 *         description: Acceso no autorizado
 *       422:
 *         description: Error en validación de campos
 */
route.post("/registerEnte", EntesController.createEnte);

  module.exports = route;
