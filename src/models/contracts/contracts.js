import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const ContractsSchema = Schema({
  id: { type: String, require}, 
  ocid: { type: String, require}, 
  // awardID: { type: String, require},
  title: { type: String, require },
  description: { type: String, require },
  status: { type: String, require },
  
  period: { type: Schema.Types.ObjectId, require, ref: "contract.period", autopopulate: true},
  value: { type: Schema.Types.ObjectId, require, ref: "contract.value", autopopulate: true},

  items: { type: Schema.Types.ObjectId, require, ref: "contract.items", autopopulate: true },
  //items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
  
  dateSigned: { type: Date, require },
  surveillanceMechanisms: { type: String, require },
 items: { type: Schema.Types.ObjectId, require, ref: "contract.items", autopopulate: true },
 guarantees: { type: Schema.Types.ObjectId, require, ref: "contract.guarantees", autopopulate: true },
 documents: [{ type: Schema.Types.ObjectId, require, ref: "documents", autopopulate: true }],
 implementation: [{ type: Schema.Types.ObjectId, require, ref: "contract.implementation", autopopulate: true }],
 relatedProcesses: { type: Schema.Types.ObjectId, require, ref: "contract.relatedProcesses", autopopulate: true },
 milestones: [{ type: Schema.Types.ObjectId, require, ref: "milestones", autopopulate: true }],
 amendments: { type: Schema.Types.ObjectId, require, ref: "contract.amendmentsCont", autopopulate: true },

});
ContractsSchema.plugin(require('mongoose-autopopulate'));
ContractsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract", ContractsSchema);
