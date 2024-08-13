import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const relatedProcessesSchema = Schema(
  {

    //award_id: { type: String, require },
    id: { type: String, require },
    relationship: { type: String, require },
    title: { type: String, require },
    uri: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "contract.relatedProcesses",
    versionKey: false, //here
  }
);

relatedProcessesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.relatedProcesses", relatedProcessesSchema);