import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const QuotesPeriodSchema = Schema({
    id: { type: String, require},
    startDate: { type: Date, require},
    endDate: { type: Date, require},
    maxExtentDate: { type: Date, require},
    durationInDays: { type: Number},
  },
  {
    collection: "quotes.periods",
    versionKey: false, //here
  });
  
  ContractPeriodSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
  });
  
  module.exports = model("quotes.period", ContractPeriodSchema);