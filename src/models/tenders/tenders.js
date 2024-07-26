import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const TendersSchema = Schema({
  id: { type: String, require},
  ocid: { type: String, require },
  title: { type: String, require },
  description: { type: String, require },
  status: { type: String, require },
   
   tenderprocurementMethod: { type: String, require },
   tenderprocurementMethodDetails: { type: String, require },
   tenderprocurementMethodRationale: { type: String, require },
   tendercategoria: { type: String, require },
   tenderawardCriteria: { type: String, require },
   tenderawardCriteriaDetails: { type: String, require },
   tendersubmissionMethod: { type: String, require },
   tendersubmissionMethodDetails: { type: String, require },

  procuringEntity: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.procuringentity",
    autopopulate: true
  },
  items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
  value: { type: Schema.Types.ObjectId, require, ref: "tender.value", autopopulate: true},
  minValue: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.minValue",
    autopopulate: true
  },
  procurementMethod: { type: String, require },
  procurementMethodDetails: { type: String, require },
  procurementMethodRationale: { type: String, require },
  additionalProcurementCategories: { type: String, require },
  awardCriteria: { type: String, require },
  awardCriteriaDetails: { type: String, require },
  submissionMethod: [{ type: String, require }],
  submissionMethodDetails: { type: String, require },
  tenderPeriod: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.Period",
    autopopulate: true
  },
  enquiryPeriod: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.enquiryPeriod",
    autopopulate: true
  },
  hasEnquiries: { type: Boolean, require, default: false },
 clarificationMeetings: [{ type: Schema.Types.ObjectId, require, ref: "tender.clarificationMeetings", autopopulate: true }],
 
 eligibilityCriteria: { type: String, require },

  awardPeriod: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.Period",
    autopopulate: true
  },
  contractPeriod: {
    type: Schema.Types.ObjectId,
    require,
    ref: "tender.Period",
    autopopulate: true
  },
   numberOfTenderers: { type: Number, require }, 
  tenderers: [{ type: Schema.Types.ObjectId, require, ref: "planning.actor", autopopulate: true }],
  documents: [{ type: Schema.Types.ObjectId, require, ref: "documents", autopopulate: true }],
  milestones: [{ type: Schema.Types.ObjectId, require, ref: "milestones", autopopulate: true }], 
  amendments: [{ type: Schema.Types.ObjectId, require, ref: "amendments", autopopulate: true }],
 
});
TendersSchema.plugin(require('mongoose-autopopulate'));
TendersSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("tender", TendersSchema);
