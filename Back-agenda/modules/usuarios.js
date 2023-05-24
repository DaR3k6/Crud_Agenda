//Modulos requeridos para el proyecto
const express = require("express");
const cors = require("cors"); //Para evitar restricciones entre llamadas de sitios
const usuario = express.Router(); //Trae el metodo router de express para hacer los endpoints
const conex = require("./bdatos.js");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util"); //La trae por defecto NODE JS me permite usar async/await opcion a fetch

//Construimos la capa intermedia de la aplicacion MIDDLEWARE
usuario.use(express.json()); //Serializa la data en JSON
usuario.use(cors()); //Permite el acceso de otras direciones IP distintas a mi servicio
usuario.options("*", cors()); //Configura las IP admitidas por cors, * significa que las acepta todas

//Codificamos los verbos HTTP (CRUD tipico)
const campoUsuario = ["nombre", "apellido", "email", "password"];

usuario.get("/usuarios", async (req, res) => {
  try {
    conex.query(
      "SELECT idUsuario,nombre,email FROM usuario; ",
      (error, respuesta) => {
        console.log(respuesta);
        res.send(respuesta);
      }
    );
  } catch (error) {
    //throw error;
    console.log(error);
  }
});

/* //Verbo GET LISTAR
usuario.get("/usuarios", (req, res) => {
  conex.query("SELECT * FROM usuario", (error, respuesta) => {
    if (error) {
      throw error;
    } else {
      res.send(respuesta);
    }
  });
}) */

//Verbo POST INSERTAR USUARIO
usuario.post("/usuarios", async (req, res) => {
  try {
    let data = {};
    campoUsuario.forEach(campo => {
      if (campo === "constraseña") {
        data[campo] = bycript.hashSync(req.body[campo]);
      } else {
        data[campo] = req.body[campo];
      }
    });
    conex.query("INSERT INTO usuario SET ?", data, (error, respuesta) => {
      console.log(`Registro correcta ${respuesta}`);
      res.status(201).send(respuesta);
    });
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
});

//Login de Usuario
usuario.post("/login", async (req, res) => {
  try {
    const email = req.body["email"];
    const constraseña = req.body["constraseña"]; // Utilizamos el nombre correcto
    //Validamos que llegen los datos completos
    if (!email || !constraseña) {
      console.log("Debe enviar los datos completos");
    } else {
      conex.query(
        "SELECT * FROM usuario WHERE email = ? ",
        [email],
        async (error, respuesta) => {
          if (
            respuesta.length == 0 ||
            !(await bycript.compare(constraseña, respuesta[0].constraseña)) // Utilizamos el nombre correcto
          ) {
            // res.send({ estado: true, nombre: "Juanito" });
            //res.sendStatus(200);
            console.log(
              "El usuario y/o la clave ingresado no existen en la aplicación"
            );
            res.status(404).send(false);
          } else {
            //Enviamos las variables al frontend para que cargue la página
            console.log("BIENVENIDO AL SISTEMA DE INFORMACIÓN ");
            res.status(200).send(true);
            res.status(200).send(respuesta);
          }
        }
      );
    }
  } catch (error) {
    console.log("Hay un error en la conexión con el servidor");
    res.status(404).send(error);
  }
});

//Verbo PUT ACUTALIZAR
usuario.put("/usuarios/:idUsuario", (req, res) => {
  let id = req.params.idUsuario;
  let data = {};
  campoUsuario.forEach(campo => {
    if (req.body[campo]) {
      data[campo] = req.body[campo];
    }
  });
  conex.query(
    "UPDATE usuario SET ? WHERE idUsuario = ?",
    [data, id],
    (error, respuesta) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).send(respuesta);
      }
    }
  );
});
//Verbo DELETE ELIMINAR
usuario.delete("/usuarios/:idUsuario", (req, res) => {
  let id = req.params.idUsuario;
  conex.query(
    "DELETE FROM usuario WHERE idUsuario = ?",
    id,
    (error, respuesta) => {
      if (error) {
        console.log(error);
      } else {
        res.status(201).send(respuesta);
      }
    }
  );
});

module.exports = usuario;
