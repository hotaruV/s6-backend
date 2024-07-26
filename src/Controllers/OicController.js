import { response } from 'express';
import moment from 'moment';
import Contrato from "../models/contrato";
import Notification from '../models/oicUsuario3/notificacion';
import Revitions from '../models/oicUsuario3/revision';
import Usuario from "../models/usuario";

const OICController = {

    GetUserRolID: async (req, res = response) => {
        try {
            const active = false;
            const uid = req.uid;
    
            // Verificar si el usuario existe
            const user = await Usuario.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }
    
            const ente_id = user.id_ente_publico;
            let owner;
            
            
            switch (user.role) {
                case 'oic':
                    owner = await Usuario.findOne({
                        id_ente_publico: ente_id,
                        role: "adminstrador_ente",
                    });
                    break;
                case 'adminstrador_ente':
                    owner = await Usuario.findOne({
                        id_ente_publico: ente_id,
                        role: "adminstrador_ente",
                        _id: uid
                    });
                    break;
            }
    
            if (!owner) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Administrador del ente no encontrado'
                });
            }
    
            const owner_id = owner._id;
            console.log(owner_id);
            const ente_publico = owner.ente_publico;
    
            // Obtener notificaciones existentes y contratos activos
            const [notificacionesExistentes, contratosActivos] = await Promise.all([
                Revitions.find({ uid: owner_id }),
                Contrato.find({ uid: owner_id, active })
                    .select('_id ocid buyer tender planning parties awards contracts uid date active')
            ]);
    
            // Crear un conjunto de OCIDs de contratos que ya tienen notificaciones
            const notificacionesExistentesOcids = new Set(notificacionesExistentes.map(notificacion => notificacion.ocid));
    
            // Filtrar contratos activos que no tienen notificaciones basadas en OCID
            const nuevosContratosParaNotificacion = contratosActivos.filter(contrato => !notificacionesExistentesOcids.has(contrato.ocid));
    
            // Crear nuevas notificaciones para los contratos filtrados
            const fecha = moment().format("YYYY-MM-DD HH:mm:ss");
            const nuevasNotificaciones = nuevosContratosParaNotificacion.map(contrato => ({
                uid: owner_id,
                contrato_id: contrato._id,
                status: 'NO REVISADO',
                ocid: contrato.ocid,
                created_at: fecha,
                updated_at: null
            }));
    
            // Insertar nuevas notificaciones si existen
            if (nuevasNotificaciones.length > 0) {
                await Revitions.insertMany(nuevasNotificaciones);
            }
    
            const total = await Contrato.countDocuments({ active });
    
            return res.status(200).json({
                ok: true,
                ente_publico,
                // contratos: contratosActivos,
                auditoria: notificacionesExistentes.concat(nuevasNotificaciones),
                total,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
            });
        }
    },
    



    updateStatusNotification: async (req, res = response) => {
        try {
            const { ocid } = req.params;
            const notificacion = await Revitions.findOne({ ocid });
            if (!notificacion) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Notificación no encontrada'
                });
            }
            notificacion.status = 'REVISADO';
            notificacion.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
            await notificacion.save();

            return res.status(200).json({
                ok: true,
                msg: 'Estado de la notificación actualizado a REVISADO',
                notificacion
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    },

    //todo lo revisiones
    getAllNotificacionsByRevitions: async (req, res = response) => {
        const { ocid, revision_id } = req.params;
        try {
            const notificaciones = await Notification.find({
                ocid,
                revision_id
            });

            const countNotificaciones = await Notification.countDocuments({
                revision_id,
            });
            return res.status(200).json({
                ok: true,
                notificaciones,
                countNotificaciones
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',

            });
        }

    },

    getAllNotificacionsByUser: async (req, res = response) => {
        const { uid } = req;
        try {
            // Obtener las notificaciones con estado 'no visto'

            const user = await Usuario.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }

            const ente_id = user.id_ente_publico;

            const owner = await Usuario.findOne({
                id_ente_publico: ente_id,
                role: "adminstrador_ente"
            });

            if (!owner) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Administrador del ente no encontrado'
                });
            }


            const notificaciones = await Notification.find({
                $or: [{ uid }, { owner_id: uid }],
                //status: 'no visto'
            });

            // Contar el número de notificaciones con estado 'no visto'
            const countNotificaciones = await Notification.countDocuments({
                $or: [{ uid }, { owner_id: uid }],
                status: 'no visto'
            });

            return res.status(200).json({
                ok: true,
                notificaciones,
                countNotificaciones
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    },

    getOneNotificacion: async (req, res = response) => {
        const { _id } = req.params;
        try {
            const notificacion = await Notification.findById({
                _id,
            });
            if (!notificacion) {
                return res.status(400).json({
                    ok: false,
                    msg: "Notificación no encontrada"
                });
            }
            return res.status(200).json({
                ok: true,
                notificacion
            });
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }

    },
    createNotification: async (req, res = response) => {
        try {
            const uid = req.uid;
            const { ocid, revision_id } = req.params;
            const { status, notification_text } = req.body;

            // Verificar que la revisión es válida
            const validRevision = await Revitions.findById(revision_id);
            if (!validRevision) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Revisión no encontrada'
                });
            }

            const user = await Usuario.findById(uid);
            if (!user) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no encontrado'
                });
            }

            const ente_id = user.id_ente_publico;

            const owner = await Usuario.findOne({
                id_ente_publico: ente_id,
                role: "adminstrador_ente"
            });

            if (!owner) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Administrador del ente no encontrado'
                });
            }

            const newNotification = new Notification({
                uid,
                owner_id: owner,
                ocid,
                revision_id,
                status: status || 'no visto',
                notification_text,
                created_at: moment().format("YYYY-MM-DD HH:mm:ss")
            });

            const savedNotification = await newNotification.save();
            return res.status(201).json({
                ok: true,
                msg: 'Notificación creada correctamente',
                //notificacion: savedNotification
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    },

    updateNotification: async (req, res = response) => {
        try {
            const { id } = req.params;
            const uid = req;
            const { ocid, revision_id } = req.params;
            const { status, notification_text } = req.body;

            const updatedData = {
                uid,
                ocid,
                revision_id,
                status,
                notification_text,
                updated_at: moment().format("YYYY-MM-DD HH:mm:ss")
            };

            const updatedNotification = await Notification.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedNotification) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Notificación no encontrada'
                });
            }

            return res.status(200).json({
                ok: true,
                msg: 'Notificación actualizada correctamente',
                notificacion: updatedNotification
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    },
    updateNotificacionStatus: async (req, res = response) => {
        const { _id, status } = req.params;
        const visto = await Notification.findByIdAndUpdate(_id,
            {
                status
            },
            { new: true });
        if (!visto) {
            return res.status(404).json({
                ok: false,
                msg: 'Notificación no encontrada'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Notificación actualizada correctamente',
            //notificacion: visto
        });

    },






};



module.exports = OICController;
