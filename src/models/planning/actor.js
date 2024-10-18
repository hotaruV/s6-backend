import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const actorSchema = Schema(
  {
    id: { type: String, require },
    name: { type: String, require },
    identificador: { type: String,  },
    type: { type: String,  },// si es planeacion 'planning' y si es 'tender'

  },
  {
    collection: "planning.actor",
    versionKey: false, //here
  }
);
actorSchema.plugin(require("mongoose-autopopulate"));
actorSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("planning.actor", actorSchema);
