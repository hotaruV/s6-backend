import { response } from "express";
import getID from "../helpers/getId";
import items from "../models/items/items";
import valuesItm from "../models/items/unit/values";
import unitItm from "../models/items/unit/unit";
import classification from "../models/items/classification";
import additionalClassifications from "../models/items/additionalClassifications";

const ItemsController = {
  items: async (req, res = response) => {
    try {
      //console.log(req.body);
      const item = new items(req.body);
      let count = await getID(items);
      item.id = count;
      await item.save();
      return res.status(200).json({
        ok: true,
        _id: item._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemsShowAll: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const typeItem = req.query.item;
      const award_id = req.query.award_id;
      let cp;
      let count;
      //switch (typeItem) {
      //case "tender":
      cp = await items.find({ ocid });
      //console.log(cp);
      count = await items.count({
        //$and: [{ typeItem }, { ocid }],
      });
      //break;

      //   //case "award":
      //     cp = await items.find({
      //       $and: [{ typeItem }, { ocid }],
      //       $or: [{ award_id }],
      //     });
      //     count = await items.count({
      //       $and: [{ typeItem }, { ocid }],
      //       $or: [{ award_id }],
      //     });
      //     //break;
      //   //case "contract":
      //     cp = await items.find({
      //       $and: [{ typeItem }, { ocid }],
      //       $or: [{ contract_id: award_id }],
      //     });
      //     count = await items.count({
      //       $and: [{ typeItem }, { ocid }],
      //       $or: [{ contract_id: award_id }],
      //     });
      //     break;
      // }
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        items: cp,
        itemsCount: count,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemsShowID: async (req, res = response) => {
    try {
      let cp;
      let item_id = [];
      const ocid = req.params.ocid;
      let typeItem = req.query.typeItem;
      let award_id = req.query.award_id;
      console.log(req.query);
      switch (typeItem) {
        case "tender":
          cp = await items.find({ ocid });
          cp = await items.find(
            {
              $and: [{ typeItem }, { ocid }],
            });
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          break;

        case "award":
          cp = await items.find({
            //$and: [{ typeItem }, { ocid }],
            $or: [{ ocid }, { award_id: award_id }],
          });
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          //console.log(item_id);
          break;
        case "contract":
          cp = await items.find({
            //$and: [{ typeItem }],
            $or: [{ ocid }, { contract_id: award_id }],
          });
          
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          break;
        /*
        en caso de error 
        cp = await items.find({ ocid });
        cp.forEach((item) => {
          item_id.push(item._id);
        });
        */
      }
      //console.log(item_id);
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      return res.status(200).json({
        item_id: item_id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  itemsShowID2: async (req, res = response) => {
    try {
      let cp;
      let item_id = [];
      const ocid = req.params.ocid;
      let typeItem = req.query.typeItem;
      let award_id = req.query.award_id;
      //console.log(req.query);
      switch (typeItem) {
        case "tender":
          cp = await items.find(
            {
              $and: [{ typeItem }, { ocid }],
            });
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          break;

        case "award":
          cp = await items.find({
            $and: [{ typeItem }, { ocid }],
            $or: [{ award_id }],
          });
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          break;
        case "contract":
          cp = await items.find({
            $and: [{ typeItem }, { ocid }],
            $or: [{ contract_id: award_id }],
          });
          cp.forEach((item) => {
            item_id.push(item._id);
          });
          break;
      }
      //console.log(item_id);
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      return res.status(200).json({
        item_id: item_id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  itemByID: async (req, res = response) => {
    try {

      const cp = await items.findById({ _id: req.params.id });

      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      return res.status(200).json({
        ok: true,
        item: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  itemByContract: async (req, res = response) => {
    try {
      const cp = await items.find({ ocid: req.params.ocid });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      return res.status(200).json({
        items: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemsUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const it = await items.findById(uid);
      if (!it) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el item",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await items.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        items: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... item no existe",
      });
    }
  },
  itemValue: async (req, res = response) => {
    try {
      const val = new valuesItm(req.body);
      let count = await getID(valuesItm);
      val.id = count;
      await val.save();

      return res.status(200).json({
        ok: true,
        _id: val._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemValueShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await valuesItm.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        valuesItm: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemValueUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      //console.log(req.params);
      const mil = await valuesItm.findById(uid);
      if (!mil) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el valor",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await valuesItm.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        itemValue: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... valor no existe",
      });
    }
  },
  itemUnit: async (req, res = response) => {
    try {
      const val = new unitItm(req.body);
      let count = await getID(unitItm);
      val.id = count;
      await val.save();

      return res.status(200).json({
        ok: true,
        _id: val._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemUnitShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await unitItm.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        unitItm: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  itemUnitUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const mil = await unitItm.findById(uid);
      if (!mil) {
        return res.status(404).json({
          ok: false,
          msg: "No existe la unidad",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await unitItm.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        itemUnit: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... unidad no existe",
      });
    }
  },
  classifications: async (req, res = response) => {
    try {
      const classifications = new classification(req.body);
      let count = await getID(classification);
      classifications.id = count;
      await classifications.save();
      return res.status(200).json({
        ok: true,
        _id: classifications._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  classificationsShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await classification.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        classification: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  classificationsUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const mil = await classification.findById(uid);
      if (!mil) {
        return res.status(404).json({
          ok: false,
          msg: "No existe la clasificación",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await classification.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        classifications: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... clasificación no existe",
      });
    }
  },
  additionalClassifications: async (req, res = response) => {
    try {
      const val = new additionalClassifications(req.body);
      let count = await getID(additionalClassifications);
      val.id = count;
      val.scheme = "Catálogo de PyS";
      await val.save();
      return res.status(200).json({
        ok: true,
        _id: val._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  additionalClassificationsShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await additionalClassifications.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        additionalClassifications: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  additionalClassificationsUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const mil = await additionalClassifications.findById(uid);
      if (!mil) {
        return res.status(404).json({
          ok: false,
          msg: "No existe la clasificación",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await additionalClassifications.findByIdAndUpdate(
        uid,
        campos,
        {
          new: true,
        }
      );

      res.status(200).json({
        ok: true,
        additionalClassifications: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... clasificación no existe",
      });
    }
  },

  itemDelete: async (req, res = response) => {
    try {
      const { _id, ocid } = req.params;
      const item = await items.findById(_id);
      if (item) {
        await valuesItm.deleteOne({ _id: { $in: item.unit.values._id } });
        await unitItm.deleteOne({ _id: { $in: item.unit._id } });
        await classification.deleteOne({
          _id: { $in: item.classification._id },
        });
        await items.deleteOne({ _id: { $in: item._id } });
      }
      return res.status(200).json({
        ok: true,
        msg: "Borrado con Exito",
      });
    } catch (error) {
      return res.status(401).json({
        ok: false,
        msg: "Error no se encontro item",
      });
    }
  },
};

module.exports = ItemsController;
