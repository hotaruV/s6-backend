import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const contractPeriodSchema = Schema(
  {
    startDate: { type: Date, require },
    endDate: { type: Date, require },
    maxExtentDate: { type: Date, require },
    durationInDays: { type: Number},
    id: { type: Number, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "award.contractperiods",
    versionKey: false, //here
  }
);

contractPeriodSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("award.contractPeriod", contractPeriodSchema);
