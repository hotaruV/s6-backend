import { response } from "express";
import getID from "../helpers/getId";
import milestones from "../models/documents/milestones";
import documents from "../models/documents/documents";
import amendments from "../models/documents/amendments";
import Planning from "../models/planning/planning";

const DocumentsController = {
  milestones: async (req, res = response) => {
    try {
      const arrayDocs = [];
      const document_id = req.body.document_id;
      const type = req.query.type;
      const mil = new milestones(req.body);
      let count = await getID(milestones);

      mil.id = `${count}`;
      await mil.save();
      if (mil) {
        const docs = await milestones.find({
          $and: [{ document_id }, { documentType: type }],
        });

        docs.forEach((doc) => {
          arrayDocs.push(doc._id);
        });

        const plain = await Planning.findOne({ id: document_id }, { _id: 1 });
        if (plain) {
          const pla = await Planning.findByIdAndUpdate(plain._id, {
            milestones: arrayDocs,
          });
        } else {
          return res.status(200).json({
            ok: true,
            _id: mil._id,
          });
        }
      }
      return res.status(200).json({
        ok: true,
        _id: mil._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  milestonesShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await milestones.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        milestones: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  milestonesUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const mil = await milestones.findById(uid);
      if (!mil) {
        return res.status(404).json({
          ok: false,
          msg: "No existe el hito",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await milestones.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        milestones: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... hito no existe",
      });
    }
  },
  milestonesByUser: async (req, res = response) => {
    try {
      //console.log(req.params);
      const doc = req.params.type;
      const document_id = req.params.ocid;
      //console.log(req.params);
      const cp = await milestones
        // .find({ $and: [{ document_id }, { type: doc }] })
        .find({ document_id })
        .exec();
      res.status(200).json({
        //uid: uid,
        milestones: cp,
      });
    } catch (error) { }
  },
  milestonesDelete: async (req, res = response) => {
    try {
      const _id = req.params.id;
      const ocid = req.params.ocid;
      const docType = req.query.doc;
      const arrayDocs = [];
      const cp = await milestones.deleteOne({ _id }).exec();
      if (cp.deletedCount != 0) {
        const docs = await milestones.find({ document_id: ocid }, { _id: 1 });
        //console.log(docs);
        docs.forEach((doc) => {
          arrayDocs.push(doc._id);
        });
        switch (docType) {
          case "tender":
            return res.status(200).json({
              cp,
            });
          case "planning":
            if (cp.deletedCount != 0) {
              const plain = await Planning.findOne({ id: ocid }, { _id: 1 });
              if (plain) {
                const pla = await Planning.findByIdAndUpdate(
                  plain._id,
                  {
                    milestones: arrayDocs,
                  },
                  (err, documents) => {
                    if (err) {
                      console.log(err);
                    } else {
                      return res.status(200).json({
                        documents,
                      });
                    }
                  }
                );
              }
              return res.status(200).json({
                cp,
              });
            }
          default:
            break;
        }
      }
      return res.status(200).json({
        documents: cp,
      });
    } catch (error) {
      console.log(error);
    }
  },
  documents: async (req, res = response) => {
    try {
      const arrayDocs = [];
      const document_id = req.body.document_id;
      const type = req.query.type;
      const doc = new documents(req.body);
      let count = await getID(documents);
      doc.id = `${count}-documents`;
      await doc.save();
      if (doc) {
        const docs = await documents.find({
          $and: [{ document_id }, { documentType: type }],
        });

        docs.forEach((doc) => {
          arrayDocs.push(doc._id);
        });

        const plain = await Planning.findOne({ id: document_id }, { _id: 1 });
        if (plain) {
          const pla = await Planning.findByIdAndUpdate(plain._id, {
            documents: arrayDocs,
          });
        } else {
          return res.status(200).json({
            ok: true,
            _id: doc._id,
          });
        }
      }
      return res.status(200).json({
        ok: true,
        _id: doc._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  documentsShow: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await documents.findById({ _id: id });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        documents: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  documentsByUser2: async (req, res = response) => {
    try {
      const doc = req.params.type;
      const document_id = req.params.ocid;
      const award_id = req.query.award_id;
      //console.log(req.query);
      let cp;

      //switch (doc) {
      // case "award":
      cp = await documents
        .find({ document_id })
        //$or: [{ award_id }])
        .exec();
      res.status(200).json({
        documents: cp,
      });
      //break;
      //case "contract":
      //cp = await documents
      //     .find({
      //       $and: [{ document_id }, { documentType: doc }],
      //       $or: [{ contract_id : award_id }],
      //     })
      //     .exec();
      //   res.status(200).json({
      //     documents: cp,
      //   });
      //   break;
      // default:
      //   cp = await documents
      //     .find({
      //       $and: [{ document_id }, { documentType: doc }],
      //     })
      //     .exec();
      //   res.status(200).json({
      //     documents: cp,
      //   });
      //   break;
      //}
    } catch (error) { }
  },

  documentsByUser: async (req, res = response) => {
    try {

      let documentID = [];
      const doc = req.params.type;
      
      // res.status(200).json({
      //   documents: req.params,
      // });
      // return
      const document_id = req.params.ocid;
      const award_id = req.query.award_id;
      
      let cp;

      switch (doc) {
        case "award":
          cp = await documents.find(
            {
              $and: [
                { document_id }, { documentType: doc },

              ],
              $or: [{ award_id: award_id }]

            }
          ).exec();

          cp.forEach((documents) => {
            documentID.push(documents._id);
            //console.log(documentID);
          });
          res.status(200).json({
            documents_id: documentID,
          });
          break;
        case "contract":
          cp = await documents
            .find({
              $and: [{ document_id }, { documentType: doc }],
              //$or: [{ contract_id: award_id }],
            })
            .exec();
          res.status(200).json({
            documents: cp,
          });
          break;
        default:
          cp = await documents
            .find({
              $and: [{ document_id }, { documentType: doc }],
            })
            .exec();
          res.status(200).json({
            documents: cp,
          });
          break;
      }
    } catch (error) { }
  },

  documentsUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const doc = await documents.findById(uid);
      if (!doc) {
        return res.status(404).json({
          ok: false,
          msg: "No existe documento",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await documents.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        documents: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... documento no existe",
      });
    }
  },
  documentsDelete: async (req, res = response) => {
    try {
      const _id = req.params.id;
      const ocid = req.params.ocid;
      const docType = req.query.doc;
      const arrayDocs = [];
      const cp = await documents.deleteOne({ _id });
      if (cp.deletedCount != 0) {
        const docs = await documents.find({ document_id: ocid }, { _id: 1 });
        // console.log(docs);
        // return
        docs.forEach((doc) => {
          arrayDocs.push(doc._id);
        });
        switch (docType) {
          case "tender":
            return res.status(200).json({
              cp,
            });
          case "planning":
            if (cp.deletedCount != 0) {
              const plain = await Planning.findOne({ id: ocid }, { _id: 1 });
              if (plain) {
                const pla = await Planning.findByIdAndUpdate(
                  plain._id,
                  {
                    documents: arrayDocs,
                  },
                  (err, documents) => {
                    if (err) {
                      console.log(err);
                    } else {
                      return res.status(200).json({
                        documents,
                      });
                    }
                  }
                );
              }
              return res.status(200).json({
                cp,
              });
            }
          default:
            break;
        }
      }
      return res.status(200).json({
        documents: cp,
      });
    } catch (error) {
      console.log(error);
    }
  },
  amendments: async (req, res = response) => {
    try {
      const am = new amendments(req.body);
      let count = await getID(amendments);
      am.id = count;
      am.amendsReleaseID = count;
      am.releaseID = count;
      await am.save();
      return res.status(200).json({
        ok: true,
        _id: am._id,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  amendmentsShow: async (req, res = response) => {
    try {
      let dataArray = [];
      const ocid = req.params.ocid;
      const documentType = req.query.documentType;
      const cp = await amendments.find({
        $and: [{ ocid }, { documentType }],
      });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      cp.forEach((resp) => {
        dataArray.push(resp._id);
      });
      //console.log(dataArray);
      res.status(200).json({
        amendments_id: dataArray,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  amendmentsShowID: async (req, res = response) => {
    try {
      const id = req.params.id;
      const cp = await amendments.findById(id)

      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }

      res.status(200).json({
        amendments: cp,
      });


    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  amendmentsByOcid: async (req, res = response) => {
    try {
      const ocid = req.params.ocid;
      const documentType = req.query.documentType;
      const cp = await amendments.find({
        $and: [{ ocid }, { documentType }],
      });
      if (!cp) {
        return res.status(404).json({
          ok: false,
          msg: "No hay registro hecho",
        });
      }
      res.status(200).json({
        amendments: cp,
      });
    } catch (error) {
      return res.status(404).json({
        ok: false,
        msg: "Error en servidor por favor comunicarse con administración",
      });
    }
  },
  amendmentsUpdate: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const ama = await amendments.findById(uid);
      if (!ama) {
        return res.status(404).json({
          ok: false,
          msg: "No existe modificación",
        });
      }
      const { ...campos } = req.body;
      const planUpdated = await amendments.findByIdAndUpdate(uid, campos, {
        new: true,
      });

      res.status(200).json({
        ok: true,
        amendments: planUpdated,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... modificación no existe",
      });
    }
  },
  amendmentsDelete: async (req, res = response) => {
    const _id = req.params.id;
    const ocid = req.params.ocid;
    const docType = req.query.doc;
    const arrayDocs = [];
    try {
      const cp = await amendments.deleteOne({ _id });
      if (cp.deletedCount != 0) {
        const docs = await amendments.find({ ocid }, { _id: 1 });
        docs.forEach((doc) => {
          arrayDocs.push(doc._id);
        });
        return res.status(200).json({
          cp,
        });
      }
    } catch (error) { }
  },
};

export default DocumentsController;
