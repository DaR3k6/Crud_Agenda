const urlApi = "http://localhost:4000/";
//DOM
const btnEnviar = document.querySelector("#btnEnviar");

btnEnviar.addEventListener("click", e => {
  e.preventDefault();
  let sesion = {
    EMAIL: email.value,
    PASSWORD: contraseña.value,
  };
  fetch(urlApi + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sesion),
  })
    .then(response => {
      return response.text();
    })
    .then(data => {
      if (data === "true") {
        window.location = "http://127.0.0.1:5500/dashboard.html";
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
          footer: '<a href="">Why do I have this issue?</a>',
        });
      }
    });
});
