import { Schema, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');

const RolesValidos = {
    values: ['seseaadmin', 'adminstrador_ente', 'oic'],
    message: '{VALUE} No es un Rol Permitido'
};

const UsuarioSchema = new Schema({
    _token: { type: Boolean, default: false },
    userName: { type: String },
    nombres: { type: String, require: true },
    primer_apellido: { type: String, require: true },
    segundo_apellido: { type: String },
    cargo_publico: { type: String },
    curp: { type: String },
    rfc: { type: String, require: true },
    rfc_homoclave: { type: String },
    ente_publico: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String },
    role: { type: String, require: true, default: 'adminstrador_ente', enum: RolesValidos },
    fist_login: { type: Boolean, default: true },
    estatus: { type: String },
    id_ente_publico: { type: Schema.Types.ObjectId, require: true, ref: 'entes', autopopulate: true },
    created_at: { type: String, default: fecha },
    updated_at: { type: String, default: null },
});

UsuarioSchema.plugin(require('mongoose-autopopulate'));

UsuarioSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

export default model('admin_users', UsuarioSchema);
