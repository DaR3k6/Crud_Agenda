//Instanciamos los modulos requeridos
const express = require("express");

const app = express(); //Creamos nuestra aplicacion llamando el metodo constructor de express
app.use("/", require("./modules/productos.js")); //Redirigimos al modulo rutas donde se resolveran las rutas
app.use("/", require("./modules/usuarios.js"));
app.use("/", require("./modules/categoria.js"));

app.listen("3300", () => {
  console.log("Aplicacion Ejecutandose en : http://localhost:3300");
});
