import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const valueSchema = Schema(
  {
    id: { type: String, require },
    amount: { type: Number, require },
    currency: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "tender.values",
    versionKey: false, //here
  }
);

valueSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.value", valueSchema);
