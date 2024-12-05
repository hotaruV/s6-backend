import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const documentSchema = Schema(
  {
    id: { type: String, require },
    document_id: { type: String, },
    award_id: { type: String, },
    contract_id: { type: String, },
    planning_id: { type: String, },
    documentType: { type: String, require },
    type: { type: String, require },
    title: { type: String, require },
    description: { type: String, require },
    url: { type: String, require },
    datePublished: { type: String, require, default: fecha },
    dateModified: { type: String, require, default: fecha },
    format: { type: String },
    language: { type: String },
    dateModified: { type: String, require, default: fecha },
    ocid: { type: Schema.Types.ObjectId, require, ref: "relase.contract" },
  },
  {
    collection: "documents",
    versionKey: false, //here
  }
);
documentSchema.plugin(require("mongoose-autopopulate"));
documentSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("documents", documentSchema);
