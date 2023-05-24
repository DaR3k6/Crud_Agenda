const urlApi = "http://localhost:4000/";
//dom
const btnEnviar = document.querySelector("#btnEnviar");

btnEnviar.addEventListener("click", (e) => {
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
    .then((Response) => {
      return Response.text();
    })
    .then((data) => {
      if (data == "true") {
        window.location =
          "http://127.0.0.1:5501/Crud_Agenda/Front-agenda/index.html";
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
