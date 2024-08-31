import bcrypt from "bcryptjs";
import response from "express";
import { userName } from "../helpers/id_parties";
import { JWTgenerate } from "../helpers/jwt";
import { generarSlug } from "../helpers/toolsHelper";
import contrato from "../models/contrato";
import Count from "../models/count";
import Entes from "../models/entes";
import proveedores from "../models/proveedores";
import servidoresEnte from "../models/servidoresEnte";
import Usuario from "../models/usuario";
import usuario from "../models/usuario";

const usrController = {

  /****************FUNCIONES DE USUARIO**************  */
  getUser: async (req, res) => {

    try {
      const usuarios = await Usuario.find();
      const total = await Usuario.countDocuments();
      //console.log("usuarios_getUser" + usuarios);
      res.status(200).json({
        ok: true,
        usuarios,
        total,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  createAdminUser: async (req, res = response) => {
    try {
      const countExists = await Count.countDocuments(); // Verifica si ya existe un registro en Count
      if (countExists === 0) { // Solo procede si no hay ningún registro
        const con = new Count(req.body);
        const contrat = await contrato.countDocuments();
        con.contract_count = contrat;
        await con.save();
      }


      const contr = await Count.findOne().exec();

      const nombres = "admsesea";
      const ExisteSuper = await Usuario.findOne({ nombres });
      if (ExisteSuper) {
        return res.status(400).json({
          ok: false,
          msg: `El superadmin ya existe`,
        });
      }
      const usuario = new Usuario(req.body);
      let password = "pass1234";
      const salt = bcrypt.genSaltSync();
      usuario.nombres = nombres;
      usuario.userName = "adm.s6@SEA24";
      usuario.email = "admsesea@seaslp.org";
      usuario.ente_publico =
        "SECRETARIA EJECUTIVA DEL SISTEMA ESTATAL ANTICORRUPCION DE SAN LUIS POTOSI";
      usuario.primer_apellido = "admin";
      usuario.segundo_apellido = "admin";
      usuario.rfc = password;
      usuario.password = bcrypt.hashSync(password, salt);
      usuario.role = "seseaadmin";
      await usuario.save();
      //const token = await JWTgenerate(usuario.id);
      res.status(200).json({
        ok: true,
        msg: "El superadmin ha sido creado",
        _idKEY: contr._id,
      });
    } catch (error) {
      //console.log(error)
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... revisar logs",
        error: error,
      });
    }
  },
  resetPasswordUser: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const usuarioDB = await Usuario.findById({ _id: uid });
      if (!usuarioDB) {
        return res.status(400).json({
          ok: false,
          msg: "El usuario no existe en la base de datos",
        });
      }
      const pass = "pass1234";
      const salt = bcrypt.genSaltSync();
      const resetPass = bcrypt.hashSync(pass, salt);
      const passwordUpdate = await Usuario.updateOne(
        { _id: uid },
        { $set: { password: resetPass, fist_login: true } }
      );
      if (passwordUpdate) {
        return res.status(200).json({
          ok: true,
          msg: "Contraseña cambiada Satisfactoriamente",
        });
      }
    } catch (error) { }

    //const rfc = us;
  },
  getDataUser: async (req, res) => {
    try {
      const uid = req.uid;
      //console.log(req.uid);
      const usuarioDB = await Usuario.findOne({ _id: uid });
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: "No existe usuario",
        });
      } else {
        return res.status(200).json({
          ok: true,
          user: usuarioDB,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... usuario no existe",
      });
    }
  },
  getOneUser: async (req, res) => {
    //console.log('Inicio getOneUser listar entes');
    try {
      const uid = req.params.id;
      const usuarioDB = await Usuario.findById(uid);
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: "No existe usuario",
        });
      } else {
        return res.status(200).json({
          ok: true,
          user: usuarioDB,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... usuario no existe",
      });
    }
  },
  createUsers: async (req, res = response) => {

    try {

      // console.log(req.body.ente_publico.ente_id);
      // return
      const { email, rfc } = req.body;
      const ExisteEmail = await Usuario.findOne({ email });
      if (ExisteEmail) {
        return res.status(200).json({
          ok: false,
          msg: `EL USUARIO ${email} YA EXISTE EN NUESTROS REGISTROS, CONTACTE AL ADMINISTRADOR`,
        });
      }

      const usuario = new Usuario({ ...req.body });
      let password = "pass1234";
      const salt = bcrypt.genSaltSync();
      usuario.password = bcrypt.hashSync(password, salt);
      if (usuario.nombres != "" && usuario.nombres != null) {
        usuario.nombres = usuario.nombres.toUpperCase();
      }
      if (usuario.primer_apellido != "" && usuario.primer_apellido != null) {
        usuario.primer_apellido = usuario.primer_apellido.toUpperCase();
      }
      if (usuario.rfc != "" && usuario.rfc != null) {
        usuario.rfc = usuario.rfc.toUpperCase();
      }
      if (usuario.ente_publico != "" && usuario.ente_publico != null) {
        usuario.ente_publico = usuario.ente_publico.toUpperCase();
      }

      if (usuario.segundo_apellido != "" && usuario.segundo_apellido != null) {
        usuario.segundo_apellido = usuario.segundo_apellido.toUpperCase();
      }
      if (usuario.curp != "" && usuario.curp != null)
        usuario.curp = usuario.curp.toUpperCase();

      if (usuario.cargo != "" && usuario.cargo != null)
        usuario.cargo = usuario.cargo.toUpperCase();

      if (usuario.rfc_homoclave != "" && usuario.rfc_homoclave != null)
        usuario.rfc_homoclave = usuario.rfc_homoclave.toUpperCase();

      if (usuario.role === "oic") {
        usuario.userName = `OIC.S6@${userName(4)}`;
      } else {
        usuario.userName = `ADM.S6@${userName(4)}`;
      }

      usuario.estatus = 1;
      usuario.id_ente_publico = req.body.ente_publico.ente_id
      //obtengo id ente


      const enteUpdated = await Entes.findById(usuario.id_ente_publico);

      usuario.id_ente_publico = enteUpdated._id;
      usuario.ente_publico = enteUpdated.ente;
      await usuario.save();
      const token = await JWTgenerate(usuario.id);
      res.status(200).json({
        ok: true,
        usuario,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(200).json({
        ok: false,
        msg: "ERROR INESPERADO-... REVISAR LOGS",
        error: error,
      });
    }
  },
  updateUser: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const usuario = new Usuario();
      const usuarioDB = await Usuario.findById(uid);
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: "NO ÉXISTE USUARIO",
        });
      }
      const { password, email, ...campos } = req.body;
      const ente_public = await Entes.findOne({ _id: campos.ente_publico.ente_id });
      const ente_id = ente_public._id;
      const nombre_ente = ente_public.ente;
      if (usuarioDB.email !== email) {
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
          return res.status(400).json({
            ok: false,
            msg: "EMAIL NO VALIDO",
          });
        }
      }
      usuario.email = email;
      if (req.body.role === "oic") {
        usuario.userName = `OIC.S6@${req.body.userName.split('@')[1]}`;
      } else {
        usuario.userName = `ADM.S6@${req.body.userName.split('@')[1]}`;
      }
      usuario.role = req.body.role;

      if (req.body.nombres != "" && req.body.nombres != null)
        usuario.nombres = req.body.nombres.toUpperCase();
      else
        usuario.nombres = "";
      if (req.body.primer_apellido != "" && req.body.primer_apellido != null)
        usuario.primer_apellido = req.body.primer_apellido.toUpperCase();
      else
        usuario.primer_apellido = "";
      if (req.body.segundo_apellido != "" && req.body.segundo_apellido != null)
        usuario.segundo_apellido = req.body.segundo_apellido.toUpperCase();
      else
        usuario.segundo_apellido = "";
      if (req.body.cargo_publico != "" && req.body.cargo_publico != null)
        usuario.cargo_publico = req.body.cargo_publico.toUpperCase();
      else
        usuario.cargo_publico = null;
      if (req.body.curp != "" && req.body.curp != null)
        usuario.curp = req.body.curp.toUpperCase();
      else
        usuario.curp = null;
      if (req.body.rfc != "" && req.body.rfc != null)
        usuario.rfc = req.body.rfc.toUpperCase();
      else
        usuario.rfc = "";

      if (req.body.rfc_homoclave != "" && req.body.rfc_homoclave != null)
        usuario.rfc_homoclave = req.body.rfc_homoclave.toUpperCase();
      else
        usuario.rfc_homoclave = "";
      usuario.estatus = 1;
      usuario.id_ente_publico = ente_id
      usuario.ente_publico = nombre_ente
      const userUpdated = await Usuario.findByIdAndUpdate(uid,
        {
          email: usuario.email,
          nombres: usuario.nombres,
          primer_apellido: usuario.primer_apellido,
          segundo_apellido: usuario.segundo_apellido,
          ente_publico: usuario.ente_publico,
          id_ente_publico: usuario.id_ente_publico,
          cargo_publico: usuario.cargo_publico,
          role: usuario.role,
          curp: usuario.curp,
          rfc: usuario.rfc,
          rfc_homoclave: usuario.rfc_homoclave,
          userName: usuario.userName
        }, { upsert: false, new: false } //, {  new: true } 
      );
      if (userUpdated) {

        return res.status(200).json({
          ok: true,
          usuario: userUpdated,
          msg: `EL ${usuario} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {
        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE USUARIO",
        });
      }
    } catch (error) {
      // console.log("ERROR INESPERADO" + error.msg);
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... USUARIO NO ÉXISTE",
      });
    }
  },
  deleteUser: async (req, res = response) => {
    try {

      const usuarioDB = await usuario.findById(uid);
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: "No existe usuario",
        });
      }
      await Usuario.findByIdAndDelete(uid);
      res.status(200).json({
        ok: true,
        msg: "Usuario Eliminado",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "Error Inesperado-... usuario no existe",
      });
    }
  },
  deleteUsuario: async (req, res = response) => {
    try {

      // console.log("Entre deleteUsuario usuarioControler ");
      // console.log("Antes_usuarioControler : ");
      const uid = req.params.id;

      // console.log("Antes_usuarioControler : " + uid);


      const usuarioUpdated = await Usuario.findByIdAndUpdate(uid, {
        estatus: 0,
        // update_at:entes.created_at,
      },
        {
          new: true
        });
      // console.log("inicio deleteUsuario_usuarioControler2 : " + usuarioUpdated);
      if (usuarioUpdated) {
        //  console.log("Entre deleteUsuario_usuarioControler2 : " + usuarioUpdated);
        return res.status(200).json({
          ok: true,
          msg: "USUARIO ELIMINADO",
        });
      }

    } catch (error) {
      return res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... USUARIO NO EXISTE",
      });
    }
  },
  /****************FUNCIONES DE SERVIDOR ENTE**************  */
  getServidor: async (req, res) => {


    try {
      const serv = await servidoresEnte.find();
      const total = await servidoresEnte.countDocuments();
      //console.log("usuarios_getUser"+usuarios);
      res.status(200).json({
        ok: true,
        serv,
        total,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  createServidorEnte: async (req, res = response) => {
    // console.log("Crear_Servidorente EntesController" + req.body);
    try {
      const estatus = 1;
      const nombres_servidor = req.body.nombres_servidor.toUpperCase();
      const primer_apellido_servidor = req.body.primer_apellido_servidor.toUpperCase();

      let segundo_apellido_servidor = req.body.segundo_apellido_servidor;

      if (req.body.segundo_apellido_servidor != null && req.body.segundo_apellido_servidor != "") {
        // console.log("entre segundo_apellido_servidor 2" + segundo_apellido_servidor);
        segundo_apellido_servidor = req.body.segundo_apellido_servidor.toUpperCase();
      }

      const rfc_servidor = req.body.rfc_servidor.toUpperCase();
      const cargo_servidor = req.body.cargo_servidor.toUpperCase();
      const email_servidor = req.body.email_servidor;
      const telefono_servidor = req.body.telefono_servidor;
      //  console.log("telefono_servidor 1" + telefono_servidor);
      const telefonofax_servidor = req.body.telefonofax_servidor;
      const area = req.body.area.toUpperCase();
      const uid = req.body.uid;
      const id_usuario = req.body.id_usuario;

      const ExisteServidorEnte = await servidoresEnte.find({ rfc_servidor, uid, estatus });

      //verifica que no exista el servidor ente
      if (ExisteServidorEnte != "") {
        res.status(200).json({
          ok: false,
          msg: `EL SERVIDOR DEL ENTE ${nombres_servidor} YA EXISTE EN NUESTROS REGISTROS, CONTACTE AL ADMINISTRADOR`,
        });
      }

      //validar que seleccionen un estado de la lista
      else {
        const servidorEntes = new servidoresEnte({ ...req.body, nombres_servidor });


        servidorEntes.id_ente_publico = uid;
        servidorEntes.id_usuario = id_usuario;
        servidorEntes.nombres_servidor = nombres_servidor;
        servidorEntes.estatus = 1;
        servidorEntes.primer_apellido_servidor = primer_apellido_servidor;
        servidorEntes.segundo_apellido_servidor = segundo_apellido_servidor;
        servidorEntes.rfc_servidor = rfc_servidor;
        servidorEntes.cargo_servidor = cargo_servidor;
        servidorEntes.email_servidor = email_servidor;
        servidorEntes.telefono_servidor = telefono_servidor;
        servidorEntes.telefonofax_servidor = telefonofax_servidor;
        servidorEntes.area = area;


        await servidorEntes.save();
        const token = await JWTgenerate(servidorEntes.id);
        //const _id=servidorEntes.id;

        res.status(200).json({
          ok: true,
          servidorEntes,
          token,
          msg: `EL ${nombres_servidor} YA HA SIDO REGISTRADO`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
        error: error,
      });
    }
  },
  getServidores: async (req, res) => {
    try {

      const uid = req.params.id;
      const servidorEntes = await servidoresEnte.find({ "estatus": 1, "id_ente_publico": uid });
      const total = await servidoresEnte.countDocuments();

      res.status(200).json({
        ok: true,
        servidores: servidorEntes,
        total,
      });
      // console.log("getServidores UsersController"+servidorEntes);

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  getOneServidor: async (req, res) => {
    try {
      // console.log('Entre getOneServidor');
      const id = req.params.id;
      const Servidor = await servidoresEnte.findById(id);
      // console.log('Entre getOneServidor');
      if (!Servidor) {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE SERVIDOR PÚBLICO",
        });
      } else {
        // console.log('Entre servidor' + Servidor);
        return res.status(200).json({
          ok: true,
          Servidor: Servidor,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO... SERVIDOR PÚBLICO NO EXISTE",
      });
    }
  },
  deleteServidor: async (req, res = response) => {
    try {

      const uid = req.params.id;
      // console.log("Entre deleteServidor_usuarioControler : " + uid);
      const servUpdated = await servidoresEnte.findByIdAndUpdate(uid, {
        estatus: 0,
        // update_at:entes.created_at,
      },
        {
          new: true
        });

      if (servUpdated) {
        //  console.log("Entre TRUE : " + servUpdated);
        return res.status(200).json({
          ok: true,
          msg: "SERVIDOR PÚBLICO ELIMINADO",
        });

      }
    } catch (error) {
      //  console.log("Entre error : " + error);
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... SERVIDOR PÚBLICO NO EXISTE",
      });
    }
  },
  updateServidor: async (req, res = response) => {
    try {
      // console.log("entre updateServidor" + req.body.uid);

      const nombres_servidor = req.body.nombres_servidor.toUpperCase();
      const primer_apellido_servidor = req.body.primer_apellido_servidor.toUpperCase();
      let segundo_apellido_servidor = req.body.segundo_apellido_rep_legal;
      if (req.body.segundo_apellido_servidor != null && req.body.segundo_apellido_servidor != "") {
        segundo_apellido_servidor = req.body.segundo_apellido_servidor.toUpperCase();
      }
      const rfc_servidor = req.body.rfc_servidor.toUpperCase();
      const cargo_servidor = req.body.cargo_servidor.toUpperCase();
      const email_servidor = req.body.email_servidor;
      const telefono_servidor = req.body.telefono_servidor;
      const telefonofax_servidor = req.body.telefonofax_servidor;
      const area = req.body.area.toUpperCase();
      const uid = req.body.uid;
      const id_usuario = req.body.id_usuario;

      // console.log("Fecha servUpdated 1");
      const servUpdated = await servidoresEnte.findByIdAndUpdate(uid,
        {

          nombres_servidor: nombres_servidor,
          primer_apellido_servidor: primer_apellido_servidor,
          segundo_apellido_servidor: segundo_apellido_servidor,
          rfc_servidor: rfc_servidor,
          cargo_servidor: cargo_servidor,
          email_servidor: email_servidor,
          telefono_servidor: telefono_servidor,
          telefonofax_servidor: telefonofax_servidor,
          area: area,
          // update_at:"2024-03-20 20:48:11",
        }, { upsert: false, new: false } //, {  new: true } 

      );

      // console.log("Fecha servUpdated" + servUpdated);
      if (servUpdated) {

        return res.status(200).json({
          ok: true,
          servidor: servUpdated,
          msg: `EL ${nombres_servidor} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE SERVIDOR PÚBLICO",
        });
      }


    } catch (error) {

      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO... NO EXISTE PROVEEDOR",
      });
    }
  },
  getServidorEnteReq: async (req, res) => {
    try {

      const uid = req.params.id;
      const servidorEntes = await servidoresEnte.find({ "estatus": 1, "id_ente_publico": uid, "area": "ÁREA REQUIRIENTE" });
      const total = await servidoresEnte.countDocuments();

      res.status(200).json({
        ok: true,
        servidores: servidorEntes,
        total,
      });
      // console.log("getServidores UsersController"+servidorEntes);

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  getServidorEnteCont: async (req, res) => {
    try {

      const uid = req.params.id;
      const servidorEntes = await servidoresEnte.find({ "estatus": 1, "id_ente_publico": uid, "area": "ÁREA CONTRATANTE" });
      const total = await servidoresEnte.countDocuments();

      res.status(200).json({
        ok: true,
        servidores: servidorEntes,
        total,
      });
      // console.log("getServidores UsersController"+servidorEntes);

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  getServidorEnteRes: async (req, res) => {
    try {

      const uid = req.params.id;
      const servidorEntes = await servidoresEnte.find({ "estatus": 1, "id_ente_publico": uid, "area": "ÁREA RESPONSABLE DE LA EJECUCIÓN" });
      const total = await servidoresEnte.countDocuments();

      res.status(200).json({
        ok: true,
        servidores: servidorEntes,
        total,
      });
      //console.log("getServidorEnteRes UsersController"+servidorEntes);

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  /****************FUNCIONES DE  ENTE**************  */

  getE: async (req, res) => {
    // console.log('Entre getE listar entes');
    try {
      const entes = await Entes.find();
      const total = await Entes.countDocuments({ "estatus": 1 });
      //console.log('Entre getE'+entes);
      res.status(200).json({
        ok: true,
        entes,
        total,
      });
    } catch (error) {
      console.log('Error');
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },

  getEnteForm: async (req, res) => {
    try {
      const entes = await Entes.find({ "estatus": 1 });
      res.status(200).json({
        ok: true,
        entes
      });
    } catch (error) {
      console.log('Error');
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },

  createEnte: async (req, res = response) => {
    //console.log("Crear_ente EntesController"+req.body);
    try {
      const estatus = 1;
      const ente = req.body.ente.toUpperCase();
      const slug = generarSlug(ente);
      const siglas = req.body.siglas.toUpperCase();
      const estado = req.body.estado.toUpperCase();
      const municipio = req.body.municipio.toUpperCase();
      const uid = req.uid;


      const ExisteEnte = await Entes.findOne({ slug: slug });


      if (ExisteEnte) {
        return res.status(200).json({
          ok: false,
          msg: `EL ENTE ${ente} YA EXISTE EN NUESTROS REGISTROS, CONTACTE AL ADMINISTRADOR`,
        });
      }

      //validar que seleccionen un estado de la lista

      const entes = new Entes({ ...req.body, ente });


      entes.id_usuario = uid;
      entes.ente = entes.ente.toUpperCase();
      entes.estatus = 1;
      entes.siglas = entes.siglas.toUpperCase();
      await entes.save();
      const token = await JWTgenerate(entes.id);
      const _id = entes.id;

      res.status(200).json({
        ok: true,
        entes,
        token,
        msg: `EL ${ente} YA HA SIDO REGISTRADO`,
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
        error: error,
      });
    }
  },
  getOneEnte: async (req, res) => {
    try {
      const id = req.params.id;
      const enteDB = await Entes.findById(id);
      if (!enteDB) {
        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE ENTE",
        });
      } else {
        return res.status(200).json({
          ok: true,
          entes: enteDB,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO... ENTE NO EXISTE",
      });
    }
  },
  deleteEnte: async (req, res = response) => {
    try {
      const uid = req.params.id;
      const usuario = await Usuario.find({ "id_ente_publico": uid });
      if (usuario.length > 0) {
        return res.status(404).json({
          ok: false,
          msg: `ESTE ENTE TIENE ${usuario.length} USUARIOS REGISTRADOS`,
        });
      }


      const enteUpdated = await Entes.findByIdAndUpdate(uid, {
        estatus: 0,
      },
        {
          new: true
        });

      if (enteUpdated) {
        return res.status(200).json({
          ok: true,
          msg: "ENTE PÚBLICO ELIMINADO",
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... ENTE PÚBLICO NO EXISTE",
      });
    }
  },
  deleteRegistroEnte: async (req, res = response) => {
    try {
      //console.log("Entre deleteEnte_usuarioControler : ");
      const uid = req.params.id;
      //console.log("Entre deleteEnte_usuarioControler : " + uid);

      const enteDB = await Entes.findById(uid);
      if (!enteDB) {
        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE EL ENTE",
        });
      }
      await Entes.findByIdAndDelete(uid);
      res.status(200).json({
        ok: true,
        msg: "ENTE ELIMINADO",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... USUARIO NO EXISTE",
      });
    }
  },
  updateEnte: async (req, res = response) => {
    try {

      const uid = req.body.ente_id;
      const entes = new Entes();

      const { ente, siglas, ...campos } = req.body;


      entes.ente = req.body.ente.toUpperCase();
      entes.slug = generarSlug(entes.ente);
      entes.siglas = req.body.siglas.toUpperCase();
      entes.municipio = req.body.municipio.toUpperCase();
      entes.estado = req.body.estado.toUpperCase();


      const enteUpdated = await Entes.findByIdAndUpdate(uid,
        {
          ente: entes.ente,
          slug: entes.slug,
          siglas: entes.siglas,
          estado: entes.estado,
          municipio: entes.municipio,
          // update_at:"2024-03-20 20:48:11",
        }, { upsert: false, new: false } //, {  new: true } 

      );

      //console.log("Fecha" + enteUpdated);
      if (enteUpdated) {

        return res.status(200).json({
          ok: true,
          ente: enteUpdated,
          msg: `EL ${ente} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE ENTE",
        });
      }


    } catch (error) {

      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
      });
    }
  },
  updateEnteStatus: async (req, res = response) => {
    try {
      const uid = req.params.id;
      // Asegurarse de que el campo `ente` esté presente en el cuerpo de la solicitud si se va a utilizar en la respuesta.
      const { ente, siglas, ...campos } = req.body;

      // Actualizar el ente y devolver el documento actualizado
      const enteUpdated = await Entes.findByIdAndUpdate(
        uid,
        { estatus: '1' },
        { new: true } // Devuelve el documento actualizado
      );

      // Verifica si el ente fue encontrado y actualizado
      if (enteUpdated) {
        return res.status(200).json({
          ok: true,
          msg: `El ente se ha actualizado con exito`,
          ente: enteUpdated
        });
      } else {
        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE ENTE",
        });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
        error: error.message,
      });
    }
  },

  updateEntebyEnte: async (req, res = response) => {
    try {
      //console.log("Entre updateEntebyEnte controller");


      const entes = new Entes();
      const { uid, nombre_legal, ...campos } = req.body;
      entes.nombre_comercial = campos.nombre_comercial.toUpperCase();
      entes.nombre_legal = req.body.nombre_legal.toUpperCase();
      entes.rfc = campos.rfc.toUpperCase();

      //console.log("entes.lugar:" + entes.lugar);
      entes.lugar = campos.lugar;
      entes.pais = campos.pais;
      entes.codigoPostal = campos.codigoPostal;
      entes.colonia = campos.colonia.toUpperCase();
      entes.localidad = campos.localidad.toUpperCase();
      entes.region = campos.region.toUpperCase();
      entes.calle = campos.calle.toUpperCase();
      entes.numero = campos.numero.toUpperCase();


      entes.nombres_contacto = campos.nombres_contacto.toUpperCase();
      entes.primer_apellido_contacto = campos.primer_apellido_contacto.toUpperCase();

      if (campos.segundo_apellido_contacto != null && campos.segundo_apellido_contacto != "") {
        entes.segundo_apellido_contacto = campos.segundo_apellido_contacto.toUpperCase();
      }

      entes.email_contacto = campos.email_contacto;
      entes.telefono_contacto = campos.telefono_contacto;
      entes.telefonofax_contacto = campos.telefonofax_contacto;
      entes.url_ente_contacto = campos.url_ente_contacto;
      entes.idioma = campos.idioma.toUpperCase();


      //console.log("Ente id:" + uid);
      const enteUpdated = await Entes.findByIdAndUpdate(uid,
        {
          nombre_comercial: entes.nombre_comercial,
          nombre_legal: entes.nombre_legal,
          rfc: entes.rfc,

          lugar: entes.lugar,
          pais: entes.pais,
          codigoPostal: entes.codigoPostal,
          colonia: entes.colonia,
          localidad: entes.localidad,
          region: entes.region,
          calle: entes.calle,
          numero: entes.numero,

          nombres_contacto: entes.nombres_contacto,
          primer_apellido_contacto: entes.primer_apellido_contacto,
          segundo_apellido_contacto: entes.segundo_apellido_contacto,
          email_contacto: entes.email_contacto,
          telefono_contacto: entes.telefono_contacto,
          telefonofax_contacto: entes.telefonofax_contacto,
          url_ente_contacto: entes.url_ente_contacto,
          idioma: entes.idioma,

          // update_at:"2024-03-20 20:48:11",
        }, { upsert: false, new: false } //, {  new: true } 

      );


      if (enteUpdated) {
        // console.log("Fecha" + enteUpdated);
        return res.status(200).json({
          ok: true,
          ente: enteUpdated,
          msg: `EL ${entes} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE ENTE",
        });
      }


    } catch (error) {

      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
      });
    }
  },
  getEntes: async (req, res) => {
    // console.log('Inicio getEntes listar entes');
    try {
      let query = {};

      //console.log('search:'+req.params.search);
      const search = req.params.search;
      // console.log('search:'+search);

      const entes = await Entes.find({ "estatus": 1 });
      // console.log('search:'+entes);
      query['estatus'] = 1;
      query['ente'] = { $regex: search, $options: "i" };
      //const entes;
      if (search) {
        // console.log('Entre a search:'+query.ente);
        const entes2 = await Entes.find(query);
        //   console.log('Entre a search:'+entes2);
        return res.status(200).json({
          //  ok: true,
          entes: entes2,
          // total,
        });
      }
      else {
        return res.status(200).json({
          //  ok: true,
          entes: entes,
          // total,
        });
      }



    } catch (error) {
      console.log('Error');
      res.status(400).json({
        ok: false,
        msg: "ERROR EN DB CONSULTAR SERVICIO TÉCNICO",
      });
    }
  },

  /****************FUNCIONES DE  PROVEEDOR ENTE**************  */
  createProveedores: async (req, res = response) => {

    //console.log("createProveedores EntesController"+req.body);
    try {
      const estatus = 1;
      const tipo = req.body.tipo;
      const razonsocialProv = req.body.razonsocialProv.toUpperCase();
      const rfcproveedor = req.body.rfcproveedor.toUpperCase();
      const uri_proveedor = req.body.uri_proveedor;
      let nombres_rep_legal = "";
      if (req.body.nombres_rep_legal != null && req.body.nombres_rep_legal != "") {
        nombres_rep_legal = req.body.nombres_rep_legal.toUpperCase();
      }
      let primer_apellido_rep_legal = "";
      if (req.body.primer_apellido_rep_legal != null && req.body.primer_apellido_rep_legal != "") {
        primer_apellido_rep_legal = req.body.primer_apellido_rep_legal.toUpperCase();
      }
      let segundo_apellido_rep_legal = "";
      if (req.body.segundo_apellido_rep_legal != null && req.body.segundo_apellido_rep_legal != "") {
        segundo_apellido_rep_legal = req.body.segundo_apellido_rep_legal.toUpperCase();
      }
      let rfc_rep_legal = "";
      if (req.body.rfc_rep_legal != null && req.body.rfc_rep_legal != "") {
        rfc_rep_legal = req.body.rfc_rep_legal.toUpperCase();
      }
      const lugar_proveedor = req.body.lugar_proveedor;
      const pais_proveedor = req.body.pais_proveedor;
      const codigoPostal_proveedor = req.body.codigoPostal_proveedor;

      const colonia_proveedor = req.body.colonia_proveedor.toUpperCase();
      const localidad_proveedor = req.body.localidad_proveedor.toUpperCase();
      const region_proveedor = req.body.region_proveedor.toUpperCase();
      const calle_proveedor = req.body.calle_proveedor.toUpperCase();
      const numero_proveedor = req.body.numero_proveedor;

      const nombres_contacto_prov = req.body.nombres_contacto_prov.toUpperCase();
      const primer_apellido_contacto_prov = req.body.primer_apellido_contacto_prov.toUpperCase();

      let segundo_apellido_contacto_prov = "";
      if (req.body.segundo_apellido_contacto_prov != null && req.body.segundo_apellido_contacto_prov != "") {
        const segundo_apellido_contacto_prov = req.body.segundo_apellido_contacto_prov.toUpperCase();
      }

      const email_contacto_prov = req.body.email_contacto_prov;
      const telefono_contacto_prov = req.body.telefono_contacto_prov;
      const telefonofax_contacto_prov = req.body.telefonofax_contacto_prov;
      const url_ente_contacto_prov = req.body.url_ente_contacto_prov;
      const idioma_prov = req.body.idioma_prov.toUpperCase();

      const uid = req.body.uid;
      const id_usuario = req.body.id_usuario;
      // console.log("existe antes");
      const ExisteProveedorEnte = await proveedores.find({ rfcproveedor, uid, estatus });
      //console.log("existe despues:"+ExisteProveedorEnte);
      //verifica que no exista el servidor ente
      if (ExisteProveedorEnte != "") {
        res.status(200).json({
          ok: false,
          msg: `EL PROVEEDOR DEL ENTE ${nombres_servidor} YA EXISTE EN NUESTROS REGISTROS, CONTACTE AL ADMINISTRADOR`,
        });
      }

      //validar que seleccionen un estado de la lista
      else {
        const proveedorEntes = new proveedores({ ...req.body, razonsocialProv });


        proveedorEntes.id_ente_publico = uid;
        proveedorEntes.id_usuario = id_usuario;
        proveedorEntes.estatus = 1;
        proveedorEntes.tipo = tipo;

        proveedorEntes.razonsocialProv = razonsocialProv;
        proveedorEntes.rfcproveedor = rfcproveedor;

        proveedorEntes.uri_proveedor = uri_proveedor;
        proveedorEntes.nombres_rep_legal = nombres_rep_legal;
        proveedorEntes.primer_apellido_rep_legal = primer_apellido_rep_legal;
        proveedorEntes.segundo_apellido_rep_legal = segundo_apellido_rep_legal;

        proveedorEntes.rfc_rep_legal = rfc_rep_legal;
        proveedorEntes.lugar_proveedor = lugar_proveedor;
        // console.log("existe lugar_proveedor:" + lugar_proveedor);
        proveedorEntes.pais_proveedor = pais_proveedor;
        proveedorEntes.codigoPostal_proveedor = codigoPostal_proveedor;

        proveedorEntes.colonia_proveedor = colonia_proveedor;
        proveedorEntes.localidad_proveedor = localidad_proveedor;
        proveedorEntes.region_proveedor = region_proveedor;
        proveedorEntes.calle_proveedor = calle_proveedor;
        proveedorEntes.numero_proveedor = numero_proveedor;

        proveedorEntes.nombres_contacto_prov = nombres_contacto_prov;
        proveedorEntes.primer_apellido_contacto_prov = primer_apellido_contacto_prov;
        proveedorEntes.segundo_apellido_contacto_prov = segundo_apellido_contacto_prov;
        proveedorEntes.email_contacto_prov = email_contacto_prov;
        proveedorEntes.telefono_contacto_prov = telefono_contacto_prov;
        proveedorEntes.telefonofax_contacto_prov = telefonofax_contacto_prov;
        proveedorEntes.url_ente_contacto_prov = url_ente_contacto_prov;
        proveedorEntes.idioma_prov = idioma_prov;

        // console.log("llegue aqui");
        await proveedorEntes.save();
        const token = await JWTgenerate(proveedorEntes.id);
        const _id = proveedorEntes.id;

        res.status(200).json({
          ok: true,
          proveedorEntes,
          token,
          msg: `EL ${razonsocialProv} YA HA SIDO REGISTRADO`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: "ERROR ENCONTRADO EN EL BLOQUE CATCH DEL SERVIDOR REVISAR API",
        error: error,
      });
    }
  },
  getProveedores: async (req, res) => {

    try {

      const uid = req.params.id;
      const proveedorEntes = await proveedores.find({ "estatus": 1, "id_ente_publico": uid });
      const total = await proveedores.countDocuments();

      res.status(200).json({
        ok: true,
        proveedores: proveedorEntes,
        total,
      });

    } catch (error) {
      res.status(400).json({
        ok: false,
        msg: "Error en db consultar servicio técnico",
      });
    }
  },
  getOneProveedor: async (req, res) => {
    try {
      // console.log('Entre getOneProveedor');
      const id = req.params.id;
      const Proveedor = await proveedores.findById(id);
      // console.log('Entre getOneProveedor');
      if (!Proveedor) {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE ENTE",
        });
      } else {
        // console.log('Entre Proveedor' + Proveedor);
        return res.status(200).json({
          ok: true,
          Proveedor: Proveedor,
        });
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO... ENTE NO EXISTE",
      });
    }
  },
  deleteProveedor: async (req, res = response) => {
    try {

      const uid = req.params.id;
      //console.log("Entre deleteProveedor_usuarioControler : "+ uid);
      const provUpdated = await proveedores.findByIdAndUpdate(uid, {
        estatus: 0,
        // update_at:entes.created_at,
      },
        {
          new: true
        });

      if (provUpdated) {
        // console.log("Entre TRUE : " + provUpdated);
        return res.status(200).json({
          ok: true,
          msg: "PROVEEDOR ELIMINADO",
        });

      }
    } catch (error) {
      //console.log("Entre error : " + error);
      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO-... PROVEEDOR NO EXISTE",
      });
    }
  },
  updateProveedor: async (req, res = response) => {
    try {
      // console.log("entre updateProveedor" + req.body.uid);
      //const uid = req.params.id;
      //const proveedor = new Proveedor();
      const _proveedor = new proveedores();

      const tipo = req.body.tipo;
      const razonsocialProv = req.body.razonsocialProv.toUpperCase();
      const rfcproveedor = req.body.rfcproveedor.toUpperCase();
      const uri_proveedor = req.body.uri_proveedor;
      let nombres_rep_legal = "";
      if (req.body.nombres_rep_legal != null && req.body.nombres_rep_legal != "") {
        nombres_rep_legal = req.body.nombres_rep_legal.toUpperCase();
      }
      let primer_apellido_rep_legal = "";
      if (req.body.primer_apellido_rep_legal != null && req.body.primer_apellido_rep_legal != "") {
        primer_apellido_rep_legal = req.body.primer_apellido_rep_legal.toUpperCase();
      }
      let segundo_apellido_rep_legal = "";
      if (req.body.segundo_apellido_rep_legal != null && req.body.segundo_apellido_rep_legal != "") {
        segundo_apellido_rep_legal = req.body.segundo_apellido_rep_legal.toUpperCase();
      }
      let rfc_rep_legal = "";
      if (req.body.rfc_rep_legal != null && req.body.rfc_rep_legal != "") {
        rfc_rep_legal = req.body.rfc_rep_legal.toUpperCase();
      }
      const lugar_proveedor = req.body.lugar_proveedor;
      const pais_proveedor = req.body.pais_proveedor;
      const codigoPostal_proveedor = req.body.codigoPostal_proveedor;

      const colonia_proveedor = req.body.colonia_proveedor.toUpperCase();
      const localidad_proveedor = req.body.localidad_proveedor.toUpperCase();
      const region_proveedor = req.body.region_proveedor.toUpperCase();
      const calle_proveedor = req.body.calle_proveedor.toUpperCase();
      const numero_proveedor = req.body.numero_proveedor;

      const nombres_contacto_prov = req.body.nombres_contacto_prov.toUpperCase();
      const primer_apellido_contacto_prov = req.body.primer_apellido_contacto_prov.toUpperCase();

      let segundo_apellido_contacto_prov = "";
      if (req.body.segundo_apellido_contacto_prov != null && req.body.segundo_apellido_contacto_prov != "") {
        const segundo_apellido_contacto_prov = req.body.segundo_apellido_contacto_prov.toUpperCase();
      }

      const email_contacto_prov = req.body.email_contacto_prov;
      const telefono_contacto_prov = req.body.telefono_contacto_prov;
      const telefonofax_contacto_prov = req.body.telefonofax_contacto_prov;
      const url_ente_contacto_prov = req.body.url_ente_contacto_prov;
      const idioma_prov = req.body.idioma_prov.toUpperCase();

      const uid = req.body.uid;
      //const id_usuario = req.body.id_usuario;

      // console.log("Fecha provUpdated 1" );
      const provUpdated = await proveedores.findByIdAndUpdate(uid,
        {

          tipo: tipo,
          razonsocialProv: razonsocialProv,
          rfcproveedor: rfcproveedor,

          uri_proveedor: uri_proveedor,
          nombres_rep_legal: nombres_rep_legal,
          primer_apellido_rep_legal: primer_apellido_rep_legal,
          segundo_apellido_rep_legal: segundo_apellido_rep_legal,

          rfc_rep_legal: rfc_rep_legal,
          lugar_proveedor: lugar_proveedor,

          pais_proveedor: pais_proveedor,
          codigoPostal_proveedor: codigoPostal_proveedor,

          colonia_proveedor: colonia_proveedor,
          localidad_proveedor: localidad_proveedor,
          region_proveedor: region_proveedor,
          calle_proveedor: calle_proveedor,
          numero_proveedor: numero_proveedor,

          nombres_contacto_prov: nombres_contacto_prov,
          primer_apellido_contacto_prov: primer_apellido_contacto_prov,
          segundo_apellido_contacto_prov: segundo_apellido_contacto_prov,
          email_contacto_prov: email_contacto_prov,
          telefono_contacto_prov: telefono_contacto_prov,
          telefonofax_contacto_prov: telefonofax_contacto_prov,
          url_ente_contacto_prov: url_ente_contacto_prov,
          idioma_prov: idioma_prov,
          // update_at:"2024-03-20 20:48:11",
        }, { upsert: false, new: false } //, {  new: true } 

      );

      // console.log("Fecha provUpdated" +provUpdated);
      if (provUpdated) {

        return res.status(200).json({
          ok: true,
          proveedor: provUpdated,
          msg: `EL ${razonsocialProv} YA HA SIDO ACTUALIZADO`,
        });
      }
      else {

        return res.status(404).json({
          ok: false,
          msg: "NO EXISTE PROVEEDOR",
        });
      }


    } catch (error) {

      res.status(500).json({
        ok: false,
        msg: "ERROR INESPERADO... NO EXISTE PROVEEDOR",
      });
    }
  },


};

module.exports = usrController;
