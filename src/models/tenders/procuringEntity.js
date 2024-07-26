import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const procuringEntitySchema = Schema(
  {
    id: { type: String, require },
    name: { type: String, require },
    
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "tender.procuringentities",
    versionKey: false, //here
  }
);

procuringEntitySchema.method("toJSON", function () {
  const { __v,ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.procuringentity", procuringEntitySchema);
