"use strict";
import express, { json } from "express";
import cors from "cors";
import { dbConect, SqlConnect } from "../config/database";
import { json as _json } from "body-parser";
import morgan from "morgan";
import morganbody from "morgan-body";
import path from "path";
import fs from "fs";
import moment from "moment";
import bodyParser from "body-parser";


import swaggerDocs from "../config/swagger";



const app = express();
// funcionalidad de logs
const logs = fs.createWriteStream(
  path.join(
    __dirname,
    "../logs",
    `apilogs_${moment().add(1).format("YYYY-MM-DD")}.log`
  ),
  { flags: "a" }
);

morganbody(app, {
  noColors: true,
  stream: logs,
  shouldLog: (req, res) => {
    // Solo registra las respuestas con código de estado >= 400 (errores)
    return res.statusCode >= 400;
  },
});

//Middelwares del servidor
// Configuración de CORS
app.use(cors());
// Parsing de JSON y URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

// // Configurar cabeceras y cors (PRUEBAS)
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//   next();
// });



//directorio publico
app.use(express.static(path.join(__dirname, "public")));
//archivos de rutas

app.use("/api/seaslp/index", require("../routes/index.routes").default);
app.use("/api/seaslp/entes", require("../routes/entes.routes"));
app.use("/api/seaslp/users", require("../routes/usuarios.routes"));
app.use("/api/seaslp/login", require("../routes/login.routes"));
app.use("/api/seaslp/tenders", require("../routes/tenders.routes"));
app.use("/api/seaslp/planning", require("../routes/planning.routes"));
app.use("/api/seaslp/contracts", require("../routes/contracts.routes"));
app.use("/api/seaslp/parties", require("../routes/parties.routes"));
app.use("/api/seaslp/buyers", require("../routes/buyers.routes"));
app.use("/api/seaslp/relases", require("../routes/releases.routes"));
app.use("/api/seaslp/awards", require("../routes/awards.routes"));
app.use("/api/seaslp/items", require("../routes/items.routes"));
app.use("/api/seaslp/documents", require("../routes/documents.routes"));
app.use("/api/seaslp/oic", require("../routes/oic.routes"));
app.use("/api/v1", require("../routes/api.routes"));

//Definiendo el puerto
const PORT = process.env.PORT || 3221;
//Iniciando Express

app.listen(PORT, () => {
  console.log(`Escuchando puerto, ${PORT}`);
  swaggerDocs(app, PORT);
  dbConect();
  // SqlConnect();
});



export default app;
