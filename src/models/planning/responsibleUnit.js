import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const requestingUnitSchema = Schema(
  {
    id: { type: String, require },
    description: { type: String, require },
    
  },
  {
    collection: "planning.requestingUnits",
    versionKey: false, //here
  }
);
requestingUnitSchema.plugin(require("mongoose-autopopulate"));
requestingUnitSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.requestingUnit", requestingUnitSchema);
