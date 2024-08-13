import { response } from "express";
import contractPeriod from "../models/award/contractPeriod";
import suppliers from "../models/award/suppliers";
import value from "../models/award/value";
import Award from "../models/award/awards";
import getID from "../helpers/getId";
import Items from "../models/items/items";
import Documents from "../models/documents/documents";
import ItemValue from "../models/items/unit/values";
import Classifications from "../models/items/classification";
import Unit from "../models/items/unit/unit";
import itemAw from "../models/award/itemaw";

const AwardsController = {
  contractPeriod: async (req, res = response) => {
    try {
      const contract = new contractPeriod(req.body);
      let fecha_fin = new Date(req.body.endDate).toDateString();
      let fecha_inicio = new Date(req.body.startDate).toDateString();

      if (fecha_inicio < fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "Fecha final no debe se menor a la fecha de inicio",
        });
      }

      await contract.save();
      return res.status(200).json({
        ok: true,
        _id: contract._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contractPeriodShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await contractPeriod.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contractPeriod: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contractPeriodUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const id = await contractPeriod.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe periodo de contrato",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await contractPeriod.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        contractPeriod: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... periodo de contrato no existe",
      });
    }
  },
  suppliers: async (req, res = response) => {
    try {
      const data = req.body;
      const award_id = req.query.award_id;
      const ocid = req.params.ocid;
      let datos = {};
      let supplier = {};
      let _id;
      data.forEach((res) => {
        datos = {
          name: res.name,
          id: `MX-RFC-${res.id}`,
          ocid,
          award_id,
        };
        //console.log(datos);
        supplier = new suppliers(datos);
        supplier.save();
      });

      return res.status(200).json({
        ok: true,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  suppliersData: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const cp = await suppliers.find({ ocid });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        suppliers: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  suppliersOCID: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const award_id = req.query.award_id;
      const supID = [];
      const cp = await suppliers.find({
        $and: [{ ocid }, { award_id }],
      });
      cp.forEach(({ _id }) => {
        supID.push(_id);
      });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        suppliers_id: supID,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  suppliersID: async (req, res = response) => {
    try {
      const id = req.params.id;
      const award_id = req.query.award_id;
      const supID = [];
      const cp = await suppliers.find({
        $and: [{ id }, { award_id }],
      });
      cp.forEach(({ _id }) => {
        supID.push(_id);
      });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        suppliers_id: supID,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  suppliersUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const id = await suppliers.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe proveedor",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await suppliers.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        suppliers: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... proveedor no existe",
      });
    }
  },
  value: async (req, res = response) => {
    try {
      const val = new value(req.body);
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
  valueUpdate: async (req, res = response) => {
    try {
      //console.log(req.body)
      const uid = req.params.id;
      const id = await value.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe valor",
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
  awardsCreate: async (req, res = response) => {
    console.log("Entre a awardsCreate de awardsCOntroller" );
    let activo;
        //construir todos los guardados
    const id = req.body.id;
    const title = req.body.title.toUpperCase();
    const description = req.body.description.toUpperCase();
    const status = req.body.status;
    const date = req.body.date;
    const rationale = req.body.rationale.toUpperCase();
    const amendmentsdate = req.body.amendmentsdate;
    const mendmentsrationale = req.body.mendmentsrationale;
    const amendmentsid = req.body.amendmentsid;
    const amendmentsdescription = req.body.amendmentsdescription;
    const amendsReleaseID = req.body.amendsReleaseID;
    const releaseID = req.body.releaseID;


    try {
      // const aw = new Award(req.body);
      // let date = new Date().toDateString();
      // let count = await getID(Award);
      // aw.date = date;
      // aw.id = `000${count}-award`;
      // await aw.save();
      let count = await getID(Award);

      const _value = req.body.value;
      const value_= new value();
     
      value_.id=`000${count}-award`;//req.body.id;
      value_.amount=_value.amount;
      value_.currency=_value.currency;
      value_.ocid=req.body.id;
      value_.save();

      const suppliers_=new suppliers ();

      suppliers_.id= req.body.suppliers.id;//`000${count}-award`;//req.body.suppliers.id;
      suppliers_.name= req.body.suppliers.name;
      suppliers_.ocid= req.body.id;
      suppliers_.save();

      //items
      const array_item = [];
      const items = req.body.items.items;
      console.log("items" +items);
      items.forEach(element => {

      const item= new Items();
      item.id='item-'+element.id;
      item.typeItem='awards-adjudicados';
      item.title=element.title;
      item.description=element.description;
  
      const _classification = element.classification;
      const classification= new Classifications();
      classification.id=_classification.id;
      classification.scheme=_classification.scheme;
      classification.description=_classification.description;
      classification.uri=_classification.uri;
      classification.ocid=req.body.id;
      classification.save();
      
      item.classification=classification._id;
  
      const _value1 = element.unit.value;
      const value= new ItemValue();
      value.id=classification.id;
      value.amount=_value1.amount;
      value.currency=_value1.currency;
      value.ocid=req.body.id;
      value.save();

      const _unit = element.unit;
      const unit= new Unit();
      unit.id=classification.id;
      unit.numreq=_unit.numreq;
      unit.scheme=_unit.scheme;
      unit.name=_unit.name;
      unit.valor=_unit.valor;
      unit.values=value;
      unit.uri=_unit.uri;
      unit.ocid=req.body.id;
      unit.save();

      item.unit=unit;
      item.quantity=element.quantity;
  
      item.save();

      array_item.push(item._id);
      //end items
    });
    console.log("items" +items);
      const _itemAw=new itemAw ();
      _itemAw.id=req.body.items.itemid;
      _itemAw.description=req.body.items.itemdescription;
      _itemAw.items=array_item;
      _itemAw.ocid= req.body.id;
      _itemAw.save();
    
      const periodo=new contractPeriod();
      periodo.id= count;//req.body.suppliers.id;
      periodo.startDate=req.body.contractPeriod.startDate;
      periodo.endDate=req.body.contractPeriod.endDate;
      periodo.maxExtentDate=req.body.contractPeriod.maxExtentDate;
      periodo.durationInDays=req.body.contractPeriod.durationInDays;
      periodo.ocid= req.body.id;
      periodo.save();

      //documents
   const docs = req.body.documents;
   console.log("docs" +docs);
   const arraydocs = [];

   docs.forEach(element => {
    const documents_ = new Documents();
    
    documents_.id=element.id;
    documents_.title=element.title;
    documents_.Type=element.Type;
    documents_.description=element.description;
    documents_.url=element.url;
    documents_.format=element.format;
    documents_.language=element.language;
    documents_.datePublished=element.datePublished;
    documents_.dateModified=element.dateModified;

    documents_.save();
    arraydocs.push(documents_._id);
    
  });
   //enddocuments

      const AwardCount = await Award.find({ id }).count();
      console.log("Entre a AwardCount " +AwardCount);
      if (AwardCount != 1) {
       
         const _Award = new Award({ ...req.body });

         _Award.id =`000${count}-award`;//id;
         _Award.title=title,
         _Award.ocid =id;
         _Award.description=description,
         _Award.status=status,
         _Award.date=date,
         _Award.rationale= rationale;
         _Award.value=value_._id;
         _Award.suppliers=suppliers_._id;
         _Award.items=_itemAw._id;
         _Award.contractPeriod=periodo._id;
         _Award.documents=arraydocs;
         _Award.amendmentsdate = amendmentsdate;
         _Award.amendmentsrationale =mendmentsrationale;
         _Award.amendmentsid = amendmentsid;
         _Award.amendmentsdescription = amendmentsdescription;
         _Award.amendsReleaseID = amendsReleaseID;
         _Award.releaseID = releaseID;
         _Award.save();
         console.log("Entre a AwardCount "+_Award._id );
      return res.status(200).json({
        ok: true,
        _id: _Award._id,
      });
    } else {// es para editar
      return res.status(200).json({
        ok: false,
        msg: "No se puede insertar más de una adjudicación",
      });
    }
  } catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "Error en servidor por favor comunicarse con administración",
    });
  }
  },
  awardsShow: async (req, res = response) => {
    try {
      let awards_id = [];
      const ocid = req.params.ocid;
      const aw = await Award.find({ ocid });
      aw.forEach(({ _id }) => {
        awards_id.push(_id);
      });
      if (!aw) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        awards_id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  awardsAll: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;

      const awards = await Award.find({ ocid });

      if (!awards) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        awards,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  awardsbyId: async (req, res = response) => {
    try {
      
      const _id = req.params.id

      const awards = await Award.findById(_id);
      //console.log(awards);

      if (!awards) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        awards,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  

  awardsOCID: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const awardID = [];
      const awards = await Award.find({ ocid });
      awards.forEach((element) => {
        awardID.push(element._id);
      });

      if (!awards) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        awardID,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  awardsUpdate: async (req, res = response) => {
    try {
      const id = req.params.id;
      const adw = await Award.findById({ _id: id });
      if (!adw) {
        return res.status(404).json({
          ok: false,
          msg: "No existe adjudicación",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await Award.findByIdAndUpdate(id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        award: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... adjudicación no existe",
      });
    }
  },

  awardsUpdateMain: async (req, res = response) => {
    try {
      //onsole.log(req.body);
      const id = req.params.id;
      const adw = await Award.findById({ _id: id });
      if (!adw) {
        return res.status(404).json({
          ok: false,
          msg: "No existe adjudicación",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await Award.findByIdAndUpdate(id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        award: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... adjudicación no existe",
      });
    }
  },



  awardsDelete: async (req, res = response) => {
    const id = req.params.id;
    const ItemsArr = [];
    const awd = await Award.findById({ _id: id });

    if (awd) {
      await value.deleteOne({ _id: { $in: awd.value._id } });

      //await Items.deleteMany({ _id: { $in: awd.items } });
      await suppliers.deleteMany({ _id: { $in: awd.suppliers } });
      await contractPeriod.deleteOne({ _id: { $in: awd.contractPeriod } });
      await Documents.deleteMany({ _id: { $in: awd.documents } });
      await Award.deleteOne({ _id: { $in: awd } }).populate();
      
    }



    return res.status(200).json({
      ok: true,
      msg: "Borrado con Exito",
    });
  },
};

module.exports = AwardsController;
