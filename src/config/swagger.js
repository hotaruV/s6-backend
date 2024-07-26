import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi, { setup } from "swagger-ui-express";

// Meta data 

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API-REST contratos SEASLP/S6",
            description: '<strong>Documentacion de los servicios de contratos s6</strong>',
            version: "2.1.10b",
            contact: {
                email: "carlosvalladaresdelvalle@gmail.com"
            },
        },
    },
    apis: ["./src/routes/*.js"], // Ruta a los archivos de rutas con comentarios Swagger
};


const SwaggerSpect = swaggerJsdoc(options);

const swaggerDocs = (app, port) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerSpect))
    app.get("/api-docs", (req, res) => {
        res.setHeader('Content-Type', 'Application/json');
        res.send(SwaggerSpect);
    });
    console.log(`Documentacion iniciada en swagger en el puerto ${port}`);

}


export default swaggerDocs;



