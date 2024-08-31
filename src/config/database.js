import mongoose from "mongoose";
import Sequelize from "sequelize";



const SQL_OPTIONS = {
  dialect: "postgres",
  host: "localhost",
  username: "hotaruv",
  password: "pass123",
  database: "hotarudb",
};



const dbConect = async () => {
  const MONGO_OPTIONS = {
    dbName: process.env.MONGO_DATABASE,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  };
  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(
      `${process.env.MONGOSERV}://${process.env.USERMONGO}:${process.env.PASSWORDMONGO}@${process.env.HOSTMONGO}`,
      MONGO_OPTIONS
    );
    console.log("La conexión a la base de datos MongoDB se ha realizado con éxito");
  } catch (error) {
    console.error("Error en la conexión a MongoDB:", error);
  }
};

const SqlConnect = async () => {
  try {
    const sequelize = new Sequelize(SQL_OPTIONS.database, SQL_OPTIONS.username, SQL_OPTIONS.password, {
      host: SQL_OPTIONS.host,
      dialect: SQL_OPTIONS.dialect,
    });

    await sequelize.authenticate();
    console.log("La conexión a la base de datos SQL se ha realizado con éxito");
  } catch (error) {
    console.error("Error en la conexión a la base de datos SQL:", error);
  }
};


module.exports = { dbConect, SqlConnect };