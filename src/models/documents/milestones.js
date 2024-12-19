import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const milestonesSchema = Schema(
  {
    id: { type: String, require },
    milestoneType: { type: String, require },
    document_id: { type: String, require },
    title: { type: String },
    type: { type: String },
    code: { type: String },
    description: { type: String, require },
    dueDate: { type: String, require, default: fecha },
    dateMet: { type: String, require, default: fecha },
    dateModified: { type: String, require, default: fecha },
    status: { type: String },
    ocid: { type: Schema.Types.ObjectId, require, ref: "relase.contract" },
  },
  {
    collection: "milestones",
    versionKey: false, //here
  }
);
milestonesSchema.plugin(require("mongoose-autopopulate"));
milestonesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("milestones", milestonesSchema);
