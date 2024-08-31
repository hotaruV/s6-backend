import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const ContractPeriodSchema = Schema({
    id: { type: String, require},
    startDate: { type: Date, require},
    endDate: { type: Date, require},
    maxExtentDate: { type: Date, require},
    durationInDays: { type: Number},
    ocid: { type: String, require }
  },
  {
    collection: "contract.periods",
    versionKey: false, //here
  });
  
  ContractPeriodSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
  });
  
  module.exports = model("contract.period", ContractPeriodSchema);