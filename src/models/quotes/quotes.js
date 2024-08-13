import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const quotesSchema = Schema(
  {
    id: { type: String, require },
    //description: { type: String, require },
    quo: [{ type: Schema.Types.ObjectId, require, ref: "quotes.quo", autopopulate: true }],
    cotizaciones: [{ type: Schema.Types.ObjectId, require, ref: "planing.cotizados", autopopulate: true }],
   },
  {
    collection: "quotes",
    versionKey: false, //here
  }

);

quotesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("quotes", quotesSchema);
