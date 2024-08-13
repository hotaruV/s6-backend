import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const ContractsEnSchema = Schema({
  ocid: { type: String, require},
  awardID: { type: String, require},
  title: { type: String, require },
  description: { type: String, require },
  status: { type: String, require },
  period: { type: Schema.Types.ObjectId, require, ref: "contract.period", autopopulate: true},
  value: { type: Schema.Types.ObjectId, require, ref: "contract.value", autopopulate: true},
  dateSigned: { type: Date, require },
  items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
  documents: [{ type: Schema.Types.ObjectId, require, ref: "documents", autopopulate: true }],
  amendments: [{ type: Schema.Types.ObjectId, require, ref: "amendments", autopopulate: true }],
});
ContractsEnSchema.plugin(require('mongoose-autopopulate'));
ContractsEnSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contractEn", ContractsEnSchema);
