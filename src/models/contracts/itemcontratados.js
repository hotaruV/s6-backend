import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const itemcontratadosSchema = Schema(
  {
    
    id: { type: String, require}, 
    ocid: { type: String, require },
    items: [
        { type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true },
      ],
    // Datos de busqueda
    
     deliveryLocation: 
         { type: Schema.Types.ObjectId, require, ref: "contract.deliveryLocation", autopopulate: true },
      
       deliveryAddress: 
       { type: Schema.Types.ObjectId, require, ref: "contract.deliveryAddress", autopopulate: true },
    
  },
  {
    collection: "contract.items",
    versionKey: false, //here
  }
);
itemcontratadosSchema.plugin(require("mongoose-autopopulate"));
itemcontratadosSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.items", itemcontratadosSchema);