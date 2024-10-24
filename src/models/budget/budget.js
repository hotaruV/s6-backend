import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const butgetGenSchema = Schema(
  {
     id: { type: String, require },
     description: { type: String, require },
    // uri: { type: String, require },
    // ocid: { type: String, require },
    //  value: {
    //    type: Schema.Types.ObjectId,
    //    require,
    //    ref: "planning.budget.value",
    //    autopopulate: true,
    //  },
 
    
     //budgetBreakdown: [{ type: Schema.Types.ObjectId, require, ref: "planning.budgetBreakdown", autopopulate: true }],
 
   //  project: { type: String, require },
   // projectID: { type: String, require },
   // projecturi: { type: String, require },  
  },
  {
    collection: "budget",
    versionKey: false, //here
  }

);

butgetGenSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("budget", butgetGenSchema);