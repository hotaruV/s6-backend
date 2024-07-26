import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const amendmentsContSchema = Schema(
  {

    //award_id: { type: String, require },
    id: { type: String, require },
    rationale: { type: String, require },
    date: { type: Date, require },
    description: { type: String, require },
    amendsReleaseID: { type: String, require },
    releaseID: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "contract.amendmentsCont",
    versionKey: false, //here
  }
);

amendmentsContSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.amendmentsCont", amendmentsContSchema);