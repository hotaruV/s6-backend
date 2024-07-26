import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const Buyer = new Schema({
  id: { type: String, require, autopopulate: true },
  ocid: { type: String },
  name: { type: String, require, autopopulate: true },
  user_id: { type: Schema.Types.ObjectId, require, ref: "admin_users" },
  //ocid: { type: Schema.Types.ObjectId, require, ref: "relase.contract" },
});

Buyer.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});
Buyer.plugin(require("mongoose-autopopulate"));
module.exports = model("buyer", Buyer);
