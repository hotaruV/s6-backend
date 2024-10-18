import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const budgetBreakdownperiodoSchema = Schema({
    id: { type: String, require},
    startDate: { type: Date, require},
    endDate: { type: Date, require},
    maxExtentDate: { type: Date, require},
    durationInDays: { type: Number},
  },
  {
    collection: "budgetBreakdown.periods",
    versionKey: false, //here
  });
  budgetBreakdownperiodoSchema.plugin(require('mongoose-autopopulate'));
  budgetBreakdownperiodoSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
  });
  
  module.exports = model("budgetBreakdown.period", budgetBreakdownperiodoSchema);