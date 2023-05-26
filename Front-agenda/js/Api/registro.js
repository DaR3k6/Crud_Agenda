const urlApi = "http://localhost:4000/";
//DOM
const btnRegistro = document.querySelector("#btnRegistro");

btnRegistro.addEventListener("click", e => {
  e.preventDefault();
  let registro = {
    NOMBRE: nombre.value,
    APELLIDO: apellido.value,
    EMAIL: emailRegistro.value,
    PASSWORD: passwordRegistro.value,
  };
  fetch(urlApi + "usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registro),
  })
    .then(response => {
      return response.text();
    })
    .then(data => {
      if (data === "true") {
        window.location = "http://127.0.0.1:5500/login.html";
        console.log(data);
      }
    });
});
