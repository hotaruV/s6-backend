import { response } from "express";

import planning from "../models/planning/planning";

//import butgetGen from "../models/budget/budget";
import Budgets from "../models/planning/budget/budget.js";
import BudgetBreakdown from "../models/planning/budget/budgetBreakdown.js";
import BudgetLine from "../models/planning/budget/bugetLines.js";

import documents from "../models/documents/documents";
import milestones from "../models/documents/milestones";

// Importar los modelos
import Items from "../models/items/items";
import Classification from "../models/items/classification";
import AdditionalClassification from "../models/items/additionalClassifications.js";
import Unit from "../models/items/unit/unit";
import Value from "../models/items/unit/values";
import Supplier from "../models/planning/suppliers.js";
import Period from "../models/planning/period.js";
import Quote from "../models/planning/quotes/quotes.js";
import RequestForQuotes from "../models/planning/requestForQuote";


import ValuesQuotes from '../models/planning/quotes/value.js'; // Modelo de valuesQuotes
import PeriodsQuotes from '../models/planning/period'; // Modelo de periodsQuotes
import SupplierQuotes from '../models/planning/suppliers'; // Modelo de supplierQuotes



const PlanningController = {

  planning: async (req, res = response) => {
    const form = req.body;
    const ocid = req.body.id;
    let arrayDocs = [];
    let arrayMiles = [];
    let arrayReq = [];
    let arrayBug = [];

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

      const reqQuotes = await RequestForQuotes.find({ id: ocid });
      if (!reqQuotes || reqQuotes.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "No se han agregado cotizaciones a la planeación",
        });
      }

      arrayReq = reqQuotes.map(requo => requo._id);

      const Bug = await Budgets.find({ id: ocid });
      if (!arrayBug || reqQuotes.length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "No se han agregado prespuestos a la planeación",
        });
      }

      arrayBug = Bug.map(requo => requo._id);
      // Crear la planeación
      let planningForm = {
        id: form.id,
        rationale: form.rationale,
        hasQuotes: form.hasQuotes,
        documents: [...arrayDocs, ...(form.documents || [])], // Combinar documentos encontrados y del formulario
        requestingUnits: form.requestingUnits,
        responsibleUnits: form.responsibleUnits,
        contractingUnits: form.contractingUnits,
        requestForQuotes: [...arrayReq],
        budget: [...arrayBug],
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

  budget: async (req, res = response) => {
    //console.log(req.body)
    try {
      //console.log("Datos recibidos:", JSON.stringify(req.body, null, 2));

      const { id, description, value, project, projectID, uri, budgetBreakdown } = req.body;

      // Validar que los datos requeridos estén presentes
      if (!id || !description || !value || !uri || !budgetBreakdown) {
        return res.status(400).json({
          message: "Faltan datos requeridos en el presupuesto",
        });
      }

      // Crear y guardar los BudgetBreakdown y BudgetLines
      const savedBreakdowns = await Promise.all(
        budgetBreakdown.map(async (breakdown) => {
          const { id, description, value, uri, period, budgetLines } = breakdown;

          // Validar que los valores del breakdown estén completos
          if (!id || !description || !value || !uri || !period || !budgetLines) {
            return res.status(400).json({
              message: "Faltan datos requeridos en un BudgetBreakdown",
            });
          }

          // Crear y guardar los BudgetLines relacionados con el breakdown
          const savedLines = await Promise.all(
            budgetLines.map(async (line) => {
              const { id, origin, components, sourceParty } = line;

              // Validar que los valores del BudgetLine estén completos
              if (!id || !origin || !sourceParty) {
                return res.status(400).json({
                  message: "Faltan datos requeridos en un BudgetLine",
                });
              }

              // Si no hay componentes, asignar un valor vacío o por defecto
              const savedComponents = components && components.length > 0 ? components.map((component) => {
                return {
                  name: component.name || "",
                  level: component.level || "",
                  code: component.code || "",
                  description: component.description || "",
                };
              }) : []; // Evitar que los componentes estén vacíos o no definidos

              // Crear y guardar el BudgetLine
              const newBudgetLine = new BudgetLine({
                id,
                origin,
                components: savedComponents, // Asignar componentes válidos
                sourceParty,
              });

              // Guardar el BudgetLine y devolver el documento completo
              const savedLine = await newBudgetLine.save();

              // Verificar que la línea se guardó correctamente
              if (!savedLine._id) {
                throw new Error('No se pudo guardar la línea de presupuesto');
              }

              return savedLine; // Asegúrate de devolver el objeto completo
            })
          );

          // Crear el BudgetBreakdown con referencia a las líneas presupuestarias
          const newBreakdown = new BudgetBreakdown({
            id,
            description,
            value,
            uri,
            period,
            budgetLines: savedLines.map((line) => line._id), // Referencias a las líneas guardadas
          });

          // Guardar el Breakdown y devolver el documento completo
          const savedBreakdown = await newBreakdown.save();
          return savedBreakdown;
        })
      );

      // Crear y guardar el presupuesto principal (Budget)
      const newBudget = new Budgets({
        id,
        description,
        value,
        project,
        projectID,
        uri,
        budgetBreakdown: savedBreakdowns.map((breakdown) => breakdown._id), // Referencias a los breakdowns guardados
      });

      const savedBudget = await newBudget.save();

      // Responder con el presupuesto guardado
      return res.status(201).json({
        message: "Presupuesto guardado con éxito",
        ok: true,
        //budget: savedBudget,
      });
    } catch (error) {
      console.error("Error al guardar el presupuesto:", error);
      // Evitar enviar múltiples respuestas
      if (!res.headersSent) {
        return res.status(500).json({
          message: "Error al guardar el presupuesto",
          error: error.message,
        });
      }
    }
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
      // Obtener el ocid de los parámetros
      const { ocid } = req.params;

      // Validar que el ocid exista en la solicitud
      if (!ocid) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro ocid es requerido.',
        });
      }

      // Buscar las cotizaciones relacionadas con el ocid y devolver solo id y description
      const quotes = await Quote.find(
        { id: ocid }, // Condición de búsqueda
        { id: 1, description: 1 } // Proyección: Solo devuelve 'id' y 'description'
      );

      // Responder con los datos encontrados
      return res.status(200).json({
        success: true,
        data: quotes,
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
      // console.log(id)


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
        id: form.id,
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
