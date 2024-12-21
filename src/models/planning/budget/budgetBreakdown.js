import { Schema, model } from "mongoose";
import moment from "moment";

let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const budgetBreakdownSchema = new Schema(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    value: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true },
    },
    uri: { type: String, required: true },
    period: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      maxExtentDate: { type: Date, required: true },
      durationInDays: { type: Number, required: true },
    },
    budgetLines: [
      {
        type: Schema.Types.ObjectId,
        ref: "BudgetLine", // Relación con BudgetLine
        required: true,
        autopopulate: true,
      },
    ],
  },
  {
    collection: "budget_breakdowns",
    versionKey: false,
  }
);
budgetBreakdownSchema.plugin(require('mongoose-autopopulate'));
budgetBreakdownSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("BudgetBreakdown", budgetBreakdownSchema);