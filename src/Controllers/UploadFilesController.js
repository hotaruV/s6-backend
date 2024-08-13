import response from "express";
import { uuidv4} from ('uuid');
import { actualizarImagen } from '../helpers/actualizarImagen';
import path from 'path';
import fs from 'fs';

const UploadController = {
    fileUpload: async(req, res = response) => {
        try{
        const tipo = req.params.tipo;
        const id = req.params.id;

        const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: "parametro de salida invalido"
            })
        }
        //validad archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No Hay archivos'
            });
        }
        //procesar imagen...
        const file = req.files.imagen;
        const shotName = file.name.split('.');
        const extension = shotName[shotName.length - 1]

        //validar extension
        const validas = ['jpg', 'png', 'jpeg', 'gif']
        if (!validas.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: 'Archivo no valido, este debe ser una imagen'
            });
        }

        // Generar nombre del archivo 

        const nameFile = `${uuidv4()}.${extension}`;

        //path generar imagen
        const path = `./src/uploads/${tipo}/${nameFile}`;
        //console.log(path);
        //mover imagen
        file.mv(path, (err) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    msg: "Error al mover imagen"
                });

            //actualizar Imaagen
            actualizarImagen(tipo, id, nameFile)
            res.status(200).json({
                ok: true,
                msg: "Archivo subido exitosamente",
                nameFile
            })
        });
    } catch (error) {
        return res.status(404).json({
          ok: false,
        });
      }
    },
    getImages: async(req, res = response) => {
        try{
        const tipo = req.params.tipo
        const foto = req.params.foto
        const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

        if (fs.existsSync(pathImg)) {
            res.sendFile(pathImg)
        } else {
            const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
            res.sendFile(pathImg)
        }

    } catch (error) {
        return res.status(404).json({
          ok: false,
        });
      }
        /*
        Client ID
        128905102745-sg1o74sf0veu04ganlessh92ggli3b3m.apps.googleusercontent.com
        Secret ID
        4TWPy8IfbIfFMv_zehnZvi2y
        */

    }
}

module.exports = UploadController;