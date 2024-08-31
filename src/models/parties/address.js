import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const addressSchema = Schema(
  {
    streetAddress: { type: String, require },
    locality: { type: String, require },
    region: { type: String, require },
    postalCode: { type: String, require },
    countryName: { type: String, require },
    ocid: { type: String, require },
    key: { type: String },
  },
  {
    collection: "parties.address",
    versionKey: false, //here
  }
);

addressSchema.method("toJSON", function () {
  const {__v, ...object } = this.toObject();
  return object;
});

module.exports = model("parties.address", addressSchema);
