import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const PlanningSchema = Schema({
  id: { type: String, require },
  rationale: { type: String, require },
  hasQuotes: { type: Boolean, require },
  hasQuotes_why: { type: String },
  requestingUnits: [{ type: Schema.Types.ObjectId, require, ref: "planning.actor", autopopulate: true }],
  responsibleUnits: [{ type: Schema.Types.ObjectId, require, ref: "planning.actor", autopopulate: true }],
  contractingUnits: [{ type: Schema.Types.ObjectId, require, ref: "planning.actor", autopopulate: true }],

  requestForQuotes: [{ type: Schema.Types.ObjectId, require, ref: "planning.requestForQuote", autopopulate: true }],
  budget: { type: Schema.Types.ObjectId, require, ref: "planning.budgets_", autopopulate: true },
  //budget: { type: Schema.Types.ObjectId, require, ref: "budget", autopopulate: true },

  documents: [{ type: Schema.Types.ObjectId, require, ref: "documents", autopopulate: true }],
  milestones: [{ type: Schema.Types.ObjectId, require, ref: "milestones", autopopulate: true }],
  //ocid: { type: Schema.Types.ObjectId, require, ref: "relase.contract" }, 
});
PlanningSchema.plugin(require('mongoose-autopopulate'));
PlanningSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning", PlanningSchema);
