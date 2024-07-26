import moment from "moment";
import { model, Schema } from "mongoose";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const StatusValid = {
    values: ['REVISADO', 'NO REVISADO'],
    message: '{VALUE} No es un Rol Permitido'
}

const Revision = new Schema({
    uid: { type: Schema.Types.ObjectId, require, ref: "admin_users" },
    ocid: { type: String, require },
    contrato_id: { type: Schema.Types.ObjectId, require, ref: "relase.contract", autopopulate: true},
    status: { type: String, require, default: 'NO REVISADO', enum: StatusValid },
    created_at: { type: String, default: fecha },
    updated_at: { type: String, default: null },
});

Revision.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
});
Revision.plugin(require("mongoose-autopopulate"));
module.exports = model("oic_revision", Revision);