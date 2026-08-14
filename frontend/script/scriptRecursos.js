const api = axios.create({
    baseURL: 'http://localhost:8080'
});

const token = localStorage.getItem('token');
let opcion = localStorage.getItem('idTipo');

// Se ejecuta al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-input').value = '';
    obtenerRecursos();
});

// Trae y muestra los recursos en la tabla
function obtenerRecursos(nombreRecurso = '') {
    api.get('/recursos', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function (response){
        const recursos = response.data;

        const tableBody = document.querySelector('.table-body');
        tableBody.innerHTML = ''; // Limpiar resultados anteriores

        recursos.forEach(recurso => {
            if(nombreRecurso && !recurso.nnombrerecurso.toLowerCase().includes(nombreRecurso.toLowerCase())) {
                return; // Salta este recurso si no coincide con el nombreRecurso
            }
            if(opcion != 0 && recurso.kidtiporecurso != opcion){
                return;
            }
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = recurso.kidrecurso;
            row.appendChild(idCell);

            const nombreCell = document.createElement('td');
            nombreCell.textContent = recurso.nnombrerecurso;
            row.appendChild(nombreCell);

            const descripcionCell = document.createElement('td');
            descripcionCell.textContent = recurso.ndescripcionrecurso;
            row.appendChild(descripcionCell);

            const calificacionCell = document.createElement('td');
            calificacionCell.textContent = recurso.calificacion;
            row.appendChild(calificacionCell);
            
            const opcionCell = document.createElement('td');
            const reservarButton = document.createElement('button');
            reservarButton.textContent = 'Reservar';
            reservarButton.addEventListener('click', () => reservar(recurso.kidrecurso));
            opcionCell.appendChild(reservarButton);
            row.appendChild(opcionCell);

            tableBody.appendChild(row);
        });

    })
    .catch(function (error){
        console.error("Error al obtener recursos: ", error)
    });
}

// Envia a la pagina de reservar recursos
function reservar(idRecurso) {
    window.location.href = `reservarRecurso.html?id=${idRecurso}`;
}

// Click en buscar
function buscar() {
    
    const inputText = document.getElementById('search-input');
    const input = inputText.value;
    inputText.value = '';
    if (input.trim() !== '') {
        opcion = 0;
        obtenerRecursos(input);
    }
}

function traerTodo() {
    opcion = 0;
    obtenerRecursos();
}
