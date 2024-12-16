//import { response } from "express";
import getID from "../helpers/getId";
import planning from "../models/planning/planning";
import actor from "../models/planning/actor";
import requestForQuote from "../models/planning/requestForQuote";
import Solquotes from "../models/planning/SolQuotes";
import QuotesPeriod from "../models/planning/period";

import Classifications from "../models/items/classification";
import additionalClassifications from "../models/items/additionalClassifications";
import ItemValue from "../models/items/unit/values";

import quotes from "../models/quotes/quotes";
import Quo from "../models/quotes/_quo";
import cotizados from "../models/planning/cotizados";
import buyers from "../models/buyer/buyer";
//import butgetGen from "../models/budget/budget";
import budgets from "../models/_budget/_budget";
import budgetvalue from "../models/planning/values";
import budgetBreakdown from "../models/budgetBreakdown/budgetBreakdown";
import budgetBreakdownvalue from "../models/budgetBreakdown/value";
import budgetBreakdownperiodo from "../models/budgetBreakdown/period";
import budgetLine from "../models/budgetLines/budgetLine";
import component from "../models/budgetLines/component";
import sourceParty from "../models/budgetLines/sourceParty";
import documents from "../models/documents/documents";
import milestones from "../models/documents/milestones";
import release from "../models/contrato";


// Importar los modelos
import Items from "../models/items/items";
import Classification from "../models/items/classification";
import AdditionalClassification from "../models/items/additionalClassifications.js";
import Unit from "../models/items/unit/unit";
import Value from "../models/items/unit/values";
import Supplier from "../models/planning/suppliers.js";
import Period from "../models/planning/period.js";
import Quote from "../models/quotes/quotes";
import RequestForQuotes from "../models/planning/requestForQuote";



const PlanningController = {

  planning: async (req, res = response) => {
    //("Entre a planning de PlanningCOntroller" );
    let activo;
    const id = req.body.id;
    const rationale = req.body.rationale.toUpperCase();
    const hasQuotes = req.body.hasQuotes;
    let hasQuotes_why = "";
    if (req.body.hasQuotes_why != null) {
      hasQuotes_why = req.body.hasQuotes_why;
    }

    const requestingUnits = new actor();
    const requestingUnitsid = req.body.requestingUnits.id;
    const requestingUnitsname = req.body.requestingUnits.name;
    requestingUnits.id = requestingUnitsid;
    requestingUnits.name = requestingUnitsname;
    requestingUnits.type = 'planning';
    requestingUnits.save();

    const responsibleUnits = new actor();
    const responsibleUnitsid = req.body.responsibleUnits.id;
    const responsibleUnitsname = req.body.responsibleUnits.name;
    responsibleUnits.id = responsibleUnitsid;
    responsibleUnits.name = responsibleUnitsname;
    responsibleUnits.type = 'planning';
    responsibleUnits.save();

    const contractingUnits = new actor();
    const contractingUnitsid = req.body.contractingUnits.id;
    const contractingUnitsname = req.body.contractingUnits.name;
    contractingUnits.id = contractingUnitsid;
    contractingUnits.name = contractingUnitsname;
    contractingUnits.type = 'planning';
    contractingUnits.save();
    //requestForQuotes solquotes
    const solQuotes = req.body.requestForQuotes.quotes_;

    const arraysolQuotes = [];

    solQuotes.forEach(element => {
      const solquotes = new Solquotes();
      solquotes.id = element.id;
      solquotes.title = element.title;
      solquotes.description = element.description;
      solquotes.save();
      arraysolQuotes.push(solquotes._id);

    });
    //requestForQuotes periodo
    const periodo = req.body.requestForQuotes.period;
    const _per = new QuotesPeriod();
    _per.id = req.body.requestForQuotes.id;
    _per.startDate = periodo.startDate;
    _per.endDate = periodo.endDate;
    _per.maxExtentDate = periodo.maxExtentDate;
    _per.durationInDays = periodo.durationInDays;
    _per.save();
    //requestForQuotes item
    const items = req.body.requestForQuotes.items;

    const arrayitems = [];

    items.forEach(element => {
      const item = new Items();
      item.id = 'item-' + element.id;
      item.typeItem = 'planning-a-ser-cotizados';
      item.title = element.item;
      item.description = element.description;

      const _classification = element.classification;
      const classification = new Classifications();
      classification.id = _classification.id;
      classification.scheme = _classification.scheme;
      classification.description = _classification.description;
      classification.uri = _classification.uri;
      classification.ocid = req.body.id;
      classification.save();

      item.classification = classification._id;

      const _value = element.unit.value;
      const value = new ItemValue();
      value.id = classification.id;
      value.amount = _value.amount;
      value.currency = _value.currency;
      value.ocid = req.body.id;
      value.save();

      const _unit = element.unit;
      const unit = new Unit();
      unit.id = classification.id;
      unit.numreq = _unit.numreq;
      unit.scheme = _unit.scheme;
      unit.name = _unit.name;
      unit.valor = _unit.valor;
      unit.values = value;
      unit.uri = _unit.uri;
      unit.ocid = req.body.id;
      unit.save();

      item.unit = unit;
      item.quantity = element.quantity;

      item.save();
      arrayitems.push(item._id);

    });

    const provInvitados = req.body.requestForQuotes.invitedSuppliers;

    const arrayprovInvitados = [];

    provInvitados.forEach(element => {
      const invitedSuppliers = new actor();
      const invitedSuppliersid = element.id;
      const invitedSuppliersname = element.name;
      invitedSuppliers.id = invitedSuppliersid;
      invitedSuppliers.name = invitedSuppliersname;
      invitedSuppliers.type = 'planning';
      invitedSuppliers.save();
      arrayprovInvitados.push(invitedSuppliers._id);

    });
    const quo_ = req.body.requestForQuotes.quotes.quo;

    const arrayquo = [];

    quo_.forEach(element => {
      const quo = new Quo();
      //console.log("Entre a planning de PlanningCOntroller" );
      const quoteid = element.id;
      const quotcotizadescription = element.cotizadescription;
      const cotizadate = element.cotizadate;
      quo.id = quoteid;
      quo.description = quotcotizadescription;
      quo.date = cotizadate;
      quo.save();
      arrayquo.push(quo._id);

    });
    const cotizaciones = req.body.requestForQuotes.quotes.cotizaciones;
    const arraycotizaciones = [];
    const array_item = [];
    cotizaciones.forEach(element => {

      //items cotizados

      const item = new Items();
      item.id = 'item-' + element.id;
      item.typeItem = 'planning-cotizados';
      item.title = element.item;
      item.description = element.description;

      const _classification = element.classification;
      const classification = new Classifications();
      classification.id = _classification.id;
      classification.scheme = _classification.scheme;
      classification.description = _classification.description;
      classification.uri = _classification.uri;
      classification.ocid = req.body.id;
      classification.save();

      item.classification = classification._id;

      const _value = element.unit.value;
      const value = new ItemValue();
      value.id = classification.id;
      value.amount = _value.amount;
      value.currency = _value.currency;
      value.ocid = req.body.id;
      value.save();

      const _unit = element.unit;
      const unit = new Unit();
      unit.id = classification.id;
      unit.numreq = _unit.numreq;
      unit.scheme = _unit.scheme;
      unit.name = _unit.name;
      unit.valor = _unit.valor;
      unit.values = value;
      unit.uri = _unit.uri;
      unit.ocid = req.body.id;
      unit.save();

      item.unit = unit;
      item.quantity = element.quantity;

      item.save();
      array_item.push(item._id);

      //periodo
      const perio = element.periodo;
      const periodo_ = new QuotesPeriod();
      periodo_.id = req.body.requestForQuotes.id;
      periodo_.startDate = perio.startDate;
      periodo_.endDate = perio.endDate;
      periodo_.maxExtentDate = perio.maxExtentDate;
      periodo_.durationInDays = perio.durationInDays;
      periodo_.save();

      const issuingSuppliero_ = new actor();
      const issuingSuppliero_id = element.proveedorEmisor.id;
      //const issuingSuppliero_name_ = element.proveedorEmisor.Suppliersname;
      const issuingSuppliero_name = element.proveedorEmisor.name;
      issuingSuppliero_.id = issuingSuppliero_id;
      issuingSuppliero_.name = issuingSuppliero_name;
      issuingSuppliero_.type = 'planning';
      issuingSuppliero_.save();

      const cotizacion = new cotizados();
      const id = element.id;
      cotizacion.id = id;
      cotizacion.items = array_item;
      cotizacion.period = periodo_._id;
      cotizacion.issuingSupplier = issuingSuppliero_._id;
      cotizacion.save();
      arraycotizaciones.push(cotizacion._id);

    });

    const Quote = new quotes();
    Quote.quo = arrayquo;
    Quote.cotizaciones = arraycotizaciones;
    Quote.save();

    const _requestForQuotes = new requestForQuote();
    _requestForQuotes.quotes_ = arraysolQuotes;
    _requestForQuotes.period = _per;
    _requestForQuotes.items = arrayitems;
    _requestForQuotes.invitedSuppliers = arrayprovInvitados;
    _requestForQuotes.quotes = Quote._id;
    _requestForQuotes.save();


    const _budgetBreakdownvalue = new budgetBreakdownvalue();
    _budgetBreakdownvalue.id = req.body.id;
    _budgetBreakdownvalue.amount = req.body.budget.budgetBreakdown.value.amount;
    _budgetBreakdownvalue.currency = req.body.budget.budgetBreakdown.value.currency;
    _budgetBreakdownvalue.save();


    const periodobudgetBreakdown = new budgetBreakdownperiodo();
    periodobudgetBreakdown.id = req.body.id;
    periodobudgetBreakdown.startDate = req.body.budget.budgetBreakdown.periodo.startDate;
    periodobudgetBreakdown.endDate = req.body.budget.budgetBreakdown.periodo.endDate;
    periodobudgetBreakdown.maxExtentDate = req.body.budget.budgetBreakdown.periodo.maxExtentDate;
    periodobudgetBreakdown.durationInDays = req.body.budget.budgetBreakdown.periodo.durationInDays;
    periodobudgetBreakdown.save();

    const sourceParty_ = new sourceParty();

    sourceParty_.id = req.body.budget.budgetBreakdown.budgetLines.sourceParty.id;
    sourceParty_.name = req.body.budget.budgetBreakdown.budgetLines.sourceParty.name;
    sourceParty_.save();
    //  console.log("component_");

    const component_ = new component();
    component_.name = req.body.budget.budgetBreakdown.budgetLines.components.name,
      component_.level = req.body.budget.budgetBreakdown.budgetLines.components.level,
      component_.code = req.body.budget.budgetBreakdown.budgetLines.components.code,
      component_.description = req.body.budget.budgetBreakdown.budgetLines.components.description,
      component_.save();



    const budgetLine_ = new budgetLine();
    budgetLine_.id = req.body.id;
    budgetLine_.origin = req.body.budget.budgetBreakdown.budgetLines.origin,
      budgetLine_.ocid = req.body.id;
    budgetLine_.components = component_._id,
      budgetLine_.sourceParty = sourceParty_._id,
      budgetLine_.save();


    //budget

    const _budgetBreakdown = new budgetBreakdown();
    _budgetBreakdown.id = req.body.id;
    _budgetBreakdown.description = req.body.budget.budgetBreakdown.description;
    _budgetBreakdown.ocid = req.body.id;
    _budgetBreakdown.value = _budgetBreakdownvalue._id;
    _budgetBreakdown.uri = req.body.budget.budgetBreakdown.uri;
    _budgetBreakdown.periodo = periodobudgetBreakdown._id;
    _budgetBreakdown.budgetLines = budgetLine_._id;
    _budgetBreakdown.save();

    const _budgetvalue = new budgetvalue();
    _budgetvalue.id = req.body.id;
    _budgetvalue.amount = req.body.budget.value.amount;
    _budgetvalue.currency = req.body.budget.value.currency;
    _budgetvalue.ocid = req.body.id;
    _budgetvalue.save();


    const _budgets = new budgets();
    _budgets.id = req.body.id;
    _budgets.description = req.body.budget.description;
    _budgets.value = _budgetvalue._id
    _budgets.uri = req.body.budget.uri;
    _budgets.ocid = req.body.id;
    _budgets.project = req.body.budget.project;
    _budgets.projectID = req.body.budget.projectID;
    _budgets.projecturi = req.body.budget.projecturi;

    _budgets.budgetBreakdown = _budgetBreakdown._id;
    _budgets.save();//
    // console.log("_budgetsid:"+_budgets._id );
    //endbudget

    //documents
    const docs = req.body.documents;

    const arraydocs = [];

    docs.forEach(element => {
      const documents_ = new documents();

      documents_.id = element.id;
      documents_.title = element.title;
      documents_.Type = element.Type;
      documents_.description = element.description;
      documents_.url = element.url;
      documents_.format = element.format;
      documents_.language = element.language;
      documents_.datePublished = element.datePublished;
      documents_.dateModified = element.dateModified;

      documents_.save();
      arraydocs.push(documents_._id);

    });
    //enddocuments

    //hitos
    const hits = req.body.milestones;

    const arrayhits = [];

    hits.forEach(element => {
      const hito_ = new milestones();

      hito_.id = req.body.id;
      hito_.title = element.milestonestitle;
      hito_.type = element.milestonesType;
      hito_.description = element.milestonesdescription;
      hito_.code = element.milestonescode;
      hito_.dueDate = element.milestonesdueDate;
      hito_.dateMet = element.milestonesdateMet;
      hito_.dateModified = element.milestonesdateModified;
      hito_.status = element.milestonesstatus;

      hito_.save();
      arrayhits.push(hito_._id);

    });
    //end hitos

    try {
      const plainCount = await planning.find({ id }).count();
      if (plainCount != 1) {
        //console.log("hasQuotes:"+hasQuotes );
        const _planing = new planning({ ...req.body });

        _planing.id = id;
        _planing.rationale = rationale;
        _planing.hasQuotes = hasQuotes;
        _planing.hasQuotes_why = hasQuotes_why;
        _planing.requestingUnits = requestingUnits._id;
        _planing.responsibleUnits = responsibleUnits._id;
        _planing.contractingUnits = contractingUnits._id;
        _planing.requestForQuotes = _requestForQuotes._id;
        _planing.budget = _budgets._id;
        //console.log("_budgets:"+_budgets._id );
        _planing.documents = arraydocs;
        _planing.milestones = arrayhits;
        _planing.save();

        return res.status(200).json({
          ok: true,
          _id: _planing._id,//plan._id,
        });
      } else {// es para editar
        return res.status(200).json({
          ok: false,
          msg: "No se puede insertar más de un planning",
        });
      }
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  getPlanningbyOcid: async (req, res = response) => {
    //console.log("Entre getPlanningbyOcid planning" );

    try {
      const ocid = req.params.ocid;

      const mil = await planning.findOne({ id: ocid });
      //console.log("Planning:"+ mil);
      res.status(200).json({
        _id: mil._id,
        planning: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningPeriod: async (req, res = response) => {

    try {
      const id = req.params.id;

      const mil = await QuotesPeriod.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        period: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningCotizacion: async (req, res = response) => {

    try {
      const id = req.params.id;

      const mil = await Solquotes.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        quotes_: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  deletePlanningCotizacion: async (req, res = response) => {
    //console.log("Entre a deletePlanningCotizacion de PlanningCOntroller" );
    try {
      const id = req.params._id;
      const _idOcid = req.params._idOcid;
      const arraysolQuotes = [];
      let Quotes;
      let _idRequestQuotes;

      const mil = await Solquotes.findByIdAndDelete({ _id: id });
      //obtener el array guardado y eliminar del array
      //obtengo el planning

      const planning_ = await planning.findOne({ id: _idOcid });
      const requestForQuotes = planning_.requestForQuotes; //obtengo request for quotes

      requestForQuotes.forEach(element => {
        _idRequestQuotes = element._id;
        Quotes = element.quotes_;
        Quotes.forEach(element2 => {
          if (element2._id != id) {
            arraysolQuotes.push(element2._id);
          }
        });

      });
      const QuotesUpdated3 = await requestForQuote.updateOne(
        {
          _id: _idRequestQuotes

        },
        { $set: { quotes_: arraysolQuotes, } }
      );
      res.status(200).json({
        ok: true,
        Quotes: arraysolQuotes,
        msg: "SOLICITUD DE COTIZACIÓN ELIMINADO",
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... Solicitud de cotización no existe",
      });
    }
  },
  updatePlanning_Cotizacion: async (req, res = response) => {
    try {

      const id = req.params.id;
      const solQuote = new Solquotes();

      const _Solquotes = await Solquotes.findById(id);

      if (!_Solquotes) {
        return res.status(404).json({
          ok: false,
          msg: "NO ÉXISTE LA COTIZACIÓN",
        });
      }

      const { title, description, ...campos } = req.body;

      if (req.body.title != "" && req.body.title != null)
        solQuote.title = req.body.title.toUpperCase();
      else
        solQuote.title = "";

      if (req.body.description != "" && req.body.description != null)
        solQuote.description = req.body.description.toUpperCase();
      else
        solQuote.description = "";

      //console.log("Entre titulo:"+solQuote.title+"Entre description:"+solQuote.description);
      const solQuoteUpdated = await Solquotes.findByIdAndUpdate(id,
        {
          title: solQuote.title,
          description: solQuote.description,

        }, { upsert: false, new: false } //, {  new: true } 

      );

      if (solQuoteUpdated) {
        //console.log("YA HA SIDO ACTUALIZADO");
        return res.status(200).json({
          ok: true,
          Solquotes: solQuoteUpdated,
          msg: `EL ${Solquotes} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {
        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE LA SOLICITUD DE COTIZACIÓN",
        });
      }
    } catch (error) {
      // console.log("ERROR INESPERADO" + error.msg);
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... SOLICITUD DE COTIZACIÓN NO ÉXISTE",
      });
    }
  },
  savePlanning_Cotizacion: async (req, res = response) => {
    try {
      const _idOcid = req.params._idOcid;
      let _idRequestQuotes;
      const arraysolQuotes = [];
      let Quotes;
      //  console.log('entre savePlanning_Cotizacion controller ocid:'+_idOcid);
      const solQuote = new Solquotes();

      const { title, description, ...campos } = req.body;

      if (req.body.title != "" && req.body.title != null)
        solQuote.title = req.body.title.toUpperCase();
      else
        solQuote.title = "";

      if (req.body.description != "" && req.body.description != null)
        solQuote.description = req.body.description.toUpperCase();
      else
        solQuote.description = "";
      solQuote.save();
      //obtener el array guardado y guardar en id en el array

      //obtengo el planning
      const planning_ = await planning.findOne({ id: _idOcid });

      const requestForQuotes = planning_.requestForQuotes; //obtengo request for quotes
      requestForQuotes.forEach(element => {
        _idRequestQuotes = element._id;

        Quotes = element.quotes_;
        Quotes.forEach(element2 => {
          arraysolQuotes.push(element2._id);
        });
        arraysolQuotes.push(solQuote._id);
      });
      try {
        //console.log('arraysolQuotes'+arraysolQuotes.length);
        const QuotesUpdated3 = await requestForQuote.updateOne(
          { _id: _idRequestQuotes },
          { $set: { quotes_: arraysolQuotes, } }
        );
        if (QuotesUpdated3) {

          res.status(200).json({
            _idRequestQuotes: _idRequestQuotes,
            Quotes: arraysolQuotes,
            ok: true
          });
        }
        else {

          res.status(200).json({
            ok: false,
            msg: "Error Inesperado-... planeación no existe",
          });

        }


      }
      catch (error) {

        console.log('error:' + error.msg);
      }

    } catch (error) {
      console.log("ERROR INESPERADO SOLICITUD DE COTIZACIÓN" + error.msg);
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... SOLICITUD DE COTIZACIÓN ",
      });
    }
  },
  getPlanningItems: async (req, res = response) => {

    try {
      const id = req.params.id;
      const item = await Items.findOne({ _id: id });
      res.status(200).json({
        _id: item._id,
        items: item,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetValue: async (req, res = response) => {

    try {
      const id = req.params.id;
      const mil = await budgetvalue.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        value: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetBreakdownbudgetLinesComponets: async (req, res = response) => {

    try {
      const id = req.params.id;
      const _Componets = await component.findOne({ _id: id });
      res.status(200).json({
        _id: _Componets._id,
        Componets: _Componets,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetBreakdownbudgetLinessourceParty: async (req, res = response) => {


    try {
      const id = req.params.id;

      const act = await sourceParty.findOne({ _id: id });

      res.status(200).json({
        _id: act._id,
        actor: act,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningDocuments: async (req, res = response) => {
    // console.log("Entre sourceParty planning" );

    try {
      const id = req.params.id;
      //console.log("Entre getPlanningDocuments doc id:"+id );
      const doc = await documents.findOne({ _id: id });
      //console.log(" doc:"+ doc);
      res.status(200).json({
        _id: doc._id,
        documento: doc,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningHitos: async (req, res = response) => {
    // console.log("Entre sourceParty planning" );

    try {
      const id = req.params.id;
      //console.log("Entre getPlanningHitos hito id:"+id );
      const h = await milestones.findOne({ _id: id });
      //console.log(" hito:"+ h);
      res.status(200).json({
        _id: h._id,
        hito: h,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetBreakdownbudgetLines: async (req, res = response) => {

    try {
      const id = req.params.id;
      const _budgetLine = await budgetLine.findOne({ _id: id });
      res.status(200).json({
        _id: _budgetLine._id,
        budgetLine: _budgetLine,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningPeriodbudgetBreakdown: async (req, res = response) => {

    try {
      const id = req.params.id;
      const peri = await budgetBreakdownperiodo.findOne({ _id: id });
      res.status(200).json({
        _id: peri._id,
        period: peri,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetBreakdown: async (req, res = response) => {

    try {
      const id = req.params.id;
      const Breakdown = await budgetBreakdown.findOne({ _id: id });
      res.status(200).json({
        _id: Breakdown._id,
        Breakdown: Breakdown,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudgetBreakdownValue: async (req, res = response) => {

    try {
      const id = req.params.id;
      const mil = await budgetBreakdownvalue.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        value: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsValue: async (req, res = response) => {

    try {
      const id = req.params.id;
      const mil = await ItemValue.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        value: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsClassific: async (req, res = response) => {

    try {
      const id = req.params.id;
      const mil = await Classifications.findOne({ _id: id });
      res.status(200).json({
        _id: mil._id,
        classification: mil,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsUint: async (req, res = response) => {
    //console.log("Entre getPlanningUint planning" );

    try {
      const id = req.params.id;
      //console.log("Entre getPlanningUint planning id:"+id );
      const unit = await Unit.findOne({ _id: id });
      //console.log("unit:"+ unit);
      res.status(200).json({
        _id: unit._id,
        unit: unit,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsinvitedSuppliers: async (req, res = response) => {
    //   console.log("Entre getPlanningItemsinvitedSuppliers planning" );

    try {
      const id = req.params.id;
      // console.log("Entre getPlanningItemsinvitedSuppliers planning id:"+id );
      const act = await actor.findOne({ _id: id });
      //    console.log("actor emisor:"+ act);
      res.status(200).json({
        _id: act._id,
        actor: act,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsQuotes: async (req, res = response) => {
    // console.log("Entre getPlanningItemsQuotes planning" );

    try {
      const id = req.params.id;
      // console.log("Entre getPlanningItemsQuotes planning id:"+id );
      const quot = await quotes.findOne({ _id: id });
      // console.log("quotes:"+ quot);
      res.status(200).json({
        _id: quot._id,
        quotes: quot,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsQuo: async (req, res = response) => {
    // console.log("Entre getPlanningItemsQuotes planning" );

    try {
      const id = req.params.id;
      // console.log("Entre getPlanningItemsQuotes planning id:"+id );
      const quot = await Quo.findOne({ _id: id });
      //console.log("quotes:"+ quot);
      res.status(200).json({
        _id: quot._id,
        quo: quot,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningbudget: async (req, res = response) => {
    //console.log("Entre getPlanningbudget planning" );

    try {
      const id = req.params.id;
      //console.log("Entre getPlanningbudget  id:"+id );
      const quot = await budgetBreakdown.findOne({ _id: id });

      //("budget:"+ quot);
      res.status(200).json({
        _id: quot._id,
        budget: quot,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getPlanningItemsCotizacion: async (req, res = response) => {
    // console.log("Entre getPlanningItemsQuotes planning" );

    try {
      const id = req.params.id;
      // console.log("Entre getPlanningItemsCotizacion planning id:"+id );
      const quot = await cotizados.findOne({ _id: id });

      // console.log("quotes:"+ quot);
      res.status(200).json({
        _id: quot._id,
        cotizados: quot,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  getDatosPlanningCotizaciones: async (req, res = response) => {
    //console.log("Entre getDatosPlanningCotizaciones planning" );

    try {
      const items = req.params.iCot;

      const peri = req.params.peri;
      const issuingSupplier = req.params.issuingSupplier;
      // console.log("Entre getDatosPlanningCotizaciones items id:"+items);
      // console.log("Entre getDatosPlanningCotizaciones peri id:"+peri);
      //console.log("Entre getDatosPlanningCotizaciones issuingSupplier id:"+ issuingSupplier );

      const periodo = await QuotesPeriod.findOne({ _id: peri });
      //  console.log("periodo:"+ periodo);
      const item = await Items.findOne({ _id: items });
      //console.log("item:"+ item);


      const act = await actor.findOne({ _id: issuingSupplier });
      //  console.log("actor:"+ act);
      res.status(200).json({
        _id: item._id,
        item: item,
        periodo: periodo,
        actor: act,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  PlanningRationalebyOcid: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const mil = await planning.findOne({ id: ocid });
      res.status(200).json({
        _id: mil._id,
        rationale: mil.rationale,
        ok: true
      });
    } catch (error) {
      res.status(200).json({
        ok: false,
        msg: "Error Inesperado-... hito no existe",
      });
    }
  },
  planningShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await milestone.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        planning: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  planningUpdate: async (req, res = response) => {
    try {
      const _id = req.params.id;
      const plan = await planning.findById(_id);
      if (!plan) {
        return res.status(404).json({
          ok: false,
          msg: "No existe planeación",
        });
      }
      //console.log(req.body);
      const { ...campos } = req.body;
      //await plan.save();
      const planUpdated = await planning.findByIdAndUpdate(_id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        planning: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... planeación no existe",
      });
    }
  },
  budget: async (req, res = response) => {
    try {
      const bud = new budgets(req.body);
      let count = await getID(budgets);
      bud.id = count;
      await bud.save();
      return res.status(200).json({
        ok: true,
        _id: bud._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  budgetShowALL: async (req, res = response) => {
    try {
      const cp = await budget.find();
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        budget: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  budgetShowID: async (req, res = response) => {
    try {
      const id = req.params.ocid;
      const cp = await budgets.findOne({ ocid: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        budget: cp,
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  budgetUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const bud = await budgets.findOne({ ocid: uid });

      if (!bud) {
        return res.status(404).json({
          ok: false,
          msg: "No existe presupuesto",
        });
      }
      //console.log(bud._id);
      const { ...campos } = req.body;
      await bud.save();
      const planUpdated = await budgets.findByIdAndUpdate(bud._id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        budget: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... presupuesto no existe",
      });
    }
  },
  allPlanning: async (req, res = response) => {
    const ocid = req.params.ocid;
    let buyer = await buyers.findOne(
      { ocid: ocid },
      { _id: 1, id: 0, name: 0 }
    );
    let budget = await budgets.findOne({ ocid: ocid }, { _id: 1 });
    let document = await documents.find({ document_id: ocid }, { _id: 1 });
    let milestone = await milestones.find({ document_id: ocid }, { _id: 1 });
    if (!buyer) {
      return res.status(200).json({
        ok: false,
        msg: "No se encontro ningun resultado",
      });
    }
    //console.log(buy);
    res.status(200).json({
      buyer,
      budget,
      document,
      milestone,
    });
  },




  saveItems: async (req, res = response) => {
    const { id, title, description, items, period, invitedSuppliers, quotes, typeItem } = req.body;

    if (!items) {
      return res.status(400).json({
        message: '"items" es obligatorio en el formulario.',
      });
    }

    try {
      const itemIds = await Promise.all(
        items.map(async (itemForm) => {
          // Verificar clasificación
          if (!itemForm.classification || !itemForm.classification.scheme || !itemForm.classification.id) {
            return res.status(400).json({
              message: "La clasificación debe tener un 'scheme' y 'id'.",
            });
          }

          // Guardar clasificación
          const classification = new Classification({
            scheme: itemForm.classification.scheme,
            id: itemForm.classification.id,
            description: itemForm.classification.description,
            uri: itemForm.classification.uri,
          });

          const savedClassification = await classification.save();
          //console.log("Saved Classification: ", savedClassification);

          // Guardar clasificaciones adicionales
          const additionalClassifications = await Promise.all(
            (itemForm.additionalClassifications || []).map(async (additionalClassificationForm) => {
              const additionalClassification = new AdditionalClassification({
                scheme: additionalClassificationForm.scheme,
                id: additionalClassificationForm.id,
                description: additionalClassificationForm.description,
                uri: additionalClassificationForm.uri,
              });

              const savedAdditionalClassification = await additionalClassification.save();
              return savedAdditionalClassification._id;
            })
          );

          // Guardar Value (antes de Unit)
          const value = new Value({
            amount: itemForm.unit.value?.amount || 0,
            currency: itemForm.unit.value?.currency || "USD",
          });

          const savedValue = await value.save();

          // Guardar unidad con el valor (referencia al valor guardado)
          const unit = new Unit({
            scheme: itemForm.unit.scheme || "",
            id: itemForm.unit.id || "",
            name: itemForm.unit.name || "",
            values: savedValue._id,  // Asegurarse de que la referencia sea correcta
            uri: itemForm.unit.uri || "",
            ocid: itemForm.unit.ocid || "",  // Aquí puede que tengas que agregar un campo 'ocid'
          });

          const savedUnit = await unit.save();

          // Guardar item
          const item = new Items({
            id: itemForm.id,
            description: itemForm.description.toUpperCase(),
            typeItem: typeItem,
            classification: savedClassification._id, // Referencia a la clasificación guardada
            additionalClassifications: additionalClassifications, // Referencias a las clasificaciones adicionales
            quantity: itemForm.quantity,
            unit: savedUnit._id, // Referencia a la unidad guardada
            ocid: req.params.id, // Asumimos que el ocid se pasa desde los parámetros de la URL
          });

          const savedItem = await item.save();
          console.log("Saved Item: ", savedItem);
          return savedItem._id;  // Devolver el _id del item guardado
        })
      );

      // Guardar el periodo
      const savedPeriod = new Period({
        startDate: period.startDate,
        endDate: period.endDate,
        maxExtentDate: period.maxExtentDate,
        durationInDays: period.durationInDays,
      });
      const savedPeriodDoc = await savedPeriod.save();

      // Guardar los proveedores
      const supplierIds = await Promise.all(
        invitedSuppliers.map(async (supplierForm) => {
          const supplier = new Supplier({
            name: supplierForm.name,
            id: supplierForm.id,
          });
          const savedSupplier = await supplier.save();
          return savedSupplier._id;
        })
      );

      // Guardar las cotizaciones
      const quoteIds = await Promise.all(
        quotes.map(async (quoteForm) => {
          const quote = new Quote({
            id: quoteForm.id,
            description: quoteForm.description.toUpperCase(),
            date: quoteForm.date,
            items: await Promise.all(
              quoteForm.items.map(async (quoteItem) => {
                const item = await Items.findById(quoteItem.id);
                return item._id;
              })
            ),
            value: {
              amount: quoteForm.value.amount,
              currency: quoteForm.value.currency,
            },
            period: savedPeriodDoc._id,
            issuingSupplier: quoteForm.issuingSupplier,
          });

          const savedQuote = await quote.save();
          return savedQuote._id;
        })
      );

      // Crear y guardar el documento RequestForQuotes
      const requestForQuotes = new RequestForQuotes({
        id,
        title,
        description,
        period: savedPeriodDoc._id,
        items: itemIds,
        invitedSuppliers: supplierIds,
        quotes: quoteIds,
      });

      // Guardar el documento requestForQuotes
      const savedRequestForQuotes = await requestForQuotes.save();

      // Respuesta exitosa con el _id de RFQ
      res.status(201).json({
        ok: true,
        requestForQuotesId: savedRequestForQuotes._id, // Regresamos el _id generado por MongoDB
      });
    } catch (error) {
      console.error("Error guardando los datos:", error);
      res.status(500).json({
        message: "Error al guardar los datos.",
        error: error.message,
      });
    }
  },



  getPlanningItems: async (req, res = response) => {
    try {
      // Obtener el `ocid` desde los parámetros de la solicitud
      const { ocid } = req.params;

      // Obtener los items desde tu base de datos (o desde donde se almacenen)
      const allItems = await Items.find(); // Cambia `ItemModel` por tu modelo real

      // Filtrar los items que cumplen con la condición
      const filteredItems = allItems.filter(item =>
        item.typeItem === "planning-item" || item.ocid === ocid
      );

      // Retornar los items filtrados en la respuesta
      return res.status(200).json({
        ok: true,
        items: filteredItems
      });
    } catch (error) {
      console.error("Error obteniendo los planning items:", error);

      // Manejo de errores
      return res.status(500).json({
        ok: false,
        message: "Hubo un error al obtener los planning items",
        error: error.message
      });
    }
  },
  UpdatePlanningItems: async (req, res = response) => {
    try {
      // Obtener el ID del item y el OCID desde los parámetros de la solicitud
      const { id, ocid } = req.params;

      // Validar que el cuerpo de la solicitud contiene datos para actualizar
      const updatedData = req.body;
      if (!updatedData || Object.keys(updatedData).length === 0) {
        return res.status(400).json({
          ok: false,
          message: "No se proporcionaron datos para actualizar"
        });
      }

      // Buscar el item por _id, typeItem "planning-item", y ocid
      const itemToUpdate = await Items.findOne({
        _id: id,
        typeItem: "planning-item",
        ocid: ocid
      });

      // Verificar si el item fue encontrado
      if (!itemToUpdate) {
        return res.status(404).json({
          ok: false,
          message: "No se encontró el item con el ID, typeItem y ocid proporcionados"
        });
      }

      // Actualizar el item con los nuevos datos
      Object.assign(itemToUpdate, updatedData);

      // Guardar el item actualizado en la base de datos
      await itemToUpdate.save();

      // Responder con el item actualizado
      return res.status(200).json({
        ok: true,
        message: "Item actualizado correctamente",
        item: itemToUpdate
      });
    } catch (error) {
      console.error("Error actualizando el item:", error);

      // Manejo de errores
      return res.status(500).json({
        ok: false,
        message: "Hubo un error al actualizar el item",
        error: error.message
      });
    }
  }






















}

module.exports = PlanningController;
