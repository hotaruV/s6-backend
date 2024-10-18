import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const contractingUnitSchema = Schema(
  {
    id: { type: String, require },
    description: { type: String, require },
    
  },
  {
    collection: "planning.contractingUnits",
    versionKey: false, //here
  }
);
contractingUnitSchema.plugin(require('mongoose-autopopulate'));
contractingUnitSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.contractingUnit", contractingUnitSchema);
