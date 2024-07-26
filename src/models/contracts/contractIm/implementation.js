import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const implementationSchema = Schema({
    transactions: [
        {
          id: { type: String, require },
          source: { type: String, require },
          date: { type: String, require },
          uri: { type: String, require },
          payer: { type: Schema.Types.ObjectId, require, ref: "buyer", autopopulate: true },
          payee: { type: Schema.Types.ObjectId, require, ref: "award.suppliers", autopopulate: true },
          value: { type: Schema.Types.ObjectId, require, ref: "contract.value", autopopulate: true },
        },
      ],
});
implementationSchema.plugin(require('mongoose-autopopulate'));
implementationSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contractIm.implementation", implementationSchema);
