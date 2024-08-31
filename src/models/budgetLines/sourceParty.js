import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const sourcePartySchema = Schema(
  {
    id: { type: String, require },
    name: { type: String, require },
   
  },
  {
    collection: "budgetLine.sourcePartys",
    versionKey: false, //here
  }
);

sourcePartySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("budgetLine.sourceParty", sourcePartySchema);
