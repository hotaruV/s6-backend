import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const guarantorSchema = Schema(
  {

    //award_id: { type: String, require },
    id: { type: String, require },
    name: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "contract.guarantor",
    versionKey: false, //here
  }
);

guarantorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.guarantor", guarantorSchema);
