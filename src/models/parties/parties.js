import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const PartyRoles = {
    values: ['buyer','procuringEntity','supplier','tenderer','funder','enquirer','payer','payee',
            'reviewBody','interestedParty'],
    message: '{VALUE} No es un Rol Permitido'
}

const PartiesSchema = new Schema({
    
    identifier: { type: Schema.Types.ObjectId, require, ref: 'parties.identifier' ,autopopulate: true },
    name: { type: String, require },
    address: { type: Schema.Types.ObjectId, require, ref: 'parties.address' ,autopopulate: true},
    contactPoint: { type: Schema.Types.ObjectId, require, ref: 'parties.contactPoint' ,autopopulate: true},
    roles: [
        {
            type: Object, enum: PartyRoles, autopopulate: true,
        }
    ],
    adward_id: { type: String, require },
    ocid: { type: String, require },
    id: { type: String, require },
});
PartiesSchema.plugin(require('mongoose-autopopulate'));
PartiesSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("partie", PartiesSchema);