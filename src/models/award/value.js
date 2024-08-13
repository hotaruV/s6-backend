import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");
import { DataTypes, Sequelize } from "sequelize";
import { SqlConnect } from "../../config/database";

const valueSchema = Schema(
  {
    id: { type: String, require },
    amount: { type: Number, require },
    currency: { type: String, require },
    // Datos de busqueda
    ocid: { type: String, require }
  },
  {
    collection: "award.values",
    versionKey: false, //here
  }
);

valueSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});




export class AwardValuesModel{

  constructor(){
    this.values();
  }
  values(){
    const AwardModel = SqlConnect.define("values", {
      amount: { type: DataTypes.DECIMAL(10, 2) },
      currency: {type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      date: { type: DataTypes.DATEONLY },
    },{
      timestamps:false
    }
    );
    return AwardModel;
  }
}

 


module.exports = model("award.value", valueSchema);
