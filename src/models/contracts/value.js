import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const valueContractSchema = Schema(
  {
    id: { type: String, require },
    amount: { type: Number, require },
    currency: { type: String, require },
    ocid: { type: String, require }
  },
  {
    collection: "contract.values",
    versionKey: false, //here
  }
);
valueContractSchema.plugin(require("mongoose-autopopulate"));
valueContractSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.value", valueContractSchema);
