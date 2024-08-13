import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const budgetLineSchema = Schema(
  {
    id: { type: String, require },
    origin: { type: String, require },

    ocid: { type: String, require },
    components: [{ type: Schema.Types.ObjectId, require, ref: "budgetLine.component", autopopulate: true }],
    sourceParty: { type: Schema.Types.ObjectId, require, ref: "budgetLine.sourceParty", autopopulate: true },
    
  },
  {
    collection: "planning.budgetLine",
    versionKey: false, //here
  }
);

budgetLineSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.budgetLine", budgetLineSchema);
