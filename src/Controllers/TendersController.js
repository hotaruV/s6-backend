import response from "express";
import procuringEntity from "../models/tenders/procuringEntity";
import tenderPeriod from "../models/tenders/tenderPeriod";
import awardPeriod from "../models/tenders/awardPeriod";
import enquiryPeriod from "../models/tenders/enquiryPeriod";
import value from "../models/tenders/value";
import minValue from "../models/tenders/minValue";
import tenders from "../models/tenders/tenders";

import officials from "../models/tenders/officials";
import attendees from "../models/tenders/attendees";
import clarificationMeetings from "../models/tenders/clarificationMeetings";

import getID from "../helpers/getId";


import Items from "../models/items/items";
import Classifications from "../models/items/classification";
import additionalClassifications from "../models/items/additionalClassifications";
import ItemValue from "../models/items/unit/values";
import Unit from "../models/items/unit/unit";
import deliveryLocation from "../models/contracts/deliveryLocation";
import deliveryAddress from "../models/contracts/deliveryAddress";
import itemcontratados from "../models/contracts/itemcontratados";
import valueS from "../models/contracts/value";
import amendmentsCont from "../models/contracts/amendments";
import Documents from "../models/documents/documents";
import milestones from "../models/documents/milestones";
const TendersController = {
  tendersCreate: async (req, res = response) => {

  },
  procuringEntity: async (req, res = response) => {
    try {
      const Procuring = new procuringEntity(req.body);
      await Procuring.save();
      return res.status(200).json({
        ok: true,
        _id: Procuring._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  value: async (req, res = response) => {
    try {
      const val = new value(req.body);
      let count = await getID(value);
      val.id = count;
      await val.save();

      return res.status(200).json({
        ok: true,
        _id: val._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  minValue: async (req, res = response) => {
    try {
      const val = new minValue(req.body);
      let count = await getID(minValue);
      val.id = count;
      await val.save();

      return res.status(200).json({
        ok: true,
        _id: val._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  procuringEntityShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await procuringEntity.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        procuringEntity: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  valueShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await value.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        value: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  minValueShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await minValue.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        minValue: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  procuringEntityUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await procuringEntity.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe entidad contratante",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await procuringEntity.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        procuringEntity: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... entidad contratante no existe",
      });
    }
  },
  valueUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await value.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el valor",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await value.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        value: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... valor no existe",
      });
    }
  },
  minValueUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await minValue.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el valor mínimo",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await minValue.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        minValue: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... valor mínimo no existe",
      });
    }
  },
  tenderPeriod: async (req, res = response) => {
    try {
      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }

      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);
      const Period = new tenderPeriod(req.body);
      Period.durationInDays = period;
      let count = await getID(tenderPeriod);
      Period.id = count;
      await Period.save();

      return res.status(200).json({
        ok: true,
        _id: Period._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  awardPeriod: async (req, res = response) => {
    try {
      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }

      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);
      const PeriodAw = new awardPeriod(req.body);
      PeriodAw.durationInDays = period;
      let count = await getID(awardPeriod);
      PeriodAw.id = count;
      await PeriodAw.save();

      return res.status(200).json({
        ok: true,
        _id: PeriodAw._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  enquiryPeriod: async (req, res = response) => {
    try {
      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }

      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);
      const Period = new enquiryPeriod(req.body);
      let count = await getID(enquiryPeriod);

      Period.durationInDays = period;
      Period.id = count;
      //console.log(count);
      await Period.save();

      return res.status(200).json({
        ok: true,
        _id: Period._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  tenderPeriodShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await tenderPeriod.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        tenderPeriod: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  tenderPeriodUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await tenderPeriod.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe periodo de licitación",
        });
      }

      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }
      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);


      const campos = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        maxExtentDate: req.body.maxExtentDate,
        ocid: req.body.ocid,
        durationInDays: period
      }

      const planUpdated = await tenderPeriod.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        tenderPeriod: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... periodo de licitacion no existe",
      });
    }
  },
  awardPeriodShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await awardPeriod.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        awardPeriod: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  awardPeriodUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await awardPeriod.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el periodo de adjudicacion",
        });
      }
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe periodo de licitación",
        });
      }

      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }
      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);


      const campos = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        maxExtentDate: req.body.maxExtentDate,
        ocid: req.body.ocid,
        durationInDays: period
      }

      const planUpdated = await awardPeriod.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        awardPeriod: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... periodo de adjudicacion no existe",
      });
    }
  },
  enquiryPeriodShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await enquiryPeriod.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        enquiryPeriod: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  enquiryPeriodUpdate: async (req, res = response) => {
    try {
      const uid = req.params.get;
      const id = await enquiryPeriod.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el periodo de aclaraciones",
        });
      }
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe periodo de licitación",
        });
      }

      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }
      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);


      const campos = {
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        maxExtentDate: req.body.maxExtentDate,
        ocid: req.body.ocid,
        durationInDays: period
      }
      const planUpdated = await enquiryPeriod.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        enquiryPeriod: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... periodo de aclaraciones no existe",
      });
    }
  },

  tendersShow: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const tender = await tenders
        .findOne({ ocid })
        .populate("minValue", "-__v")
        .populate("value", "-__v")
        .populate("procuringEntity", "name")
        .populate("tenderPeriod", "-__v")
        .populate("awardPeriod", "-__v")
        .populate("enquiryPeriod", "-__v");
      if (!tender) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        tender: {
          _id: tender._id,
          title: tender.title,
          description: tender.description,
          status: tender.status,
          items: tender.items,
          minValue: tender.minValue,
          value: tender.value,
          procurementMethod: tender.procurementMethod,
          procurementMethodRationale: tender.procurementMethodRationale,
          awardCriteria: tender.awardCriteria,
          awardCriteriaDetails: tender.awardCriteriaDetails,
          submissionMethodDetails: tender.submissionMethodDetails,
          enquiryPeriod: tender.enquiryPeriod,
          hasEnquiries: tender.hasEnquiries,
          tenderPeriod: tender.tenderPeriod,
          awardPeriod: tender.awardPeriod,
          procuringEntity: tender.procuringEntity,
          documents: tender.documents,
          numberOfTenderers: tender.numberOfTenderers,
          procurementMethodDetails: tender.procurementMethodDetails,
          submissionMethod: tender.submissionMethod
        },
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  tendersUpdate: async (req, res = response) => {
    //console.log(req.body);
    try {
      const ocid = req.body.ocid
      const tender = await tenders.findOne({ ocid });
      //console.log(tender);
      if (!tender) {
        return res.status(404).json({
          ok: false,
          msg: "No existe licitación",
        });
      }
      const { ...campos } = req.body;
      //console.log(campos);
      const planUpdated = await tenders.findByIdAndUpdate(tender._id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        tenders: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... licitación no existe",
      });
    }
  },
  getDataTenders: async (req, res = response) => {
    //console.log(req.params);
    let ocid = req.params.ocid;
    //console.log(ocid);
    try {
      // falta items

      // const proc = await procuringEntity.findOne({ ocid });
      // const val = await value.findOne({ ocid });
      // const minVal = await minValue.findOne({ ocid });
      // const tenderP = await tenderPeriod.findOne({ ocid });
      // const enquiryP = await enquiryPeriod.findOne({ ocid });
      // const awardP = await awardPeriod.findOne({ ocid });
      // return res.status(200).json({
      //   procuringEntity_id: proc._id,
      //   value_id: val._id,
      //   minValue_id: minVal._id,
      //   tenderPreiod_id: tenderP._id,
      //   enquiryPeriod_id: enquiryP._id,
      //   awardPeriod_id: awardP._id,
      // });
      const tender = await tenders.findOne({ ocid });

      return res.status(200).json({
        ok: true,
        tender
      });
    } catch (error) {
      return res.status(200).json({
        msj: "No se encontraron datos",
        ok: false,
      });
    }
  },
  deleteTender: async (req, res = response) => {

  }


};

module.exports = TendersController;
