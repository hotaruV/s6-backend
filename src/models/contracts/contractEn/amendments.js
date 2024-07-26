import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const amendmentContractSchema = Schema(
  {
    date: { type: String, require, default: fecha },
    rationale: { type: String },
    description: { type: String },
    amendsReleaseID: { type: String },
    releaseID: { type: String },
    ocid: { type: String },
  },
  {
    collection: "contract.amendment",
    versionKey: false, //here
  }
);
amendmentContractSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.amendment", amendmentContractSchema);
