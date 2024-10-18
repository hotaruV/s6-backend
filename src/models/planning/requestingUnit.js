import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const responsibleUnitSchema = Schema(
  {
    id: { type: String, require },
    description: { type: String, require },
    
  },
  {
    collection: "planning.responsibleUnits",
    versionKey: false, //here
  }
);
responsibleUnitSchema.plugin(require("mongoose-autopopulate"));
responsibleUnitSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.responsibleUnit", responsibleUnitSchema);
