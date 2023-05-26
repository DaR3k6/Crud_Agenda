const urlApi = "http://localhost:4000/";

//CREO LA API PARA TRAER TODO EL FORMULARIO
const container1 = document.querySelector("#card1");
const container2 = document.querySelector("#card2");
const container3 = document.querySelector("#card3");

fetch(urlApi + "citas")
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const card = `
        <div class="card mt-3" style="width: 22rem;">
         <h2 class = "card-title flex-end" >${item.ID}</h2>
          <div class="card-body">        
           <h5 class="card-subtitle mb-5 text-body-dark">FECHA CITA: ${item.FECHA}</h5>
            <p class="card-text">ASIGNACION DE CITA : ${item.DESCRIPCION}</p>
            </br>
            <button type="button" class="btn btn-danger" id="btnBorrar">BORRAR</button>
            <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#editarCita"  id="btnEditar">EDITAR</button>
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
const btnAgendar = document.querySelector("#btnAgendar");
btnAgendar.addEventListener("click", e => {
  e.preventDefault();
  let registroCita = {
    FECHA: fecha.value,
    DESCRIPCION: description.value,
  };
  fetch(urlApi + "citas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registroCita),
  })
    .then(response => {
      return response.text();
    })
    .then(data => {
      if (data === "true") {
        Swal.fire({
          icon: "success",
          title: "CITA GUARDADA",
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
      console.log(data);
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
    title: "DESEA ELIMIAR ESTA CITA?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "SI",
    denyButtonText: `NO`,
  }).then(result => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      fetch(urlApi + "citas/" + id, { method: "DELETE" })
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
      FECHA: fechaCita.value,
      DESCRIPCION: descriptionCita.value,
    };

    fetch(urlApi + "citas/" + id, {
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
