import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');



const ContractUserSchema = new Schema({
    uid: { type: String, require },
    ocid: { type: String, require },
});
ContractUserSchema.plugin(require('mongoose-autopopulate'));
ContractUserSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model("relase.contracts.users", ContractUserSchema);