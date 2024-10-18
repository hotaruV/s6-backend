import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const SolQuotesSchema = Schema(
  {
    id: { type: String, require },
    title: { type: String, require },
    description: { type: String, require },
    
  },
  {
    collection: "planing.SolQuotes",
    versionKey: false, //here
  }

);
//SolQuotesSchema.plugin(require("mongoose-autopopulate"));
SolQuotesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planing.SolQuotes", SolQuotesSchema);
