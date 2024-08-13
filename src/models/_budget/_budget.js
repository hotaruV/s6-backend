import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const budgetsSchema = Schema(
  {
    id: { type: String, require },
   // urlclave: { type: String, require },
    description: { type: String, require },
       uri: { type: String, require },
     ocid: { type: String, require },
     value: {
       type: Schema.Types.ObjectId,
       require,
       ref: "planning.budget.value",
       autopopulate: true,
     },
 
    
     budgetBreakdown: [{ type: Schema.Types.ObjectId, require, ref: "planning.budgetBreakdown", autopopulate: true }],
 
     project: { type: String, require },
    projectID: { type: String, require },
    projecturi: { type: String, require },  
    
    
   
    
  },
  {
    collection: "planning.budgets_",
    versionKey: false, //here
  }
);

budgetsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.budgets_", budgetsSchema);
