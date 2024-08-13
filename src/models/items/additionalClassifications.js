import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const additionalClassificationsSchema = Schema({
  id: { type: String, require },
  scheme: { type: String, require },
  //endDate: { type: String, require },
  description: { type: String, default: "0" },
  uri: { type: String, require },
  ocid: { type: String, require }, 
});

additionalClassificationsSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model(
  "item.additionalClassifications",
  additionalClassificationsSchema
);
