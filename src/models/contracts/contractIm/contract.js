import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const ContractImSchema = Schema({
  id: { type: String, require},
  awardID: { type: String, require},
  implementation: { type: Schema.Types.ObjectId, require, ref: "contractIm.implementation", autopopulate: true},
});
ContractImSchema.plugin(require('mongoose-autopopulate'));
ContractImSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contractIm", ContractImSchema);
