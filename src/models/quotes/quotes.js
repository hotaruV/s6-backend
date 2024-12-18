import { Schema, model } from "mongoose";
import moment from "moment";

// Fecha actual
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
const quotesSchema = new Schema(
  {
    id: { type: String, required: false }, // El id del quote
    description: { type: String },
    date: { type: Date, required: false },
    items: [{ type: Schema.Types.ObjectId, required: false, ref: "items", autopopulate: true }],
    value: { type: Schema.Types.ObjectId, required: false, ref: "quotes.value" },
    period: { type: Schema.Types.ObjectId, required: false, ref: "planning.periods" },
    issuingSupplier: {
      type: {
        id: { type: String, required: false },   // El ID del proveedor
        name: { type: String, required: false }   // El nombre del proveedor
      },
      required: false  // Es necesario que existan ambos campos: id y name
    }
  },
  {
    collection: "quotes", // Nombre de la colección en la base de datos
    versionKey: false, // No generamos el __v
  }
);

// Método para excluir el campo __v al devolver los datos
quotesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

// Exportamos el modelo 'Quote'
module.exports = model("quote", quotesSchema);
