import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const ReleaseTag = {
    values: ['planning','planningUpdate','tender','tenderAmendment','tenderUpdate','tenderCancellation',
            'award','awardUpdate','awardCancellation','contract','contractUpdate','contractAmendment',
            'implementation','implementationUpdate','contractTermination','compiled'],
    message: '{VALUE} No es un Rol Permitido'
}

const ContractSchema = new Schema({
    uid: { type: Schema.Types.ObjectId, require, ref: 'admin_users' }, 
    ocid: { type: String, require },
    id: { type: String, require },
    date: { type: Date, require },
    language: { type: String, require },
    tag: [
        {
            type: Object, enum: ReleaseTag,
        }
    ],
    initiationType: { type: String, require },
    parties: [{ type: Schema.Types.ObjectId, require, ref: 'partie' ,autopopulate: true}],
    buyer: { type: Schema.Types.ObjectId, require, ref: 'buyer' ,autopopulate: true},
    planning: { type: Schema.Types.ObjectId, require, ref: 'planning' ,autopopulate: true },
    tender: { type: Schema.Types.ObjectId, require, ref: 'tender' ,autopopulate: true },
    awards: [{ type: Schema.Types.ObjectId, require, ref: 'awards' ,autopopulate: true}],
    contracts: [{ type: Schema.Types.ObjectId, require, ref: 'contract' ,autopopulate: true}],
    active: { type: Boolean }
});
ContractSchema.plugin(require('mongoose-autopopulate'));
ContractSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("relase.contract", ContractSchema);