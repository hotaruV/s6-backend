import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const itemAwSchema = Schema(
  {
    
    id: { type: String, require },
    description: { type: String, require },
    items: [
        { type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true },
      ],
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "award.items",
    versionKey: false, //here
  }
);

itemAwSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("award.items", itemAwSchema);