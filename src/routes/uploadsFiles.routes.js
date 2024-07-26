import Router from 'express';
import { validarJWT } from '../middlewares/validar-jwt';

import UploadController from '../Controllers/UploadFilesController';
import E_fileUpload from 'express-fileupload';
const rout = Router();

rout.use(E_fileUpload());


rout.put('/:tipo/:id', validarJWT, UploadController.fileUpload)
rout.get('/:tipo/:foto', validarJWT, UploadController.getImages)
module.exports = rout;