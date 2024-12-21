import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
const QuotesValueSchema = Schema(
  {
    id: { type: String, require },
    amount: { type: Number, require },
    currency: { type: String, require },
    ocid: { type: String, require },
  },
  {
    collection: "quotes.values",
    versionKey: false, //here
  }
);

QuotesValueSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("quotes.value", QuotesValueSchema);
