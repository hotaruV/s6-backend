import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const transactionsSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    source: { type: String, require },
    paymentMethod: { type: String, require },
    date: { type: Date, require },
   
    value:  { type: Schema.Types.ObjectId, require, ref: "contract.value", autopopulate: true},
    
    payer: 
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "contract.payer",
          autopopulate: true,
        },

    payee: 
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "contract.payeer",
          autopopulate: true,
        },
    
   uri: { type: String, require },  
   
  },
  {
    collection: "contract.transactions",
    versionKey: false, //here
  }
);
transactionsSchema.plugin(require("mongoose-autopopulate"));
transactionsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.transactions", transactionsSchema);