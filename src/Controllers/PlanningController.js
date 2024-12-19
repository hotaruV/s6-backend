//import { response } from "express";
import getID from "../helpers/getId";
import planning from "../models/planning/planning";
import actor from "../models/planning/actor";
import requestForQuote from "../models/planning/requestForQuote";
import Solquotes from "../models/planning/SolQuotes";
import QuotesPeriod from "../models/planning/period";
import mongoose from "mongoose";

import Classifications from "../models/items/classification";
import additionalClassifications from "../models/items/additionalClassifications";
import ItemValue from "../models/items/unit/values";

import quotes from "../models/quotes/quotes";
import Quo from "../models/quotes/_quo";
import cotizados from "../models/planning/cotizados";
import buyers from "../models/buyer/buyer";
//import butgetGen from "../models/budget/budget";
import Budgets from "../models/_budget/_budget";
import Budgetvalue from "../models/planning/values";
import BudgetBreakdown from "../models/budgetBreakdown/budgetBreakdown";
import BudgetBreakdownvalue from "../models/budgetBreakdown/value";
import BudgetBreakdownperiodo from "../models/budgetBreakdown/period";
import BudgetLine from "../models/budgetLines/budgetLine";
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


import ValuesQuotes from '../models/quotes/value'; // Modelo de valuesQuotes
import PeriodsQuotes from '../models/planning/period'; // Modelo de periodsQuotes
import SupplierQuotes from '../models/planning/suppliers'; // Modelo de supplierQuotes



const PlanningController = {



  planning: async (req, res = response) => {
    const form = req.body;
    const ocid = req.body.id;
    let arrayDocs = [];
    let arrayMiles = [];

    try {
      // Buscar documentos relacionados con la planeación
      const docs = await documents.find({ documentType: 'planning', document_id: ocid });

      if (!docs || docs.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "No se han agregado documentos a la planeación",
        });
      }

      // Extraer los IDs de los documentos encontrados
      arrayDocs = docs.map(doc => doc._id);

      // Buscar hitos relacionados con la planeación
      const miles = await milestones.find({ milestoneType: 'planning', document_id: ocid });


      if (!miles || miles.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "No se han agregado acciones a la planeación",
        });
      }
      arrayMiles = miles.map(mile => mile._id);




      // Crear el presupuesto
      const newBudget = new Budgets({
        id: form.budget.id,
        description: form.budget.description,
        project: form.budget.project,
        projectID: form.budget.projectID,
        uri: form.budget.uri,
      });
      await newBudget.save();

      // Guardar el valor del presupuesto
      const budgetValue = new Budgetvalue({
        amount: form.budget.value.amount,
        currency: form.budget.value.currency,
        budget: newBudget._id,
      });
      await budgetValue.save();

      // Guardar desgloses y sus valores, periodos y líneas
      for (const breakdown of form.budget.budgetBreakdown) {
        const newBreakdown = new BudgetBreakdown({
          id: breakdown.id,
          description: breakdown.description,
          uri: breakdown.uri,
          budget: newBudget._id,
        });
        await newBreakdown.save();

        const breakdownValue = new BudgetBreakdownvalue({
          amount: breakdown.value.amount,
          currency: breakdown.value.currency,
          breakdown: newBreakdown._id,
        });
        await breakdownValue.save();

        const breakdownPeriod = new BudgetBreakdownperiodo({
          startDate: breakdown.period.startDate,
          endDate: breakdown.period.endDate,
          maxExtentDate: breakdown.period.maxExtentDate,
          durationInDays: breakdown.period.durationInDays,
          breakdown: newBreakdown._id,
        });
        await breakdownPeriod.save();

        for (const line of breakdown.budgetLines) {
          const newLine = new BudgetLine({
            id: line.id,
            origin: line.origin,
            breakdown: newBreakdown._id,
          });
          await newLine.save();
        }
      }

      // Crear la planeación
      let planningForm = {
        id: form.id,
        rationale: form.rationale,
        hasQuotes: form.hasQuotes,
        documents: [...arrayDocs, ...(form.documents || [])], // Combinar documentos encontrados y del formulario
        requestingUnits: form.requestingUnits,
        responsibleUnits: form.responsibleUnits,
        contractingUnits: form.contractingUnits,
        requestForQuotes: form.requestForQuotes || [],
        budget: newBudget._id,
        milestones: [...arrayMiles, ...(form.milestones || [])],
      };

      // Verificar si ya existe una planeación con el mismo ID
      const existingPlanning = await planning.findOne({ id: form.id });

      if (existingPlanning) {
        return res.status(400).json({
          ok: false,
          msg: "Solo se puede crear una planeación por contrato",
        });
      } else {
        const plan = new planning(planningForm);
        await plan.save();

        return res.status(200).json({
          ok: true,
          _id: plan._id,
        });
      }
    } catch (error) {
      console.error("Error al guardar el presupuesto o la planeación:", error);
      return res.status(500).json({
        ok: false,
        msg: "Error en servidor. Por favor, comuníquese con el soporte.",
        error: error.message,
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
          //console.log("Saved Item: ", savedItem);
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
  },
  saveQuotes: async (req, res = response) => {
    const { ocid, itemPlanning } = req.params; // Obtenemos los parámetros de la URL
    const { id, description, date, items, value, period, issuingSupplier } = req.body; // Obtenemos los datos del body

    // Verificamos si todos los datos necesarios están presentes
    if (!id || !description || !date || !period) {
      return res.status(400).json({
        message: 'Faltan datos necesarios en el cuerpo de la solicitud.',
        missingFields: {
          id,
          description,
          date,
          period,
        }
      });
    }

    try {
      // Buscar el RequestForQuotes usando el 'itemPlanning' (su ID)
      const requestForQuotes = await RequestForQuotes.findById(itemPlanning);
      if (!requestForQuotes) {
        return res.status(404).json({
          message: 'No existe una solicitud de cotización con ese ID.'
        });
      }

      // Creamos un array de ObjectIds a partir de invitedSuppliers
      const invitedSuppliersIds = requestForQuotes.invitedSuppliers.map(supplier => supplier.toString());

      // Verificar si hay proveedores invitados
      if (invitedSuppliersIds.length === 0) {
        return res.status(400).json({
          message: 'No hay proveedores invitados en esta solicitud de cotización.'
        });
      }

      // Buscar los proveedores en SupplierQuotes cuyos IDs están en invitedSuppliers
      const suppliers = await SupplierQuotes.find({ _id: invitedSuppliersIds });

      // Verificar si se encontraron proveedores
      if (suppliers.length === 0) {
        return res.status(400).json({
          message: `No se encontraron proveedores con los IDs de los proveedores invitados.`
        });
      }

      // Seleccionamos el proveedor emisor de la cotización (esto lo recibimos directamente desde la petición)
      const supplier = suppliers[0];


      // Validación de los items de la cotización, permitimos items vacíos
      let savedItems = [];
      if (items && items.length > 0) {
        savedItems = await Promise.all(
          items.map(async (itemForm) => {
            const item = await Items.findById(itemForm.id);
            if (!item) {
              return res.status(400).json({
                message: `El item con ID ${itemForm.id} no existe.`
              });
            }
            return item._id;  // Retornamos el ID del item validado
          })
        );
      }

      // Crear y guardar el Value para la cotización
      const valueQuote = new ValuesQuotes({
        amount: value.amount || 0,
        currency: value.currency || 'USD'  // Asumimos USD si no se especifica
      });

      const savedValueQuote = await valueQuote.save();

      // Crear y guardar el Periodo para la cotización
      const periodQuote = new PeriodsQuotes({
        startDate: period.startDate || '',
        endDate: period.endDate || '',
        maxExtentDate: period.maxExtentDate || '',
        durationInDays: period.durationInDays || 0
      });

      const savedPeriodQuote = await periodQuote.save();

      // Crear y guardar el proveedor emisor de la cotización (usamos los datos del proveedor encontrado)
      const supplierQuote = {
        name: supplier.name,
        id: supplier.id,
      };













      // Crear la cotización con los datos recibidos
      const savedQuote = new Quote({
        id: id,  // Aquí debe existir un valor para `id`
        description: description.toUpperCase(),  // Asegúrate de que `description` esté definido
        date: date,  // Asegúrate de que `date` esté definido
        items: savedItems,  // Asegúrate de que los items se hayan validado y guardado
        value: savedValueQuote._id,  // Verifica que `savedValueQuote._id` sea correcto
        period: savedPeriodQuote._id,  // Verifica que `savedPeriodQuote._id` sea correcto
        issuingSupplier: supplierQuote
      });

      // Guardar la cotización en la base de datos
      const savedQuoteDoc = await savedQuote.save();

      // Actualizar la solicitud de cotización con la nueva cotización
      requestForQuotes.quotes.push(savedQuoteDoc._id); // Agregamos la cotización al array de cotizaciones

      // Guardar el documento RequestForQuotes actualizado
      const updatedRequestForQuotes = await requestForQuotes.save();

      // Devolver una respuesta exitosa
      res.status(200).json({
        ok: true,
        message: 'Cotización agregada con éxito a la solicitud de cotización.',
        requestForQuotesId: updatedRequestForQuotes._id,
        quotes: updatedRequestForQuotes.quotes // Retornamos las cotizaciones actualizadas
      });

    } catch (error) {
      console.error('Error al guardar las cotizaciones:', error);
      res.status(500).json({
        message: 'Error al guardar las cotizaciones.',
        error: error.message
      });
    }






  },


  MostrarQuotes: async (req, res) => {
    try {
      // Obtener los IDs enviados desde el frontend
      let { quotes } = req.body;

      //console.log('IDs recibidos antes de procesar:', quotes);

      // Verificar si 'quotes' es un array y aplanarlo si es necesario
      if (!Array.isArray(quotes)) {
        return res.status(400).json({
          success: false,
          message: 'El formato de los IDs enviados no es válido.',
        });
      }

      // Aplanar el array si está anidado
      quotes = quotes.flat();
      const mongoose = require('mongoose');
      const validIds = quotes.filter(id => mongoose.Types.ObjectId.isValid(id));

      if (validIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se encontraron IDs válidos para buscar.',
        });
      }

      // Buscar solo los campos '_id' y 'description' en la colección de MongoDB
      const results = await Quote.find(
        { _id: { $in: validIds } }, // Condición para buscar
        { _id: 1, description: 1 }  // Proyección: Solo devuelve '_id' y 'description'
      );

      // Devolver los resultados encontrados
      return res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('Error al buscar cotizaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Hubo un error al procesar la solicitud.',
      });
    }



  },
  saveItemsForQuotes: async (req, res) => {
    try {
      let form = req.body;  // Datos enviados desde el formulario
      let id = req.params.id;  // ID de la cotización a actualizar

      // Validar que los campos necesarios están presentes
      if (!form.description || !form.classification || !form.classification.scheme || !form.classification.id || !form.classification.description || !form.classification.uri || !form.quantity || !form.unit || !form.unit.id || !form.unit.name || !form.unit.value || !form.unit.value.amount || !form.unit.value.currency) {
        return res.status(400).json({ success: false, message: 'Faltan campos requeridos en el formulario.' });
      }

      // Buscar el quote por ID
      const quote = await Quote.findById(id);

      if (!quote) {
        return res.status(404).json({ success: false, message: 'Quote no encontrado' });
      }

      // Crear los objetos necesarios para la cotización
      const newItem = new Items({
        description: form.description ? form.description.toUpperCase() : "",
        typeItem: form.typeItem, // Verificar que form.description esté presente
        classification: new Classification({
          scheme: form.classification.scheme ? form.classification.scheme : "",  // Verificar que form.classification.scheme esté presente
          id: form.classification.id ? form.classification.id : "",  // Verificar que form.classification.id esté presente
          description: form.classification.description ? form.classification.description.toUpperCase() : "",  // Verificar que form.classification.description esté presente
          uri: form.classification.uri ? form.classification.uri : "",  // Verificar que form.classification.uri esté presente
        }),
        additionalClassifications: form.additionalClassifications && form.additionalClassifications.length > 0 ? form.additionalClassifications.map(ac => new AdditionalClassification({
          scheme: ac.scheme || "",  // Verificar que ac.scheme esté presente
          id: ac.id || "",  // Verificar que ac.id esté presente
          description: ac.description || "",  // Verificar que ac.description esté presente
          uri: ac.uri || ""  // Verificar que ac.uri esté presente
        })) : [new AdditionalClassification({
          scheme: "", id: "", description: "", uri: ""
        })],
        quantity: form.quantity ? parseInt(form.quantity) : 0,  // Asegurarse de que quantity sea un número
        unit: new Unit({
          id: form.unit.id ? form.unit.id : "",  // Verificar que form.unit.id esté presente
          name: form.unit.name ? form.unit.name.toUpperCase() : "",  // Verificar que form.unit.name esté presente
          value: new Value({
            amount: form.unit.value.amount ? form.unit.value.amount : 0,  // Verificar que form.unit.value.amount esté presente
            currency: form.unit.value.currency ? form.unit.value.currency : ""  // Verificar que form.unit.value.currency esté presente
          }),
          uri: form.unit.uri ? form.unit.uri : "",  // Verificar que form.unit.uri esté presente
        })
      });

      // Guardar el nuevo item
      const savedItem = await newItem.save();

      // Agregar el ObjectId del item a los items del quote
      quote.items.push(savedItem._id);

      // Guardar la cotización actualizada con el nuevo item
      await quote.save();

      return res.status(200).json({
        success: true,
        message: 'Cotización y item actualizado exitosamente',
        data: savedItem,
      });
    } catch (error) {
      console.error('Error al guardar los items:', error);
      return res.status(500).json({
        success: false,
        message: 'Hubo un error al procesar la solicitud.',
      });
    }
  }
































}

module.exports = PlanningController;
