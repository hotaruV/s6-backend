import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const ItemsSchema = Schema(
  {
    id: { type: String, require },
    //award_id: { type: String, require },
    //contract_id: { type: String, require },
    typeItem: { type: String, require },
    title: { type: String, require },
    description: { type: String, require },
    classification: {
      type: Schema.Types.ObjectId,
      require,
      ref: "item.classification",
      autopopulate: true,
    },
    additionalClassifications: [
      {
        type: Schema.Types.ObjectId,
        require,
        ref: "item.additionalClassifications",
        autopopulate: true,
      },
    ],
    quantity: { type: Number, require },
    unit: {
      type: Schema.Types.ObjectId,
      require,
      ref: "item.unit",
      autopopulate: true,
    },

  },
  {
    collection: "items",
    versionKey: false, //here
  }
);
ItemsSchema.plugin(require("mongoose-autopopulate"));
ItemsSchema.method("toJSON", function () {
  const { __v, ocid, ...object } = this.toObject();
  return object;
});

module.exports = model("items", ItemsSchema);
