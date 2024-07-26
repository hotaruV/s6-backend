import response from "express";
import Entes from "../models/entes";


const enteController = {
  getEnte: async (req, res) => {

    try {
      const ente = await Entes.find();
      const total = await Entes.countDocuments();
      res.status(200).json({
        ok: true,
        entes,
        total,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  getDataEnte: async (req, res) => {
    try {
      const uid = req.uid;
      //console.log(req.uid);
      const enteDB = await Entes.findOne({ _id: uid });
      if (!enteDB) {
        return res.status(404).json({
          ok: false,
          msg: "No existe ente",
        });
      } else {
        return res.status(200).json({
          ok: true,
          ente: enteDB,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... ente no existe",
      });
    }
  },

  createEnte: async (req, res = response) => {
    console.log("funcion_crear EntesController" + req.body);
    try {
      //console.log(req.body.rfc);
      //const { ente, siglas, estado,municipio } = req.body;



      //const entes = new Entes({ ...req.body, userName });

      //entes.id_usuario = 1;
      //await entes.save();
      //const token = await JWTgenerate(entes.id);
      //  res.status(200).json({
      // ok: true,
      //   entes,
      //  token,
      //  });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... revisar logs",
        error: error,
      });
    }
  },


};

module.exports = enteController;