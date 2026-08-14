const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
let nombreRecurso;

function cancelarReserva(idReserva){
  api.get(`/user/cancelar/${idReserva}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  .then(function(response){
    if(response.data === "reserva no existe"){
      alert("reserva no existe");
    }
    if(response.data === "reserva no esta en estado reservado"){
      alert("reserva no esta en estado reservado");
    }
    if(response.data === "cancelado"){
      alert("Reserva cancelada con exito");
    }
    if(response.data === "fuera de plazo"){
      alert("Fuera de plazo para cancelar");
    }
    window.location.href = "micuenta.html";
  })
  .catch(function(error){
    console.error(error)
  })
}

async function obtenerNombre(idrecurso) {
  return new Promise((resolve, reject) => {
    api.get(`/recursos/${idrecurso}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(function(response) {
      let nombreRecurso = response.data.nnombrerecurso;
      resolve(nombreRecurso);
    })
    .catch(function(error) {
      console.error('Error al obtener los datos del recurso:', error);
      reject(error);
    });
  });
}

document.addEventListener('DOMContentLoaded', async function() {  
  await api.get(`/user/${userId}`, {
      headers: {
          'Authorization': `Bearer ${token}`
      }
  })
  .then(function(response) {
      const userData = response.data;
      // Actualizar los campos en el formulario con los datos del usuario
      document.getElementById('nombreCompleto').value = userData.nombre;
      document.getElementById('usuario').value = userData.usuario;
      document.getElementById('correo').value = userData.email;

      const Histo = response.data.historial
      
      const tableBody = document.querySelector('.table-body');
      tableBody.innerHTML = ''; // Limpiar resultados anteriores

      let flag = 0;
      Promise.all(Histo).then(function(elemento){

      })
      Histo.forEach(async elemento => {
          const row = document.createElement('tr');

          const idCell = document.createElement('td');
          idCell.textContent = elemento.kidreserva;
          row.appendChild(idCell);

          let idrecurso = Histo[flag].kidrecurso;
          flag += 1;
          
          nombreRecurso = await obtenerNombre(idrecurso);

          const nombreCell = document.createElement('td');
          nombreCell.textContent = nombreRecurso;
          row.appendChild(nombreCell);

          const fechaCell = document.createElement('td');
          fechaCell.textContent = elemento.ffechareserva;
          row.appendChild(fechaCell);

          const horaICell = document.createElement('td');
          horaICell.textContent = elemento.fhorainicioreserva;
          row.appendChild(horaICell);

          const horaFCell = document.createElement('td');
          horaFCell.textContent = elemento.fhorafinalreserva;
          row.appendChild(horaFCell);

          const estadoCell = document.createElement('td');
          estadoCell.textContent = elemento.nestadoreserva;
          row.appendChild(estadoCell);

          const opcionCell = document.createElement('td');
          if(elemento.ncalificacion === 0){
            const button = document.createElement('button');

            if(elemento.nestadoreserva === 'finalizado'){
              button.textContent = 'Calificar';
              button.addEventListener('click', () => calificar(elemento.kidreserva));
              
            }
            if(elemento.nestadoreserva === 'reservado'){
              button.textContent = "Cancelar";
              button.addEventListener('click', () => cancelarReserva(elemento.kidreserva));
            }
            opcionCell.appendChild(button);
          }else{
            opcionCell.textContent = elemento.ncalificacion;
          }
          
          
          row.appendChild(opcionCell);

          tableBody.appendChild(row);
      });
  })
  .catch(function(error) {
      console.error('Error al obtener los datos del usuario:', error);
  })
  .finally(function() {
      console.log('Petición a la API completada.');
  });
});




function calificar(idreserva) {
  window.location.href = `calificar.html?id=${idreserva}`;
}


document.getElementById('cerrarsesionsiosi').addEventListener('click', function() {
  // Borrar información de la sesión
  sessionStorage.clear();
  localStorage.clear();
  
  // Redirigir al usuario fuera de la sesión
  window.location.href = 'index.html';
  
  // Agregar una entrada al historial para prevenir regresar
  window.history.pushState(null, null, window.location.href);
});

// Función para mostrar el mensaje de error
function showError() {
  const errorMessage = document.createElement('div');
  errorMessage.id = 'errorMessage';
  errorMessage.textContent = 'No es posible regresar. Error';
  document.body.appendChild(errorMessage);
  errorMessage.style.display = 'block';
}

// Escuchar el evento popstate para interceptar la navegación hacia atrás
window.addEventListener('popstate', function(event) {
  showError();
  window.history.pushState(null, null, window.location.href);
});