import { Schema, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const requestForQuotesSchema = new Schema(
  {
    id: { type: String, required: true },
    quotes_: [
      { type: Schema.Types.ObjectId, required: true, ref: "planing.SolQuotes", autopopulate: true }
    ],
    period: { type: Schema.Types.ObjectId, required: true, ref: "planning.periods", autopopulate: true },
    items: [
      { type: Schema.Types.ObjectId, required: true, ref: "items", autopopulate: true }
    ],
    invitedSuppliers: [
      { type: Schema.Types.ObjectId, required: true, ref: "planning.supplier" }
    ],
    quotes: [
      { type: Schema.Types.ObjectId, required: true, ref: "quotes", autopopulate: true }
    ],
  },
  {
    collection: "planning.requestForQuotes",
    versionKey: false,
  }
);

// El método toJSON para limpiar los datos al convertir a JSON
//requestForQuotesSchema.plugin(require('mongoose-autopopulate'));
requestForQuotesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

// Crear y exportar el modelo
module.exports = model("planning.requestForQuote", requestForQuotesSchema);
