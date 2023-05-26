const urlApi = "http://localhost:4000/";

//CREO LA API PARA TRAER TODO EL FORMULARIO
const container1 = document.querySelector("#card1");
const container2 = document.querySelector("#card2");
const container3 = document.querySelector("#card3");

fetch(urlApi + "contactos")
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const card = `
        <div class="card mt-3" style="width: 22rem;">
         <h2 class = "card-title flex-end" >${item.ID}</h2>
          <div class="card-body">        
           <h2 class="card-subtitle mb-2 text-body-dark">${
             item.NOMBRE + item.APELLIDO1 + item.APELLIDO2
           }</h3>
           <h4 class="card-text">NUMERO DE TELEFONO: ${item.TELEFONO}</h4>
           <h5 class="card-text">GMAIL: ${item.EMAIL}</h5>
           <h5 class="card-text">FECHA NACIMIENTO: ${
             item.FECHANACIMIENTO
           }</h5>         
           </br> 
            <button type="button" class="btn btn-danger" id="btnBorrar">BORRAR</button>
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editarContacto"  id="btnEditar">EDITAR</button>
          </div>
        </div>
      `;
      if (card.length % 3 === 0) {
        container1.innerHTML += card;
      } else if (card.length % 3 === 1) {
        container2.innerHTML += card;
      } else if (card.length % 3 === 2) {
        container3.innerHTML += card;
      } else {
        container1.innerHTML += card;
      }
    });
  });

//CREO EL API INSERTAR LA CITA
const btnContactar = document.querySelector("#btnContactar");
btnContactar.addEventListener("click", e => {
  e.preventDefault();
  let registroContacto = {
    NOMBRE: nombreContacto.value,
    APELLIDO1: apellidoContacto.value,
    APELLIDO2: apellido2Contacto.value,
    TELEFONO: telefono.value,
    EMAIL: emailContacto.value,
    FECHANACIMIENTO: fechaContacto.value,
  };
  fetch(urlApi + "contactos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registroContacto),
  })
    .then(response => {
      return response.text();
    })
    .then(data => {
      if (data === "true") {
        Swal.fire({
          icon: "success",
          title: "CONTACTO GUARDADO",
          showConfirmButton: false,
        });
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        Swal.fire({
          icon: "ERROR",
          title: "FALLA CON LA CONEXION DE DATOS",
          text: "PUEDE QUE LA CONEXION ESTE FALLADON!",
        });
      }
    });
});

//CREAR METODO ON PARA SELECCIONAR POR FILA CON DOM
const on = (element, event, selector, handler) => {
  element.addEventListener(event, e => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

//BORRAR
on(document, "click", "#btnBorrar", e => {
  let fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  Swal.fire({
    title: "QUIERE BORRAR ESTE CONTACTO?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "SI",
    denyButtonText: `NO`,
  }).then(result => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(urlApi + "contactos/" + id, { method: "DELETE" })
        .then(response => {
          return response.text();
        })
        .then(data => {
          if (data === "true") {
            Swal.fire("BORRADO EXITOSAMENTE!", "", "success");
          }
          setTimeout(() => {
            location.reload();
          }, 1500);
        });
    } else if (result.isDenied) {
      Swal.fire("ERROR PARA BORRAR", "", "info");
    }
  });
});
//EDITAR
const formularioEditar = document.querySelector("#formularioEditar");
on(document, "click", "#btnEditar", e => {
  let fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;

  formularioEditar.addEventListener("submit", e => {
    e.preventDefault();

    let editarCita = {
      NOMBRE: nombre.value,
      APELLIDO1: apellido.value,
      APELLIDO2: segundoApellido.value,
      TELEFONO: telefonoContacto.value,
      EMAIL: email.value,
      FECHANACIMIENTO: fechaNacimiento.value,
    };

    fetch(urlApi + "contactos/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editarCita),
    })
      .then(response => {
        return response.text();
      })
      .then(data => {
        if (data === "true") {
          Swal.fire({
            icon: "success",
            title: "EDITADO EXITOSAMENTE",
            showConfirmButton: false,
          });
          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      });
  });
});
