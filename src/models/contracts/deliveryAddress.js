import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const deliveryAddressSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    lugar: { type: String, require },
    colonia: { type: String, require },
    street: { type: String, require },
    numero: { type: String, require },
    streetAddress: { type: String, require },
    locality: { type: String, require },
    region: { type: String, require },
    postalCode: { type: String, require },
    countryName: { type: String, require },
  },
  {
    collection: "contract.deliveryAddress",
    versionKey: false, //here
  }
);

deliveryAddressSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.deliveryAddress", deliveryAddressSchema);