import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const requestForQuotesSchema = Schema(
  {
    id: { type: String, require },
    quotes_: [{ type: Schema.Types.ObjectId, require, ref: "planing.SolQuotes", autopopulate: true }],
    period: { type: Schema.Types.ObjectId, require, ref: "planning.periods", autopopulate: true },
    items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
    invitedSuppliers: [{ type: Schema.Types.ObjectId, require, ref: "planning.supplier"}],
    quotes: [{ type: Schema.Types.ObjectId, require, ref: "quotes", autopopulate: true }],
    
  },
  {
    collection: "planning.requestForQuotes",
    versionKey: false, //here
  }

);
requestForQuotesSchema.plugin(require("mongoose-autopopulate"));
requestForQuotesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.requestForQuote", requestForQuotesSchema);
