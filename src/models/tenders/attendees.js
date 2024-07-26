import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const attendeesSchema = Schema(
  {

    //award_id: { type: String, require },
    id: { type: String, require },
    name: { type: String, require },
    identificador: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "tender.attendees",
    versionKey: false, //here
  }
);

attendeesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("tender.attendees", attendeesSchema);