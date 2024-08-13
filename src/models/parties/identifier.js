import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const identifierSchema = Schema(
  {
    scheme: { type: String, require },
    id: { type: String, require },
    legalName: { type: String, require },
    uri: { type: String, require },
    ocid: { type: String, require },
  },
  {
    collection: "parties.identifier",
    versionKey: false, //here
  }
);

identifierSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("parties.identifier", identifierSchema);
