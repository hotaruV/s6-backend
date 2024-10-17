import { response } from "express";
import getID from "../helpers/getId";
import contrato from "../models/contrato";
import contratoUser from "../models/contratoUsuario";
import co from "../models/count";
import planning from "../models/planning/planning";
import bugget from "../models/planning/values";
import tender from "../models/tenders/tenders";

const ReleaseController = {
  contratoCreate: async (req, res = response) => {
    try {
      let idContract;

      const id = await co.findOne();
      //const id = "668a04f506f79c0b9cd989e0";
      idContract = id._id;
      const buy = await co.findOne({ _id: idContract });

      if (!buy) {
        return res.status(404).json({
          ok: false,
          msg: "No existe count",
        });
      }

      const contratoUpdated = await co.findByIdAndUpdate(
        id,
        { $inc: { contract_count: +1 } },
        {
          new: true,
        }
      );

      const lic = new contrato(req.body);
      let count = await getID(contrato, false, idContract);
      lic.id = count;
      count = await getID(contrato, true);
      let date = new Date().toDateString();
      //let nueva = date.split(" ").join("-");
      lic.ocid = `${count}`;
      lic.date = date;
      lic.uid = req.uid;
      lic.initiationType = "tender";
      lic.language = "es";
      lic.buyer = null;
      lic.awards = [];
      lic.tender = null;
      lic.contracts = [];
      lic.parties = null;
      lic.planning = null;
      lic.active = false;
      await lic.save();

      const Userlic = new contratoUser(req.body);
      Userlic.uid = req.uid
      Userlic.ocid = lic.ocid
      await Userlic.save()

      return res.status(200).json({
        ok: true,
        ocid: lic.ocid,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  contratoShow: async (req, res = response) => {
    try {
      const uid = req.uid;
      const [contratos, total] = await Promise.all([
        contrato.find(
          { uid }
          //"ocid id date language tag initiationType parties buyer awards contracts"
        ),
        contrato.countDocuments(),
      ]);
      res.status(200).json({
        ok: true,
        contratos,
        total,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el contrato o no pertenece a este usuario",
      });
    }
  },
  contratoShowFinal: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const lic = await contrato.findOne({ ocid });
      if (!lic) {
        return res.status(404).json({
          ok: false,
          msg: "No hay contratos registrados",
        });
      }
      //console.log(lic);
      res.status(200).json({
        version: "1.1",
        uri: "https://github.com/open-contracting/sample-data/raw/1.1/fictional-example/ocds-213czf-000-00001.json",
        publishedDate: "2022-11-10T00:00:00Z",
        publisher: {
          name: "Open Data Services Co-operative Limited",
          scheme: "GB-SLP",
          //uid: "9506232.0",
          uri: "http://data.companieshouse.gov.uk/doc/company/09506232",
        },
        license: "http://opendatacommons.org/licenses/pddl/1.0/",
        publicationPolicy: "https://github.com/open-contracting/sample-data/",
        release: [{
          ocid: lic.ocid,
          date: lic.date,
          language: lic.language,
          tag: ["planning"],
          initiationType: lic.initiationType,
          parties: lic.parties,
          buyer: {
            id: lic.buyer.id,
            name: lic.buyer.name,
          },
          planning: {
            rationale: lic.planning.rationale,
            budget: {
              amount: {
                amount: lic.planning.budget.amount.amount,
                currency: lic.planning.budget.amount.currency,
              },
              description: lic.planning.budget.description,
              uri: lic.planning.budget.uri,
            },
            documents: lic.planning.documents,
            milestones: lic.planning.milestones,
          },

          //planning: lic.planning,
          tender: lic.tender,
          awards: lic.awards,
          contracts: lic.contracts,
        }],
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el contrato o no pertenece a este usuario",
      });
    }
  },
  contratoShowPublica: async (req, res = response) => {
    try {
      const uid = req.uid;
      const ocid = req.params.ocid;
      const lic = await contrato
        .find({ ocid })
        .populate("parties", "-__v")
        .populate("buyer", "-__v")
        .populate("awards", "-__v")
        .populate("contracts", "-__v");
      if (!lic) {
        return res.status(404).json({
          ok: false,
          msg: "No hay contratos registrados",
        });
      }
      //console.log(lic);
      res.status(200).json({
        version: "1.1",
        uri: "https://github.com/open-contracting/sample-data/raw/1.1/fictional-example/ocds-213czf-000-00001.json",
        publishedDate: "2022-11-10T00:00:00Z",
        publisher: {
          name: "Open Data Services Co-operative Limited",
          scheme: "GB-COH",
          uid: "9506232.0",
          uri: "http://data.companieshouse.gov.uk/doc/company/09506232",
        },
        license: "http://opendatacommons.org/licenses/pddl/1.0/",
        publicationPolicy: "https://github.com/open-contracting/sample-data/",
        releases: [{
          ocid: lic[0].ocid,
          id: lic[0].id,
          date: lic[0].date,
          language: lic[0].language,
          tag: ["planning"],
          initiationType: lic[0].initiationType,
          parties: lic[0].parties,
          buyer: lic[0].buyer,
          planning: lic[0].planning,
          tender: lic[0].tender,
          awards: lic[0].awards,
          contracts: lic[0].contracts,
        }],
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el contrato o no pertenece a este usuario",
      });
    }
  },
  allContratos: async (req, res) => {
    //console.log(desde);
    let tot = 0;
    const [contratos, costo] = await Promise.all([
      contrato.find({ active: true }),
      tot++,
    ]);
    //console.log(tot);
    res.status(200).json({
      ok: true,
      contratos,
      total: tot,
      costo,
    });
  },
  contratoByUser: async (req, res) => {
    const uid = req.uid;
    //console.log(uid);
    const cont = await contrato
      .find(
        { uid: uid },

      )
      .exec();
    res.status(200).json({
      ok: true,
      contrato: cont,
    });
  },
  contratoByUserOCID: async (req, res) => {
    try {
      let ocid = req.params.ocid;
      let contratos_id = [];
      const uid = req.uid;
      let cont = await contrato.find({ uid })
      cont.forEach((item) => {
        contratos_id.push(item.ocid)
      })
      res.status(200).json({
        //ok: true,
        contratos: contratos_id
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el contrato o no pertenece a este usuario",
      });
    }
  },
  contratoUpdate: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const buy = await contrato.findOne({ ocid });
      const id = buy._id;
      const active = buy.active;
      if (!buy) {
        return res.status(404).json({
          ok: false,
          msg: "No existe contratación",
        });
      }
      const { ...campos } = req.body;
      if (active == false) {
        const contratoUpdated = await contrato.findByIdAndUpdate(id, campos, {
          new: true,
        });
        res.status(200).json({
          ok: true,
          release: contratoUpdated,
        });
      } else {
        res.status(400).json({
          ok: false,
          msg: "Contrato sellado no puede actualizarse",
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... contratación no existe",
      });
    }
  },
  contratoUpdateStatus: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const buy = await contrato.findOne({ ocid });
      const id = buy._id;
      if (!buy) {
        return res.status(404).json({
          ok: false,
          msg: "No existe contratación",
        });
      }
      const contratoUpdated = await contrato.findByIdAndUpdate(
        id,
        { active: false },
        {
          new: true,
        }
      );
      res.status(200).json({
        ok: true,
        contratoUpdated,
        active: contratoUpdated.active
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... contratación no existe",
      });
    }
  },
  contratoUpdateDocument: async (req, res = response) => { },

  getInfoEjecucion: async (req, res = response) => {
    //try {
      const ocid = req.params.ocid;

      // Comprueba si existe.
      if (!ocid || ocid == null) {
        return res.status(404).send({
          ok: 'false',
          msg: 'ocid inválido'
        });
      }

      const contr = await contrato.findOne({ ocid });
      console.log(contr);
      return



      

      // const oPlanning = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   rationale: "Adquisición de vehículos utilitarios para el uso de la SESEA",
      // }

      // const oPlanningBudget = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   description: "5411 Vehículos y equipo terrestre",
      //   uri: "https://www.conac.gob.mx/work/models/CONAC/normatividad/NOR_01_02_006.pdf",
      //   amount: {
      //     amount: 712825,
      //     currency: "MXN",
      //   }
      // }

      // const oTender = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   title: "SESEA/DGA/C001 RELATIVA A LA ADQUISICIÓN DE AUTOMOVILES UTILITARIO",
      //   description: "ADQUISICIÓN DE 4 AUTOMOVILES UTIITARIOS",
      //   procurementMethod: "selective",
      //   procurementMethodDetails: "Invitación a cuando menos tres personas",
      //   procurementMethodRationale: "Articulo 39, segundo párrafo de la Ley de Adquisiciones, Arrendamiento y Servicios del estado de Aguascalientes y sus Municipios.",
      //   awardCriteria: "costOnly"
      // }

      // const oItemUnits = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   amount: 510000,
      //   currency: "MXN",
      // }

      // const oMinValues = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   amount: 510000,
      //   currency: "MXN",
      // }

      // const oProcuringEntities = {
      //   ocid: "ocds-7e7fnm-000-00002",
      //   name: "SECRETARIA EJECUTIVA DEL SISTEMA ESTATAL ANTICORRUPCION",

      // }

      if (!oPlanning) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el contrato",
        });
      }

      res.status(200).json({
        ok: true,
        msg: 'Si entró',
        oPlanning, oPlanningBudget, oTender, oItemUnits, oMinValues, oProcuringEntities
      });
      
    // } catch (error) {
    //   res.status(500).json({
    //     ok: false,
    //     msg: "Error Inesperado: " + error,
    //   });
    // }
  },
};

module.exports = ReleaseController;
