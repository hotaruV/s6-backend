import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const documentContractSchema = Schema(
  {
    document_id: { type: String, require },
    award_id: { type: String, require },
    documentType: { type: String, require },
    title: { type: String, require },
    description: { type: String, require },
    url: { type: String, require },
    datePublished: { type: String, require, default: fecha },
    format: { type: String },
    language: { type: String }
  },
  {
    collection: "contract.document",
    versionKey: false, //here
  }
);
documentContractSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.document", documentContractSchema);
