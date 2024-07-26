import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const contactPointSchema = Schema(
  {
    name: { type: String, require },
    email: { type: String, require },
    telephone: { type: String, require },
    faxNumber: { type: String, require },
    url: { type: String, require },
    ocid: { type: String },
    key: { type: String },
  },
  {
    collection: "parties.contactPoint",
    versionKey: false, //here
  }
);

contactPointSchema.method("toJSON", function () {
  const {__v, ...object } = this.toObject();
  return object;
});

module.exports = model("parties.contactPoint", contactPointSchema);
