import { response } from "express";
import buyers from "../models/buyer/buyer";

const BuyersController = {
  buyer: async (req, res = response) => {
    try {
      const uid = req.uid;
      let ente_id = req.body.ente_id;

      const buyer = new buyers(req.body);
      let rfc = req.body.id.toUpperCase();
      buyer.id = rfc
      buyer.user_id = uid;

      const cp = await buyers.findOne({ ente_id: ente_id });
      if (cp) {
        return res.status(200).json({
          ok: true,
          ente_id: ente_id
        })
      }

      await buyer.save();
      return res.status(200).json({
        ok: true,
        _id: buyer._id,

      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  buyerShow: async (req, res = response) => {
    try {
      const id = req.params.ocid;
      const cp = await buyers
        .findOne({ ente_id: id });
      if (!cp) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        buyers: cp,
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  buyerAll: async (req, res = response) => {
    try {
      const buyer = await buyers.find();
      const total = await buyers.countDocuments();
      res.status(200).json({
        ok: true,
        buyer,
        total,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  buyerAllApi: async (req, res = response) => {
    try {
      const buyer = await buyers.find();
      const total = await buyers.countDocuments();
      res.status(200).json({
        ok: true,
        buyer,
        total,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  buyerUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const buy = await buyers.findOne({ _id: uid });
      if (!buy) {
        return res.status(404).json({
          ok: false,
          msg: "No existe planeación",
        });
      }
      const { ...campos } = req.body;
      //console.log({ ...campos });
      //await plan.save();
      campos.id = req.body.id
      const planUpdated = await buyers.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        buyer: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... comprador no existe",
      });
    }
  },
  buyerShowByUser: async (req, res = response) => {
    try {
      const id = req.uid;
      const cp = await buyers
        .find({ user_id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        buyers: cp
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
};

export default BuyersController;
