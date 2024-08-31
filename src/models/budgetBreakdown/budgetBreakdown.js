import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const budgetBreakdownSchema = Schema(
  {
    id: { type: String, require },
    description: { type: String, require },
    ocid: { type: String, require },
    value: { type: Schema.Types.ObjectId, require, ref: "budgetBreakdown.value", autopopulate: true },
    uri: { type: String, require },
    periodo: { type: Schema.Types.ObjectId, require, ref: "budgetBreakdown.periods", autopopulate: true },

   
    
    budgetLines: { type: Schema.Types.ObjectId, require, ref: "planning.budgetLines", autopopulate: true },

    
   
  
    
  },
  {
    collection: "planning.budgetBreakdown",
    versionKey: false, //here
  }
);

budgetBreakdownSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.budgetBreakdown", budgetBreakdownSchema);
