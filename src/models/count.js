import { Schema, model } from 'mongoose';

const CountSchema = new Schema({
    contract_count: { type: Number, require }
});

CountSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("count", CountSchema);