import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
const budgetvalueSchema = Schema(
  {
    id: { type: String, require },
    amount: { type: Number, require },
    currency: { type: String, require },
    ocid: { type: String, require },
  },
  {
    collection: "planning.budget.value",
    versionKey: false, //here
  }
);
//budgetvalueSchema.plugin(require('mongoose-autopopulate'));
budgetvalueSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

 


module.exports = model("planning.budget.value", budgetvalueSchema);