import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const PlanningSchema = Schema({
  id: { type: String, required: false },
  rationale: { type: String, required: false },
  hasQuotes: { type: Boolean, required: false },
  hasQuotes_why: { type: String, required: false },
  requestingUnits: [
    {
      name: { type: String, required: false },
      id: { type: String, required: false }
    }
  ],
  responsibleUnits: [
    {
      name: { type: String, required: false },
      id: { type: String, required: false }
    }
  ],
  contractingUnits: [
    {
      name: { type: String, required: false },
      id: { type: String, required: false }
    }
  ],

  requestForQuotes: [
    { type: Schema.Types.ObjectId, required: true, ref: "planning.requestForQuote", autopopulate: true }
  ],
  budget: { type: Schema.Types.ObjectId, require, ref: "budgets", autopopulate: true },
  //budget: { type: Schema.Types.ObjectId, require, ref: "budget", autopopulate: false },

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
