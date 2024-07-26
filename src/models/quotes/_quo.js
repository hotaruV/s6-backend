import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
const QuoSchema = Schema(
  {
    id: { type: String, require },
    description: { type: String, require },
    date: { type: String, require },
  },
  {
    collection: "quotes.quo",
    versionKey: false, //here
  }
);

QuoSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("quotes.quo", QuoSchema);
