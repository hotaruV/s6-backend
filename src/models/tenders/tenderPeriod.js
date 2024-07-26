import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const TenderPeriodSchema = Schema(
  {
    id: { type: String, require },
    startDate: { type: Date, require },
    endDate: { type: Date, require },
    maxExtentDate: { type: Date, require, default: "0" },
    durationInDays: { type: Number },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "tender.periods",
    versionKey: false, //here
  }
);

TenderPeriodSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.Period", TenderPeriodSchema);
