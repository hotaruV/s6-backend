import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
import { DataTypes, Sequelize } from "sequelize";
import { SqlConnect } from "../../config/database";

const awardSchema = Schema({
  id: { type: String, require },
  title: { type: String, require },
  description: { type: String, require },
  rationale: { type: String, require },
  ocid: { type: String, require },
 
  status: { type: String, require },
  date: { type: Date, require },
  value: {
    type: Schema.Types.ObjectId,
    require,
    ref: "award.value",
    autopopulate: true,
  },
  suppliers: [
    {
      type: Schema.Types.ObjectId,
      require,
      ref: "award.suppliers",
      autopopulate: true,
    },
  ],
  // items: [
  //   { type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true },
  // ],
  items: [
    { type: Schema.Types.ObjectId, require, ref: "award.items", autopopulate: true },
  ],
  contractPeriod: {
    type: Schema.Types.ObjectId,
    require,
    ref: "award.contractPeriod",
    autopopulate: true,
  },
  documents: [
    {
      type: Schema.Types.ObjectId,
      require,
      ref: "documents",
      autopopulate: true,
    },
  ],
  amendmentsdate: { type: String, require },
  amendmentsrationale: { type: String, require },
  amendmentsid: { type: String, require },
  amendmentsdescription: { type: String, require },
  amendsReleaseID: { type: String, require },
  ratreleaseIDionale: { type: String, require },
});
awardSchema.plugin(require("mongoose-autopopulate"));
awardSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

export class awardModel {
  constructor() {}

  AwardsModel() {
    const AwardModel = SqlConnect.define(
      "awards",
      {
        title: { type: DataTypes.STRING },
        description: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING },
        date: { type: DataTypes.DATEONLY },
      },
      {
        timestamps: false,
      }
    );
  }
}

module.exports = model("awards", awardSchema);
