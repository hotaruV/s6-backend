import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const unitSchema = Schema(
  {
    id: { type: String, require },
    numreq: { type: String, require },
    scheme: { type: String, require },
    name: { type: String, require },
    valor: { type: String, require },
    values: {
      type: Schema.Types.ObjectId,
      require,
      ref: "item.unit.value",
      autopopulate: true,
    },
    uri: { type: String, require },
    ocid: { type: String, require },
  },
  {
    collection: "item.units",
    versionKey: false, //here
  }
);
unitSchema.plugin(require("mongoose-autopopulate"));
unitSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("item.unit", unitSchema);
