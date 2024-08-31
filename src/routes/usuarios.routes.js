import usuarioController from "../Controllers/UsuarioController.js";
import { Router } from "express";
import { check } from "express-validator";
import { validarcampos } from "../middlewares/validar-campos";
import { validarJWT } from "../middlewares/validar-jwt";
import { isAdminRole } from "../middlewares/validar-roles";

const route = Router();

/**********************USUARIOS ********************* */

/**
 * @swagger
 * /api/seaslp/users/usr:
 *   get:
 *     summary: Obtener información del usuario
 *     description: Obtiene información del usuario autenticado
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *       401:
 *         description: Acceso no autorizado
 */

route.get("/usr", validarJWT, usuarioController.getUser);
/**
 * @swagger
 * /api/seaslp/users/register:
 *   post:
 *     summary: Registrar nuevo usuario (requiere roles de administrador)
 *     description: Registra un nuevo usuario. Requiere roles de administrador.
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     requestBody:
 *       description: Datos del usuario a registrar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               rfc:
 *                 type: string
 *             example:
 *               nombres: Usuario Ejemplo
 *               email: usuario@example.com
 *               rfc: RFC123456
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       401:
 *         description: Acceso no autorizado
 *       422:
 *         description: Error en validación de campos
 */
route.post("/register", [
  check("nombres", "El Campo Nombre(s) es Obligatorio").not().isEmpty(),
  check("email", "El email es Obligatorio").isEmail(),
  check("rfc", "El Campo RFC es Obligatorio").not().isEmpty(),
  validarcampos,
  validarJWT,
  isAdminRole,
], usuarioController.createUsers);

/**
 * @swagger
 * /api/seaslp/users/id:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     description: Obtiene los datos del usuario autenticado
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos exitosamente
 *       401:
 *         description: Acceso no autorizado
 */
route.get("/id", [validarJWT], usuarioController.getDataUser);

/**
 * @swagger
 * /api/seaslp/users/buscar/{id}:
 *   put:
 *     summary: Actualizar información del usuario
 *     description: Actualiza la información del usuario. Requiere roles de administrador.
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos del usuario a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               rfc:
 *                 type: string
 *             example:
 *               nombres: Usuario Modificado
 *               email: usuario@modificado.com
 *               rfc: RFC654321
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: Acceso no autorizado
 *       422:
 *         description: Error en validación de campos
 */

route.put(
  "/buscar/:id",
  [
    validarJWT,
    check("nombres", "El Campo Nombre(s) es Obligatorio").not().isEmpty(),
    check("email", "El email es Obligatorio").isEmail(),
    check("rfc", "El Campo RFC es Obligatorio").not().isEmpty(),
    validarcampos,
  ],
  usuarioController.updateUser
);
/**
 * @swagger
 * /api/seaslp/users/{id}:
 *   put:
 *     summary: Actualizar información del usuario autenticado
 *     description: Actualiza la información del usuario autenticado
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario autenticado
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos del usuario a actualizar
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               rfc:
 *                 type: string
 *             example:
 *               nombres: Usuario Modificado
 *               email: usuario@modificado.com
 *               rfc: RFC654321
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: Acceso no autorizado
 *       422:
 *         description: Error en validación de campos
 */
route.put("/:id", validarJWT, usuarioController.updateUser);
/**
 * @swagger
 * /api/seaslp/users/create_admin_sea:
 *   post:
 *     summary: Crear usuario administrador para SEA
 *     description: Crea un usuario administrador para el Sistema de Estatal Anticorrupción (SEA)
  *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     requestBody:
 *       description: Datos del usuario administrador a crear
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               email:
 *                 type: string
 *               rfc:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               nombres: Administrador SEA
 *               email: admin@sea.com
 *               rfc: RFCSEA123
 *               password: admin123
 *     responses:
 *       201:
 *         description: Usuario administrador creado exitosamente
 *       422:
 *         description: Error en validación de campos
 */

route.post("/create_admin_sea", usuarioController.createAdminUser);

/**
 * @swagger
 * /api/seaslp/users/reset_password/{id}:
 *   put:
 *     summary: Reiniciar contraseña de un usuario
 *     description: Reinicia la contraseña de un usuario por su ID. Requiere roles de administrador.
 *     tags: 
 *       - Operaciones relacionadas con usuarios
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a reiniciar contraseña
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contraseña reiniciada exitosamente
 *       401:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 */
route.put("/reset_password/:id", [validarJWT], usuarioController.resetPasswordUser);
/**
* @swagger
* /api/seaslp/users/buscar-uno/{id}:
*   get:
*     summary: Obtener información de un usuario
*     description: Obtiene la información de un usuario por su ID
*     tags: 
*       - Operaciones relacionadas con usuarios
*     security:
*       - JWT: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID del usuario a obtener
*         schema:
*           type: string
*     responses:
*       200:
*         description: Información del usuario obtenida exitosamente
*       401:
*         description: Acceso no autorizado
*       404:
*         description: Usuario no encontrado
*/

route.get("/buscar-uno/:id", [validarJWT], usuarioController.getOneUser);
route.put("/deleteUsuario/:id", validarJWT, usuarioController.deleteUsuario);

/*********** ENTE****************** */

route.get("/buscar-unoente/:id", [validarJWT], usuarioController.getOneEnte);
route.put("/UpdateEntesURoute/:id", validarJWT, usuarioController.updateEnte);
route.get("/updateStatusEnte/:id", validarJWT, usuarioController.updateEnteStatus);
route.put("/deleteentes/:id", validarJWT, usuarioController.deleteEnte);
route.post("/registerEnte", [
  check("ente", "El Campo Ente es Obligatorio").not().isEmpty(),
  check("siglas", "El Campo siglas es Obligatorio").not().isEmpty(),
  check("estado", "El Campo estado es Obligatorio").not().isEmpty(),
  check("municipio", "El Campo municipio es Obligatorio").not().isEmpty(),
  validarcampos, validarJWT,], isAdminRole, usuarioController.createEnte);

route.post("/UpdateEntesbyEnte", validarJWT, usuarioController.updateEntebyEnte);
route.get("/entes", validarJWT, usuarioController.getE);
route.get("/entes-form", validarJWT, usuarioController.getEnteForm);

route.get("/Listaentes/:search", [validarJWT], usuarioController.getEntes);

/***********SERVIDOR ENTE****************** */

route.get("/serv", validarJWT, usuarioController.getServidor);
route.post("/registerServidorEnte", [validarJWT], usuarioController.createServidorEnte);
route.get("/serv/:id", [validarJWT], usuarioController.getServidores);
route.get("/buscar-unoServidor/:id", [validarJWT], usuarioController.getOneServidor);
route.put("/UpdateServidor/:id", validarJWT, usuarioController.updateServidor);
route.put("/deleteServidor/:id", validarJWT, usuarioController.deleteServidor);
route.get("/ServidorRequirientes/:id", [validarJWT], usuarioController.getServidorEnteReq);
route.get("/ServidorContratante/:id", [validarJWT], usuarioController.getServidorEnteCont);
route.get("/ServidorResponsable/:id", [validarJWT], usuarioController.getServidorEnteRes);
/***********PROVEEDORES ENTE****************** */
route.post("/registrarProveedores", [validarJWT], usuarioController.createProveedores);
route.get("/prov/:id", [validarJWT], usuarioController.getProveedores);
route.get("/buscar-unoProveedor/:id", [validarJWT], usuarioController.getOneProveedor);
route.put("/UpdateProveedor/:id", validarJWT, usuarioController.updateProveedor);
route.put("/deleteProveedor/:id", validarJWT, usuarioController.deleteProveedor);


module.exports = route;
