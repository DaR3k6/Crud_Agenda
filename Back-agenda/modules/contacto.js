//Modulos requeridos para el proyecto
const express = require("express");
const cors = require("cors"); //Para evitar restricciones entre llamadas de sitios
const contacto = express.Router(); //Trae el metodo router de express para hacer los endpoints
const conex = require("./bdatos.js");
const { promisify } = require("util"); //La trae por defecto NODE JS me permite usar async/await opcion a fetch

//Construimos la capa intermedia de la aplicacion MIDDLEWARE
contacto.use(express.json()); //Serializa la data en JSON
contacto.use(cors()); //Permite el acceso de otras direciones IP distintas a mi servicio
contacto.options("*", cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//Codificamos los verbos HTTP (CRUD tipico)
const campoContacto = [
  "NOMBRE",
  "APELLIDO1",
  "APELLIDO2",
  "TELEFONO",
  "EMAIL",
  "FECHANACIMIENTO",
];

//VERBO TRAER TODO LOS CAMPOS
contacto.get("/contactos", async (req, res) => {
  try {
    conex.query("SELECT * FROM contacto; ", (error, respuesta) => {
      console.log("Trae los datos");
      res.send(respuesta);
    });
  } catch (error) {
    //throw error;
    console.log(error);
  }
});

//Verbo POST INSERTAR CITA
contacto.post("/contactos", async (req, res) => {
  try {
    let data = {};
    campoContacto.forEach(campo => {
      data[campo] = req.body[campo];
    });
    conex.query("INSERT INTO contacto SET ?", data, (error, respuesta) => {
      console.log(`Registro correcta ${respuesta}`);
      res.status(201).send(true);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});
//Verbo DELETE ELIMINAR CITA
contacto.delete("/contactos/:id", (req, res) => {
  let id = req.params.id;
  conex.query("DELETE FROM contacto WHERE id= ?", id, (error, respuesta) => {
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
contacto.put("/contactos/:id", (req, res) => {
  let id = req.params.id;
  let data = {};
  campoContacto.forEach(campo => {
    data[campo] = req.body[campo];
  });
  conex.query(
    "UPDATE contacto SET ? WHERE id = ?",
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

module.exports = contacto;
