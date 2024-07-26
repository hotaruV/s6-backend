import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const ReleaseTag = {
    values: ['planning','planningUpdate','tender','tenderAmendment','tenderUpdate','tenderCancellation',
            'award','awardUpdate','awardCancellation','contract','contractUpdate','contractAmendment',
            'implementation','implementationUpdate','contractTermination','compiled'],
    message: '{VALUE} No es un Rol Permitido'
}

const LicitacionSchema = new Schema({
    ocid: { type: String, require },
    id: { type: String, require },
    title: { type: String, require },
    description: { type: String, require },
    status: { type: String, require },

    procuringEntity: [{ type: Schema.Types.ObjectId,require , ref: "planning.actor", autopopulate: true }],
    //agregar los cmpos dee II. ITEMS LICITADOS no existen en el excel
    id_licitado: { type: String, require },
    descripcion_licitado: { type: String, require },
    //aqui termina
    items: [{ type: Schema.Types.ObjectId, require, ref: "items", autopopulate: true }],
    value: { type: Schema.Types.ObjectId, require, ref: "tender.value", autopopulate: true},
    date: { type: String, require },
    language: { type: String, require },
    tag: [
        {
            type: Object, enum: ReleaseTag,
        }
    ],
    initiationType: { type: String, require },
    parties: [{ type: Schema.Types.ObjectId, require, ref: 'partie' }],
    buyer: { type: Schema.Types.ObjectId, require, ref: 'buyer' },
    tender: { type: Schema.Types.ObjectId, require, ref: 'tender' },
    documents: [{ type: Schema.Types.ObjectId, require, ref: "documents", autopopulate: true }],
    milestones: [{ type: Schema.Types.ObjectId, require, ref: "milestones", autopopulate: true }],

});

LicitacionSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  return object;
});

module.exports = model("relase.licitacion", LicitacionSchema);