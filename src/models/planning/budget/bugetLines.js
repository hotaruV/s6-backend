const { Schema, model } = require("mongoose");

const budgetLineSchema = new Schema(
    {
        id: { type: String, required: true },
        origin: { type: String, required: true },
        components: [
            {
                name: { type: String, required: false },
                level: { type: String, required: false },
                code: { type: String, required: false },
                description: { type: String, required: false },
            },
        ],
        sourceParty: {
            name: { type: String, required: true },
            id: { type: String, required: true },
        },
    },
    {
        collection: "budget_lines",
        versionKey: false,
    }
);

budgetLineSchema.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model("BudgetLine", budgetLineSchema);
