import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const awardPeriodSchema = Schema(
  {
    id: { type: String, require },
    startDate: { type: Date, require },
    endDate: { type: Date, require },
    maxExtentDate: { type: Date, default: "0" },
    durationInDays: { type: Number, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "tender.awardperiods",
    versionKey: false, //here
  }
);

awardPeriodSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.awardperiod", awardPeriodSchema);
