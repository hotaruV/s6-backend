import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const servidoresEnteSchema = Schema({
    
    nombres_servidor: { type: String, require },
    primer_apellido_servidor: { type: String, require},
    segundo_apellido_servidor: { type: String, require},
    rfc_servidor: { type: String, require},
    cargo_servidor: { type: String, require},
    email_servidor: { type: String, require },
    telefono_servidor: { type: String, require },
    telefonofax_servidor: { type: String,  default: null },
    area: { type: String, require},
    id_ente_publico: { type: String },
    id_usuario: { type: String, require },
    estatus: { type: String,  default: 1 },
    created_at: { type: String,  default: fecha },
    updated_at: { type: String,  default: null },
});
servidoresEnteSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id
    return object
})



export default model('servidoresEnte', servidoresEnteSchema)