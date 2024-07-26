import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const EntesSchema = Schema({
    
    ente: { type: String, require },
    siglas: { type: String, require},
    estado: { type: String, require},
    municipio: { type: String, require },
    id_usuario: { type: String, require },
    created_at: { type: String,  default: fecha },
    updated_at: { type: String,  default: null },
    estatus: { type: String,  default: 1 },
    
    rfc: { type: String,  default: null },
    nombre_comercial: { type: String,  default: null },
    nombre_legal: { type: String,  default: null },
    pais: { type: String,  default: null },
    codigoPostal: { type: String,  default: null },
    colonia: { type: String,  default: null },
    localidad: { type: String,  default: null },
    region: { type: String,  default: null },
    calle: { type: String,  default: null },
    numero: { type: String,  default: null },
  
    lugar: { type: String,  default: null },
    nombres_contacto: { type: String,  default: null },
    primer_apellido_contacto: { type: String,  default: null },
    segundo_apellido_contacto: { type: String,  default: null },
    email_contacto: { type: String,  default: null },
    telefono_contacto: { type: String,  default: null },
    telefonofax_contacto: { type: String,  default: null },
    url_ente_contacto: { type: String,  default: null },
    idioma: { type: String,  default: null },
});
EntesSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id
    return object
})



export default model('entes', EntesSchema)