import { response } from "express";
import identifier from "../models/parties/identifier";
import address from "../models/parties/address";
import contactPoint from "../models/parties/contactPoint";
import parties from "../models/parties/parties";
import getID from "../helpers/getId";

const PartiesController = {
  identifierCreate: async (req, res = response) => {
    try {
      let ocid = req.params.ocid;
      //console.log(req.body);
      //return
      const ide = new identifier(req.body);
      ide.id = req.body.identifier;
      ide.legalName = req.body.legalName;
      ide.uri = req.body.uri;
      ide.ocid = ocid;
      ide.scheme = "MX-RFC";
      // let z=0;
      // do {
      //   let scheme = schemaGen();
      //   const ExisteScheme = await identifier.findOne({scheme});
      //   if (!ExisteScheme) {
      //     z=1;
      //   }
      // console.log(scheme);
      // }while(z!=1);

      // function isUrl(s) {
      //   var regexp =
      //     /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      //   return regexp.test(s);
      // }

      // let ur = req.body.uri;
      // let x = isUrl(ur);

      // if (!x) {
      //   return res.status(400).json({
      //     ok: false,
      //     msg: "Necesita ser una URL válida",
      //   });
      // }

      await ide.save();
      return res.status(200).json({
        ok: true,
        _id: ide._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  identifierShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const ocid = req.params.ocid;


      const cp = await identifier.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        identifier: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  identifierUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const id = await identifier.findById(uid);
      if (!id) {
        return res.status(404).json({
          ok: false,
          msg: "No existe identificador",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await identifier.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        identifier: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... identificador no existe",
      });
    }
  },
  address: async (req, res = response) => {
    try {
      const add = new address(req.body);
      const ocid = req.params.ocid;

      add.ocid = ocid;

      await add.save();
      return res.status(200).json({
        ok: true,
        _id: add._id,
        key: add.key,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  addressShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await address.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        address: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  addressUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const add = await address.findById(uid);
      if (!add) {
        return res.status(404).json({
          ok: false,
          msg: "No existe dirección",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await address.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        address: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... dirección no existe",
      });
    }
  },
  contactPoint: async (req, res = response) => {
    // let ocid = req.params.ocid;
    // return
    try {
      const contact = new contactPoint(req.body);
      // function isUrl(s) {
      //   var regexp =
      //     /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      //   return regexp.test(s);
      // }
      // function validarEmail(s) {
      //   var regexp =
      //     /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      //   return regexp.test(s);
      // }

      // let ur = req.body.url;
      // let x = isUrl(ur);

      // if (!x) {
      //   return res.status(400).json({
      //     ok: false,
      //     msg: "Necesita ser una URL válida",
      //   });
      // }

      // let em = req.body.email;
      // let y = validarEmail(em);

      // if (!y) {
      //   return res.status(400).json({
      //     ok: false,
      //     msg: "Necesita ser un E-mail válido",
      //   });
      // }

      //let count = await getID(contactPoint);
      contact.ocid = req.params.ocid;

      await contact.save();
      return res.status(200).json({
        ok: true,
        _id: contact._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  contactPointShow: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      //console.log(ocid);
      const cp = await contactPoint.findOne({ ocid: ocid });
      //console.log(cp);
      if (!cp) {
        return res.status(200).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        contactPoint: cp,
        ok: true,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  contactPointUpdate: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await contactPoint.findById( id );
      // console.log(cp._id);
      // return
      const _id = cp._id;
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No existe dirección",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await contactPoint.findByIdAndUpdate(_id, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        contactPoint: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... punto de contacto no existe",
      });
    }
  },
  partiesCreate: async (req, res = response) => {
    try {
      let ocid = req.params.ocid;
      const partie = new parties(req.body);
      let count = await getID(parties);
      partie.id = `${count}-partie`;
      partie.ocid = ocid;
      await partie.save();
      return res.status(200).json({
        ok: true,
        _id: partie._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  partiesShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const partie = await parties
        .findById(id)
        .populate("identifier", "-__v")
        .populate("address", "-__v")
        .populate("contactPoint", "-__v");
      if (!partie) {
        return res.status(404).json({
          ok: false,
          msg: "No existe esta partie",
        });
      }
      res.status(200).json({
        paties: {
          identifier: partie.identifier,
          name: partie.name,
          address: partie.address,
          contactPoint: partie.contactPoint,
          roles: partie.roles,
          id: partie.id,
        },
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
      });
    }
  },
  partiesUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const plan = await parties.findById(uid);
      if (!plan) {
        return res.status(404).json({
          ok: false,
          msg: "No existe la parte",
        });
      }
      const { ...campos } = req.body;
      //await plan.save();
      const planUpdated = await parties.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        parties: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... parte no existe",
      });
    }
  },
  getDataParties: async (req, res = response) => {
    //console.log(req.params);
    let ocid = req.params.ocid;
    let key = req.params.key;
    try {
      const contact = await contactPoint.findOne({
        $and: [{ ocid }, { key }],
      });
      const addres = await address.findOne({
        $and: [{ ocid }, { key }],
      });
      const ident = await identifier.findOne({
        $and: [{ ocid }, { id: key }],
      });
      return res.status(200).json({
        contact_id: contact._id,
        addres_id: addres._id,
        identifier_id: ident._id,
        ok: true,
      });
    } catch (error) {
      return res.status(200).json({
        msj: "No se encontraron datos",
        ok: false,
      });
    }
  },
  getPartiesAllOcid: async (req, res = response) => {
    const ocid = req.params.ocid;
    const parti_id = [];
    const parti = await parties.find({ ocid }, { _id: 1 }).exec();
    parti.map((resp) => {
      parti_id.push(resp._id);
    });
    //console.log(parti);
    if (parti_id.length != 0) {
      return res.status(200).json({
        parties: parti_id,
        ok: true
      });
    } else {
      return res.status(200).json({
        ok: false
      });
    }
    return res.status(200).json({
      parties: parti_id,
    });
  },
  getPartiesAll: async (req, res = response) => {
    const ocid = req.params.ocid;
    const parti = await parties.find({ ocid }).exec();
    //console.log(parti);
    return res.status(200).json({
      parties: parti,
    });
  },
  deletePartie: async (req, res = response) => {
    const _id = req.params._id;
    const Parti = await parties.findById(_id);
    if (Parti) {
      await address.deleteOne({ _id: { $in: Parti.address._id } });
      await identifier.deleteOne({ _id: { $in: Parti.identifier._id } });
      await contactPoint.deleteOne({ _id: { $in: Parti.contactPoint._id } });
      await parties.deleteOne({ _id: { $in: _id } }).populate();
    }
    return res.status(200).json({
      "": Parti,
    });
  },
};

module.exports = PartiesController;
