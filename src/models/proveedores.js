import { Schema, Model, model } from 'mongoose';
import moment from 'moment';
let fecha = moment().format('YYYY-MM-DD HH:mm:ss');


const ProveedoresSchema = Schema({
    
  
    tipo: { type: String, require },
    razonsocialProv: { type: String, require},
    rfcproveedor: { type: String, require},
    uri_proveedor: { type: String, require},
    
    nombres_rep_legal: { type: String, require},
    primer_apellido_rep_legal: { type: String, require },
    segundo_apellido_rep_legal: { type: String,  default: null },
    rfc_rep_legal: { type: String, require },
    
    tipo: { type: String,  require},
    lugar_proveedor: { type: String,  require},
    pais_proveedor: { type: String, require},
    codigoPostal_proveedor: { type: String, require },
    colonia_proveedor: { type: String,  require },
    localidad_proveedor: { type: String, require },
    region_proveedor: { type: String, require },
    calle_proveedor: { type: String, require },
    numero_proveedor: { type: String, require },

    nombres_contacto_prov: { type: String, require },
    primer_apellido_contacto_prov: { type: String, require },
    segundo_apellido_contacto_prov: { type: String, require },
    email_contacto_prov: { type: String, require },
    telefono_contacto_prov: { type: String, require },
    telefonofax_contacto_prov: { type: String,  default: null },
    url_ente_contacto_prov: { type: String, require },
    idioma_prov: { type: String, require },
   
    
    id_ente_publico: { type: String },
    id_usuario: { type: String, require },
    estatus: { type: String,  default: 1 },
    created_at: { type: String,  default: fecha },
    updated_at: { type: String,  default: null },
     
});
ProveedoresSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id
    return object
})



export default model('proveedores', ProveedoresSchema)