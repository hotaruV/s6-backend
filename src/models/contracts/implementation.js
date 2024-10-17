import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const implementationContSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    status: { type: String, require },
    transactions:  { type: Schema.Types.ObjectId, require, ref: "contract.transactions", autopopulate: true},
    milestones: [{ type: Schema.Types.ObjectId, require, ref: "milestones", autopopulate: true }],

    documents: [
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "documents",
          autopopulate: true,
        },
      ], 
   
  },
  {
    collection: "contract.implementation",
    versionKey: false, //here
  }
);
implementationContSchema.plugin(require("mongoose-autopopulate"));
implementationContSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.implementation", implementationContSchema);