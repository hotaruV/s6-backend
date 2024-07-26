import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const componentSchema = Schema(
  {
    code: { type: String, require },
    name: { type: String, require },
    level: { type: String, require },
    description: { type: String, require },
 
  },
  {
    collection: "budgetLine.components",
    versionKey: false, //here
  }
);

componentSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("budgetLine.component", componentSchema);
