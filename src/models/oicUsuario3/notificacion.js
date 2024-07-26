import moment from "moment";
import { model, Schema } from "mongoose";
let fecha = moment().format("YYYY-MM-DD HH:mm:ss");

const StatusValid = {
    values: ['no visto', 'visto', 'atendido', 'concluido'],
    message: '{VALUE} No es un Rol Permitido'
}

const Notifications = new Schema({
    uid: { type: Schema.Types.ObjectId, require, ref: "admin_users" },
    owner_id: { type: Schema.Types.ObjectId, require, ref: "admin_users" },
    ocid: { type: String, require },
    revision_id: { type: Schema.Types.ObjectId, require, ref: "oic_revision", autopopulate: true },
    status: { type: String, require, default: 'no visto', enum: StatusValid },
    notification_text: { type: String, require },
    created_at: { type: String, default: fecha },
    updated_at: { type: String, default: null },
});

Notifications.method("toJSON", function () {
    const { __v, ...object } = this.toObject();
    return object;
});
Notifications.plugin(require("mongoose-autopopulate"));
module.exports = model("oic_notifications", Notifications);