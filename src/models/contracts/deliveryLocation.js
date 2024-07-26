import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const deliveryLocationSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    type: { type: String, require },
    coordinates: { type: String, require },
    scheme: { type: String, require },
    identifiers: { type: String, require },
    description: { type: String, require },
    uri: { type: String, require },
  },
  {
    collection: "contract.deliveryLocation",
    versionKey: false, //here
  }
);

deliveryLocationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.deliveryLocation", deliveryLocationSchema);