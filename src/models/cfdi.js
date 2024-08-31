import { Schema, model } from 'mongoose';
const cfdiSchema = new Schema({
  key: { type: Number, require},
  description: { type: String },
  level: { type: Number },  
  type_tender: { type: String },  
});

cfdiSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});
module.exports = model("productos_servicios", cfdiSchema);