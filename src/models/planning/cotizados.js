import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const cotizadosSchema = Schema(
  {
    id: { type: String, require },
    items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
    period: { type: Schema.Types.ObjectId, require, ref: "quotes.period", autopopulate: true },
    issuingSupplier: { type: Schema.Types.ObjectId, require, ref: "planning.issuingsuppliers", autopopulate: true },
  
    
  },
  {
    collection: "planing.cotizados",
    versionKey: false, //here
  }

);
//cotizadosSchema.plugin(require("mongoose-autopopulate"));
cotizadosSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planing.cotizados", cotizadosSchema);
