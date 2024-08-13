import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const issuingSupplierSchema = Schema(
  {
    id: { type: String, require },
    name: { type: String, require },
   
  },
  {
    collection: "quotes.issuingSuppliers",
    versionKey: false, //here
  }

);

issuingSupplierSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("quotes.issuingSupplier", issuingSupplierSchema);