import { Schema, Model, model } from "mongoose";
import moment from "moment";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const guaranteesSchema = Schema(
  {
    id: { type: String, require}, 
    ocid: { type: String, require},
    
    type: { type: String, require },
    Date: { type: Date, require },
    obligations: { type: String, require },
    value:  { type: Schema.Types.ObjectId, require, ref: "contract.value", autopopulate: true},
    guarantor: 
        {
          type: Schema.Types.ObjectId,
          require,
          ref: "contract.guarantor",
          autopopulate: true,
        },
      
    period: {
        type: Schema.Types.ObjectId,
        require,
        ref: "contract.period",
        autopopulate: true,
      },
  },
  {
    collection: "contract.guarantees",
    versionKey: false, //here
  }
);

guaranteesSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("contract.guarantees", guaranteesSchema);