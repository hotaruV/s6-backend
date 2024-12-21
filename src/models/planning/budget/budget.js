import { Schema, model } from "mongoose";
import moment from "moment";

let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const budgetsSchema = new Schema(
  {
    id: { type: String, required: false },
    description: { type: String, required: true },
    uri: { type: String, required: true },
    value: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    budgetBreakdown: [
      {
        type: Schema.Types.ObjectId,
        ref: "BudgetBreakdown",
        autopopulate: true, // Autopopulación si se utiliza el plugin mongoose-autopopulate
      },
    ],
    project: { type: String, required: false },
    projectID: { type: String, required: false },
  },
  {
    collection: "budgets",
    versionKey: false, // Remove __v
  }
);

// Método toJSON para formatear la salida
budgetsSchema.plugin(require('mongoose-autopopulate'));
budgetsSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("budgets", budgetsSchema);
