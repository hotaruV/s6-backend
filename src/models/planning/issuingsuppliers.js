import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const SuppliersSchema = Schema(
  {
    id: { type: String, require },
    name: { type: String, require },
    
    
  },
  {
    collection: "planning.issuingsuppliers",
    versionKey: false, //here
  }

);

SuppliersSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.issuingsuppliers", SuppliersSchema);