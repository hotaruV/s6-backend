import { response } from "express";
import getID from "../helpers/getId";
import contratos from "../models/contracts/contracts";
import ContractPeriod from "../models/contracts/contractPeriod";
import valueContract from "../models/contracts/value";
import valueS from "../models/contracts/value";
import contractIm from "../models/contracts/contractIm/contract";
import contractEn from "../models/contracts/contractEn/contract";
import implementation from "../models/contracts/contractIm/implementation";
import Documents from "../models/documents/documents";
import Items from "../models/items/items";
import ItemValue from "../models/items/unit/values";
import Classifications from "../models/items/classification";
import Unit from "../models/items/unit/unit";
import deliveryLocation from "../models/contracts/deliveryLocation";
import deliveryAddress from "../models/contracts/deliveryAddress";
import itemcontratados from "../models/contracts/itemcontratados";
import periodGuaranteesSchema from "../models/contracts/period";
import guarantor from "../models/contracts/guarantor";
import guarantees from "../models/contracts/guarantees";
import payer from "../models/contracts/payer";
import payeer from "../models/contracts/payeer";
import transactions from "../models/contracts/transactions";
import milestones from "../models/documents/milestones";
import implementationCont from "../models/contracts/implementation";
import relatedProcesses from "../models/contracts/relatedProcesses";
import amendmentsCont from "../models/contracts/amendments";

const ContractsController = {
  ContractPeriod: async (req, res = response) => {
    try {
      let fecha_fin = new Date(req.body.endDate).getTime();
      let fecha_inicio = new Date(req.body.startDate).getTime();
      let maxExtend = new Date(req.body.maxExtentDate).getTime();
      if (fecha_inicio > fecha_fin) {
        return res.status(400).json({
          ok: false,
          msg: "La Fecha final no debe se menor a la fecha de inicio",
        });
      }

      let diff = maxExtend - fecha_inicio;
      let period = diff / (1000 * 60 * 60 * 24);

      const Period = new ContractPeriod(req.body);
      Period.durationInDays = period;
      await Period.save();

      return res.status(200).json({
        ok: true,
        _id: Period._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  ContractPeriodShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await ContractPeriod.findById({ _id: id });
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
  ContractPeriodUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const id = await ContractPeriod.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe periodo de contratacion",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await ContractPeriod.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        ContractPeriod: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... periodo de contratación no existe",
      });
    }
  },
  value: async (req, res = response) => {
    try {
      //console.log(req.body);
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
  ValuesShow: async (req, res = response) => {
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
        values: cp,
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
  contractCreate: async (req, res = response) => {
    console.log("Entre a contractCreate de contractCOntroller" );
    let count = await getID(contratos);
    //construir todos los guardados
    const id = req.body.id;
    const title = req.body.contractstitle.toUpperCase();
    const description = req.body.contractsdescription.toUpperCase();
    const status = req.body.contractsstatus.toUpperCase();
    
    const periodo=new ContractPeriod();
    periodo.id= count;//req.body.suppliers.id;
    periodo.startDate=req.body.contractPeriod.startDate;
    periodo.endDate=req.body.contractPeriod.endDate;
    periodo.maxExtentDate=req.body.contractPeriod.maxExtentDate;
    periodo.durationInDays=req.body.contractPeriod.durationInDays;
    periodo.ocid= req.body.id;
    periodo.save();
   
    
    const _value = req.body.value;
    const value_= new valueS();
   
    value_.id=`000${count}-contracts`;//req.body.id;
    value_.amount=_value.amount;
    value_.currency=_value.currency;
    value_.ocid=req.body.id;
    value_.save();

     //items
     const array_item = [];
     const items = req.body.items;
     console.log("items" +items);
   //  items.forEach(element => {

     const item= new Items();
    
     item.id='item-'+items.id;
     item.typeItem='contract-contratados';
     item.title=items.title;
     item.description=items.description;
 
     const _classification = items.classification;
     const classification= new Classifications();
     classification.id=_classification.id;
     classification.scheme=_classification.scheme;
     classification.description=_classification.description;
     classification.uri=_classification.uri;
     classification.ocid=req.body.id;
     classification.save();
     
     item.classification=classification._id;
 
     const _value1 = items.unit.value;
     const value= new ItemValue();
     value.id=classification.id;
     value.amount=_value1.amount;
     value.currency=_value1.currency;
     value.ocid=req.body.id;
     value.save();

     const _unit = items.unit;

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
     item.quantity=items.quantity;
 
     item.save();
    
     array_item.push(item._id);

 //  });
    //end items

     const _deliveryLocation = req.body.items.deliveryLocation;
     const deliveryLocation_= new deliveryLocation();
    
     deliveryLocation_.id=`000${count}-contracts`;//req.body.id;
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
    
     deliveryAddress_.id=`000${count}-contracts`;//req.body.id;
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
    
     itemCont_.id=`000${count}-contracts`;//req.body.id;
     itemCont_.ocid=req.body.id;
     itemCont_.items=array_item;
     itemCont_.deliveryLocation=deliveryLocation_._id;
     itemCont_.deliveryAddress=deliveryAddress_._id;

     itemCont_.save();

    const dateSigned = req.body.dateSigned;
    
    const surveillanceMechanisms = req.body.surveillanceMechanisms.toUpperCase();
   
    const _value2 = req.body.guarantees.value;
    const valueGua_= new valueContract();
    valueGua_.id=classification.id;
    valueGua_.amount=_value2.amount;
    valueGua_.currency=_value2.currency;
    valueGua_.ocid=req.body.id;
    valueGua_.save();

    const _valueg = req.body.guarantees.guarantor;
    const guarantor_=new guarantor ();

    guarantor_.id=_valueg.id;
    guarantor_.name= _valueg.name;
    guarantor_.ocid= req.body.id;
    guarantor_.save();
    
    const periodoGua=new periodGuaranteesSchema();
    periodoGua.id= count;//req.body.suppliers.id;
    periodoGua.startDate=req.body.guarantees.period.startDate;
    periodoGua.endDate=req.body.guarantees.period.endDate;
    periodoGua.maxExtentDate=req.body.guarantees.period.maxExtentDate;
    periodoGua.durationInDays=req.body.guarantees.period.durationInDays;
    periodoGua.ocid= req.body.id;
    periodoGua.save();

    const _guarantees = req.body.guarantees;
    const guarantees_= new guarantees();
   
    guarantees_.id=`000${count}-contracts`;//req.body.id;
    guarantees_.ocid=req.body.id;
    guarantees_.type=_guarantees.guaranteestype;
    guarantees_.Date=_guarantees.guaranteesDate;
    guarantees_.obligations=_guarantees.guaranteesobligations;

    guarantees_.value=valueGua_._id;
    guarantees_.guarantor=guarantor_._id;
    guarantees_.period=periodoGua._id;

    guarantees_.save();
    
       //documents
   const docsC = req.body.documents;
   console.log("docs" +docsC);
   const arraydocs = [];

   docsC.forEach(element => {
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

   const _valuimp = req.body.implementation.transactions.value;
   const impvalue_=new guarantor ();

   impvalue_.id=_valuimp.id;
   impvalue_.name= _valuimp.name;
   impvalue_.ocid= req.body.id;
   impvalue_.save();

   const _payeer = req.body.implementation.transactions.payee;
   const payeer_=new payeer ();

   payeer_.id=_payeer.id;
   payeer_.name= _payeer.name;
   payeer_.ocid= req.body.id;
   payeer_.save();

   const _payer = req.body.implementation.transactions.payer;
   const payer_=new payer ();

   payer_.id=_payer.id;
   payer_.name= _payer.name;
   payer_.ocid= req.body.id;
   payer_.save();

   const _valutransa = req.body.implementation.transactions;
   const transactions_=new transactions ();
   transactions_.id=_valutransa.id;
   transactions_.ocid= req.body.id;
   transactions_.source=_valutransa.source;
   transactions_.paymentMethod=_valutransa.paymentMethod;
   transactions_.date=_valutransa.date;
   transactions_.value=impvalue_._id;
   transactions_.payer=payer_._id;
   transactions_.payeer=payeer_._id;
   transactions_.uri=_valutransa.uri;
   transactions_.save();

     //documents
     const docsImp = req.body.implementation.documents;
     console.log("docs" +docsImp);
     const arraydocs2 = [];
  
     docsImp.forEach(element => {
      const documents2_ = new Documents();
      
      documents2_.id=element.id;
      documents2_.title=element.title;
      documents2_.Type=element.Type;
      documents2_.description=element.description;
      documents2_.url=element.url;
      documents2_.format=element.format;
      documents2_.language=element.language;
      documents2_.datePublished=element.datePublished;
      documents2_.dateModified=element.dateModified;
  
      documents2_.save();
      arraydocs2.push(documents2_._id);
      
    });
     //enddocuments

     //hitos
   const hits = req.body.implementation.milestones;
   console.log("hits" +hits);
   const arrayhits = [];

   hits.forEach(element => {
    const hito_ = new milestones();

    hito_.id=req.body.id;
    hito_.title=element.milestonestitle;
    hito_.type=element.milestonesType;
    hito_.description=element.milestonesdescription;
    hito_.code=element.milestonescode;
    hito_.dueDate=element.milestonesdueDate;
    hito_.dateMet=element.milestonesdateMet;
    hito_.dateModified=element.milestonesdateModified;
    hito_.status=element.milestonesstatus;

    hito_.save();
    arrayhits.push(hito_._id);
    
  });
   //end hitos
   const _valuimplementation = req.body.implementation;
   const implementation_=new implementationCont ();
   implementation_.id=_valutransa.id;
   implementation_.ocid= req.body.id;
   implementation_.status=_valuimplementation.status;
   implementation_.transactions=transactions_._id;
   implementation_.milestones=arrayhits;
   implementation_.documents=arraydocs2;
  
   implementation_.save();

   const _valurelatedProcesses = req.body.relatedProcesses;
   const relatedProcesses_=new implementationCont ();
   relatedProcesses_.id=req.body.id;
   relatedProcesses_.ocid= req.body.id;
   relatedProcesses_.relationship=_valurelatedProcesses.relatedProcessesrelationship;
   relatedProcesses_.title=_valurelatedProcesses.relatedProcessestitle;
   relatedProcesses_.uri=_valurelatedProcesses.relatedProcessesuri; 
   relatedProcesses_.save();

      //hitos
   const hits2 = req.body.milestones;
   console.log("hits" +hits);
   const arrayhits2 = [];

   hits2.forEach(element => {
    const hito2_ = new milestones();

    hito2_.id=req.body.id;
    hito2_.title=element.milestonestitle;
    hito2_.type=element.milestonesType;
    hito2_.description=element.milestonesdescription;
    hito2_.code=element.milestonescode;
    hito2_.dueDate=element.milestonesdueDate;
    hito2_.dateMet=element.milestonesdateMet;
    hito2_.dateModified=element.milestonesdateModified;
    hito2_.status=element.milestonesstatus;

    hito2_.save();
    arrayhits2.push(hito2_._id);
    
  });
   //end hitos
   const _amendmentsCont = req.body.relatedProcesses;
   const amendmentsCont_=new amendmentsCont ();
   amendmentsCont_.id=req.body.id;
   amendmentsCont_.ocid= req.body.id;
   amendmentsCont_.rationale=_amendmentsCont.rationale;
   amendmentsCont_.date=_amendmentsCont.date;
   amendmentsCont_.description=_amendmentsCont.description; 
   amendmentsCont_.amendsReleaseID=_amendmentsCont.amendsReleaseID; 
   amendmentsCont_.releaseID=_amendmentsCont.releaseID; 
   amendmentsCont_.save();
   

    try {
      const contratosCount = await contratos.find({ id }).count();
      console.log("Entre a contratosCount " +contratosCount);
      if (contratosCount != 1) {

      const contract = new contratos(req.body);
      let count = await getID(contratos, false);

      contract.id = `${count}-contract`;
      contract.title=title;
      contract.ocid=req.body.id;
      contract.description=description;
      contract.status=status;
      contract.period=periodo._id;
      contract.value=value_._id;
      contract.items=array_item;
      contract.dateSigned=dateSigned;
      contract.surveillanceMechanisms=surveillanceMechanisms;
      contract.guarantees=guarantees_._id;
      contract.documents=arraydocs;
      contract.implementation=implementation_._id;
      contract.relatedProcesses=relatedProcesses_._id;
      contract.milestones =arrayhits2;
      contract.amendments =amendmentsCont_._id;
      await contract.save();
      return res.status(200).json({
        ok: true,
        _id: contract._id,
      });
    } else {// es para editar
      return res.status(200).json({
        ok: false,
        msg: "No se puede insertar más de un contrato",
      });
    }
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contractShowOne: async (req, res = response) => {
    try {
      const id = req.params.awardid;
      const ocid = req.params.ocid;
      const contract = await contratos.findOne({
        $and: [{ awardID: id }, { ocid }],
      });

      if (!contract) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contract: {
          id: contract.id,
          awardID: contract.awardID,
          title: contract.title,
          description: contract.description,
          status: contract.status,
          period: contract.period,
          value: contract.value,
          items: contract.items,
          dateSigned: contract.dateSigned,
          documents: contract.documents,
        },
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },


  getContracto: async (req, res = response) => {
    try {
      //console.log(req.params);
      const ocid = req.params.ocid;

      const award_id = req.params.awardid;
      const contract_id = req.params.contract_id


      const contract = await contratos.findOne(
        {
          $and: [
            { award_id }, { ocid }, { _id: contract_id }
          ]
        }
      );

      if (!contract) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contract: {
          id: contract.id,
          awardID: contract.awardID,
          title: contract.title,
          description: contract.description,
          status: contract.status,
          period: contract.period,
          value: contract.value,
          items: contract.items,
          dateSigned: contract.dateSigned,
          documents: contract.documents,
        },
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  contractShowAllID: async (req, res = response) => {
    try {
      let arrayContract = [];
      const id = req.params.awardid;
      const ocid = req.params.ocid;
      const contract = await contratos.find({
        $and: [{ awardID: id }, { ocid }],
      });
      contract.map((resp) => {
        arrayContract.push(resp._id);
      });
      if (!contract) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      return res.status(200).json({
        contracts: arrayContract,
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  ContratactbyId: async (req, res = response) => {
    try {

      const awardID = req.params.awardid
      //console.log(req.params);
      const contrato = await contratos.findById(awardID);
      //console.log(awards);

      if (!contrato) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contrato,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  ContratactOCID: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const ContractID = [];
      const contr = await contratos.find({ ocid });
      contr.forEach((element) => {
        ContractID.push(element._id);
      });

      if (!contr) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        ContractID,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },


  ContratactOCIDS: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;

      const contr = await contratos.find({ ocid });


      if (!contr) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        contr,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  contractShowAll: async (req, res = response) => {
    try {
      const id = req.params.awardid;
      const ocid = req.params.ocid;
      const contract = await contratos.find({
        $and: [{ awardID: id }, { ocid }],
      });

      if (!contract) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        ok: true,
        contract,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contratosUpdate: async (req, res = response) => {
    try {
      const awardID = req.body.awardID;

      const cont = await contratos.findOne({ awardID: awardID });

      if (!cont) {
        return res.status(404).json({
          ok: false,
          msg: "No existe contrato",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await contratos.findByIdAndUpdate(cont._id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        contratos: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... contrato no existe",
      });
    }
  },

  OneContratUpdate: async (req, res = response) => {
    try {
      //console.log(req.params.id);
      const id = req.params.id;

      const cont = await contratos.findById(id);

      if (!cont) {
        return res.status(404).json({
          ok: false,
          msg: "No existe contrato",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await contratos.findByIdAndUpdate(cont._id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        contratos: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... contrato no existe",
      });
    }
  },
  implementation: async (req, res = response) => {
    try {
      const val = new implementation(req.body);
      let count = await getID(implementation);
      val.transactions.id = count;
      await val.save();

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
  contractImCreate: async (req, res = response) => {
    try {
      const contract = new contractIm(req.body);
      await contract.save();
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
  contractImShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const contract = await contractIm
        .findOne({ id: id })
        .populate("payer", "-__v")
        .populate("payee", "-__v")
        .populate("value", "-__v");
      if (!contract) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contract: {
          id: contract.id,
          awardID: contract.awardID,
          implementation: contract.implementation,
        },
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contractEnCreate: async (req, res = response) => {
    //try {
    const contract = new contractEn(req.body);
    await contract.save();
    return res.status(200).json({
      ok: true,
    });
    //} catch (error) {
    return res.status(404).json({
      ok: false,
      msg: "Error en servidor por favor comunicarse con administración",
    });
    //}
  },
  contractEnShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const contract = await contractEn
        .findOne({ id: id })
        .populate("payer", "-__v")
        .populate("payee", "-__v")
        .populate("value", "-__v");
      if (!contract) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contract: {
          id: contract.id,
          awardID: contract.awardID,
          title: contract.title,
          description: contract.description,
          status: contract.status,
          period: contract.period,
          value: contract.value,
          items: contract.items,
          dateSigned: contract.dateSigned,
          documents: contract.documents,
          amendments: contract.amendments,
        },
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },

  ContractDelete: async (req, res = response) => {
    const id = req.params.id;
    const ItemsArr = [];
    const conts = await contratos.findById({ _id: id });
    //console.log(conts);

    if (conts) {
      await ContractPeriod.deleteOne({ _id: { $in: conts.period } });
      await value.deleteMany({ _id: { $in: conts.value } });
      await Documents.deleteMany({ _id: { $in: conts.documents } });
      await contratos.deleteOne({ _id: { $in: conts } });



    }



    return res.status(200).json({
      ok: true,
      msg: "Borrado con Exito",
    });
  },
};

module.exports = ContractsController;
