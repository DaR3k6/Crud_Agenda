//Modulos requeridos para el proyecto
const express = require("express");
const cors = require("cors"); //Para evitar restricciones entre llamadas de sitios
const cita = express.Router(); //Trae el metodo router de express para hacer los endpoints
const conex = require("./bdatos.js");
const { promisify } = require("util"); //La trae por defecto NODE JS me permite usar async/await opcion a fetch

//Construimos la capa intermedia de la aplicacion MIDDLEWARE
cita.use(express.json()); //Serializa la data en JSON
cita.use(cors()); //Permite el acceso de otras direciones IP distintas a mi servicio
cita.options("*", cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//Codificamos los verbos HTTP (CRUD tipico)
const campoCita = ["FECHA", "DESCRIPCION"];

//VERBO TRAER TODO LOS CAMPOS
cita.get("/citas", async (req, res) => {
  try {
    conex.query("SELECT * FROM cita; ", (error, respuesta) => {
      console.log("Trae todos los datos");
      res.send(respuesta);
    });
  } catch (error) {
    //throw error;
    console.log(error);
  }
});

//Verbo POST INSERTAR CITA
cita.post("/citas", async (req, res) => {
  try {
    let data = {};
    campoCita.forEach(campo => {
      data[campo] = req.body[campo];
    });
    conex.query("INSERT INTO cita SET ?", data, (error, respuesta) => {
      console.log(`Registro correcta ${respuesta}`);
      res.status(201).send(true);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
//Verbo DELETE ELIMINAR CITA
cita.delete("/citas/:id", (req, res) => {
  let id = req.params.id;
  conex.query("DELETE FROM cita WHERE ID = ?", id, (error, respuesta) => {
    if (error) {
      console.log("Error al eliminar");
      res.status(500).send(false);
    } else {
      console.log("Elimina exitosamente");
      res.status(200).send(true);
    }
  });
});
//Verbo PUT ACUTALIZAR
cita.put("/citas/:id", (req, res) => {
  let id = req.params.id;
  let data = {};
  campoCita.forEach(campo => {
    data[campo] = req.body[campo];
  });
  conex.query(
    "UPDATE cita SET ? WHERE id = ?",
    [data, id],
    (error, respuesta) => {
      if (error) {
        console.log(error);
        res.status(500).send(false);
      } else {
        res.status(201).send(true);
        console.log("Actualización exitosa");
      }
    }
  );
});

module.exports = cita;
