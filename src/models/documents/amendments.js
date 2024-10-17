import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const amendmentSchema = Schema(
  {
    id: { type: String, require },
    date: { type: String, require, default: fecha },
    documentType: { type: String, require },
    rationale: { type: String },
    description: { type: String },
    amendsReleaseID: { type: String },
    releaseID: { type: String },
    ocid: { type: String },
  },
  {
    collection: "amendments",
    versionKey: false, //here
  }
);
amendmentSchema.plugin(require("mongoose-autopopulate"));
amendmentSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("amendments", amendmentSchema);
