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
import actor from "../models/planning/actor";

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
        startDate :  req.body.startDate,
        endDate:  req.body.endDate,
        maxExtentDate:  req.body.maxExtentDate,
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
        startDate :  req.body.startDate,
        endDate:  req.body.endDate,
        maxExtentDate:  req.body.maxExtentDate,
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
        startDate :  req.body.startDate,
        endDate:  req.body.endDate,
        maxExtentDate:  req.body.maxExtentDate,
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
  tendersCreate: async (req, res = response) => {
    console.log("Entre a tendersCreate de tendersCOntroller" );
    let count = await getID(tenders);
    const tenderers = new actor();
    const procuringid = req.body.procuringEntity.id;
    const procuringname = req.body.procuringEntity.name;
    const procuringidentificador = req.body.procuringEntity.rfc;
    tenderers.id= procuringid;
    tenderers.name= procuringname;
    tenderers.identificador=procuringidentificador;
    tenderers.type= 'tender';
    tenderers.save();

   //items
   const array_item = [];
   const items = req.body.items.items;
   
   items.forEach(element => {

   const item= new Items();
  
   item.id='item-'+element.id;
   item.typeItem='contract-contratados';
   item.title=element.title;
   item.description=element.description;

   const _classification = element.classification;
   console.log("items" +_classification);
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

  });
  //end items

   const _deliveryLocation = req.body.items.deliveryLocation;
   const deliveryLocation_= new deliveryLocation();
  
   deliveryLocation_.id=`000${count}-tender`;//req.body.id;
   deliveryLocation_.ocid=req.body.id;
   deliveryLocation_.type=_deliveryLocation.geometrytype;
   deliveryLocation_.coordinates=_deliveryLocation.geometrycoordinates;
   deliveryLocation_.scheme=_deliveryLocation.gazetteerscheme;
   deliveryLocation_.identifiers=_deliveryLocation.gazetteeridentifiers;
   deliveryLocation_.description=_deliveryLocation.gazetteerdescription;
   deliveryLocation_.uri=_deliveryLocation.gazetteeruri;

   deliveryLocation_.save();
  
   const _deliveryAddress = req.body.items.deliveryAddress;
   const deliveryAddress_= new deliveryAddress();
  
   deliveryAddress_.id=`000${count}-tender`;//req.body.id;
   deliveryAddress_.ocid=req.body.id;
   deliveryAddress_.lugar=_deliveryAddress.lugar;
   deliveryAddress_.street=_deliveryAddress.street;
   deliveryAddress_.numero=_deliveryAddress.numero;
   deliveryAddress_.streetAddress=_deliveryAddress.streetAddress;
   deliveryAddress_.locality=_deliveryAddress.locality;
   deliveryAddress_.region=_deliveryAddress.region;
   deliveryAddress_.postalCode=_deliveryAddress.postalCode;
   deliveryAddress_.countryName=_deliveryAddress.countryName;

   deliveryAddress_.save();

  
   const itemCont_= new itemcontratados();
  
   itemCont_.id=`000${count}-tender`;//req.body.id;
   itemCont_.ocid=req.body.id;
   itemCont_.items=array_item;
   itemCont_.deliveryLocation=deliveryLocation_._id;
   itemCont_.deliveryAddress=deliveryAddress_._id;

   itemCont_.save();

   const _tenderValue = req.body.value;
   const tenderValue_= new valueS();
  
   tenderValue_.id=`000${count}-tender`;//req.body.id;
   tenderValue_.amount=_tenderValue.amount;
   tenderValue_.currency=_tenderValue.currency;
   tenderValue_.ocid=req.body.id;
   tenderValue_.save();

   const _minValue = req.body.minValue;
   const minValue_= new valueS();
  
   minValue_.id=`000${count}-tender`;//req.body.id;
   minValue_.amount=_minValue.amount;
   minValue_.currency=_minValue.currency;
   minValue_.ocid=req.body.id;
   minValue_.save();

   const periodoLicitacion=new tenderPeriod();
   periodoLicitacion.id= count;//req.body.suppliers.id;
   periodoLicitacion.startDate=req.body.tenderPeriod.startDate;
   periodoLicitacion.endDate=req.body.tenderPeriod.endDate;
   periodoLicitacion.maxExtentDate=req.body.tenderPeriod.maxExtentDate;
   periodoLicitacion.durationInDays=req.body.tenderPeriod.durationInDays;
   periodoLicitacion.ocid= req.body.id;
   periodoLicitacion.save();

   const periodoSol=new tenderPeriod();
   periodoSol.id= count;//req.body.suppliers.id;
   periodoSol.startDate=req.body.enquiryPeriod.startDate;
   periodoSol.endDate=req.body.enquiryPeriod.endDate;
   periodoSol.maxExtentDate=req.body.enquiryPeriod.maxExtentDate;
   periodoSol.durationInDays=req.body.enquiryPeriod.durationInDays;
   periodoSol.ocid= req.body.id;
   periodoSol.save();

   const attendees_=new attendees ();

   attendees_.id= req.body.clarificationMeetings.officials.id;//`000${count}-award`;//req.body.suppliers.id;
   attendees_.name= req.body.clarificationMeetings.officials.name;
   attendees_.ocid= req.body.id;
   attendees_.identificador=req.body.clarificationMeetings.officials.identificador;
   attendees_.save();


      const officials_=new officials ();

      officials_.id= req.body.clarificationMeetings.officials.id;//`000${count}-award`;//req.body.suppliers.id;
      officials_.name= req.body.clarificationMeetings.officials.name;
      officials_.ocid= req.body.id;
      officials_.identificador=req.body.clarificationMeetings.officials.identificador;
      officials_.save();


   const _clarificationMeetingsValue = req.body.clarificationMeetings;
   const _clarificationMeetings=new clarificationMeetings();
   _clarificationMeetings.id= _clarificationMeetingsValue.id;//req.body.suppliers.id;
   _clarificationMeetings.ocid= req.body.id;
   _clarificationMeetings.date=_clarificationMeetingsValue.date;
  
   _clarificationMeetings.attendees_=attendees_._id;
   _clarificationMeetings.durationInDays=officials_._id;

   _clarificationMeetings.save();
   const arrayclarificationMeetings = [];

   
   arrayclarificationMeetings.push(_clarificationMeetings._id);

   const periodoAdjudicacion=new tenderPeriod();
   periodoAdjudicacion.id= count;//req.body.suppliers.id;
   periodoAdjudicacion.startDate=req.body.awardPeriod.startDate;
   periodoAdjudicacion.endDate=req.body.awardPeriod.endDate;
   periodoAdjudicacion.maxExtentDate=req.body.awardPeriod.maxExtentDate;
   periodoAdjudicacion.durationInDays=req.body.awardPeriod.durationInDays;
   periodoAdjudicacion.ocid= req.body.id;
   periodoAdjudicacion.save();

   const periodoContrato=new tenderPeriod();
   periodoContrato.id= count;//req.body.suppliers.id;
   periodoContrato.startDate=req.body.contractPeriod.startDate;
   periodoContrato.endDate=req.body.contractPeriod.endDate;
   periodoContrato.maxExtentDate=req.body.contractPeriod.maxExtentDate;
   periodoContrato.durationInDays=req.body.contractPeriod.durationInDays;
   periodoContrato.ocid= req.body.id;
   periodoContrato.save();

   const provInvitados = req.body.tenderers;

   const arrayprovInvitados = [];

   provInvitados.forEach(element => {
    const invitedSuppliers = new actor();
    const invitedSuppliersid = element.id;
    const invitedSuppliersname = element.name;
    invitedSuppliers.id= invitedSuppliersid;
    invitedSuppliers.name= invitedSuppliersname;
    invitedSuppliers.type= 'tender';
    invitedSuppliers.save();
    arrayprovInvitados.push(invitedSuppliers._id);
    

  });
  const docs = req.body.documents;

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

   //hitos
   const hits3 = req.body.milestones;

   const arrayhits3 = [];

   hits3.forEach(element => {
    const hito_3 = new milestones();

    hito_3.id=req.body.id;
    hito_3.title=element.milestonestitle;
    hito_3.type=element.milestonesType;
    hito_3.description=element.milestonesdescription;
    hito_3.code=element.milestonescode;
    hito_3.dueDate=element.milestonesdueDate;
    hito_3.dateMet=element.milestonesdateMet;
    hito_3.dateModified=element.milestonesdateModified;
    hito_3.status=element.milestonesstatus;

    hito_3.save();
    arrayhits3.push(hito_3._id);
    
  });
   //end hitos
   const _amendmentsCont = req.body.amendments;
   const amendmentsCont_=new amendmentsCont ();
   amendmentsCont_.id=req.body.id;
   amendmentsCont_.ocid= req.body.id;
   amendmentsCont_.rationale=_amendmentsCont.rationale;
   amendmentsCont_.date=_amendmentsCont.date;
   amendmentsCont_.description=_amendmentsCont.description; 
   amendmentsCont_.amendsReleaseID=_amendmentsCont.amendsReleaseID; 
   amendmentsCont_.releaseID=_amendmentsCont.releaseID; 
   amendmentsCont_.save();
   const arrayamendmentsCont = [];

   
   arrayamendmentsCont.push(amendmentsCont_._id);
    try {

    const tender = new tenders(req.body);
    let count = await getID(tenders);
    tender.id = `${count}-tender`;
    //const ocid = req.body.id;
    tender.ocid = req.body.id;
    console.log("ocid:" + tender.ocid );
    tender.title = req.body.title;
    tender.description = req.body.description;
    tender.status = req.body.status;

    tender.tenderprocurementMethod= req.body.tenderprocurementMethod;
    tender.tenderprocurementMethodDetails=req.body.tenderprocurementMethodDetails;
    tender.tenderprocurementMethodRationale= req.body.tenderprocurementMethodRationale;
    tender.tendercategoria= req.body.tendercategoria;
    tender.tenderawardCriteria= req.body.tenderawardCriteria;
    tender.tenderawardCriteriaDetails= req.body.tenderawardCriteriaDetails;
   
    tender.tendersubmissionMethod= req.body.tendersubmissionMethod;
    tender.tendersubmissionMethodDetails= req.body.tendersubmissionMethodDetails;

    tender.procuringEntity = tenderers._id;
    tender.items = itemCont_._id;
    tender.value = tenderValue_._id;
    tender.minValue = minValue_._id;

    tender.procurementMethod = req.body.procurementMethod;
    tender.procurementMethodDetails = req.body.procurementMethodDetails;
    tender.procurementMethodRationale = req.body.procurementMethodRationale;
    tender.mainProcurementCategory = req.body.mainProcurementCategory;
    tender.additionalProcurementCategories = req.body.additionalProcurementCategories;
    tender.awardCriteria = req.body.awardCriteria;
    tender.awardCriteriaDetails = req.body.awardCriteriaDetails;
    tender.submissionMethod = req.body.submissionMethod;
    tender.submissionMethodDetails = req.body.submissionMethodDetails;

    tender.tenderPeriod = periodoLicitacion._id;
    tender.enquiryPeriod = periodoSol._id;
    if(req.body.hasEnquiries ==false)
        tender.hasEnquiries = 0;
    else
       tender.hasEnquiries = 1;
    //console.log("hasEnquiries" + tender.hasEnquiries);
    tender.clarificationMeetings = arrayclarificationMeetings;

    tender.eligibilityCriteria = req.body.eligibilityCriteria;

    tender.awardPeriod =periodoAdjudicacion._id;
    tender.contractPeriod = periodoContrato._id;
   
    tender.numberOfTenderers = arrayprovInvitados.length;
   
    tender.tenderers = arrayprovInvitados;
    tender.documents=arraydocs;
    tender.milestones =arrayhits3;
    tender.amendments =arrayamendmentsCont;
   
    // if (tender.enquiryPeriod != null) {
    //   tender.hasEnquiries = true;
    // }
    await tender.save();
    return res.status(200).json({
      ok: true,
      _id: tender._id,
    });
    } catch (error) {
    return res.status(404).json({
      ok: false,
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
      const tender = await tenders.findOne({ocid});
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
      const proc = await procuringEntity.findOne({ ocid });
      const val = await value.findOne({ ocid });
      const minVal = await minValue.findOne({ ocid });
      const tenderP = await tenderPeriod.findOne({ ocid });
      const enquiryP = await enquiryPeriod.findOne({ ocid });
      const awardP = await awardPeriod.findOne({ ocid });
      return res.status(200).json({
        procuringEntity_id: proc._id,
        value_id: val._id,
        minValue_id: minVal._id,
        tenderPreiod_id: tenderP._id,
        enquiryPeriod_id: enquiryP._id,
        awardPeriod_id: awardP._id,
      });
    } catch (error) {
      return res.status(200).json({
        msj: "No se encontraron datos",
        ok: false,
      });
    }
  },

  deleteTender: async(req,res=response)=>{
    
  }


};

module.exports = TendersController;
