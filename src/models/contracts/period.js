import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const periodGuaranteesSchema = Schema({
    id: { type: String, require},
    startDate: { type: Date, require},
    endDate: { type: Date, require},
    maxExtentDate: { type: Date, require},
    durationInDays: { type: Number},
  },
  {
    collection: "contractGuarantees.period",
    versionKey: false, //here
  });
  periodGuaranteesSchema.plugin(require("mongoose-autopopulate"));
  periodGuaranteesSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
  });
  
  module.exports = model("contractGuarantees.period", periodGuaranteesSchema);