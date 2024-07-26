import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';
import BusquedaController from '../controllers/BusquedaController';
const rout = Router();

rout.get('/:busqueda', validarJWT, BusquedaController.buscarTodo)
rout.get('/coleccion/:tabla/:busqueda', validarJWT, BusquedaController.buscarDocumentos)



module.exports = rout;