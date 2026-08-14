const api = axios.create({
    baseURL: 'http://localhost:8080'
});

const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const idRecurso = recuperarId();
let horaI;
let horaF;
let dia;
let flag = false;

document.addEventListener('DOMContentLoaded', function() {
    obtenerRecurso();
});

// Traer y mostrar info basica del recurso
function obtenerRecurso() {
    
    api.get(`/recursos/${idRecurso}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function (response){
        const recurso = response.data;

        const titulo = document.getElementById('nombreProducto');
        titulo.textContent = `${recurso.nnombrerecurso}`;

        const info = document.getElementById('descripcionProducto');
        info.textContent = `${recurso.ndescripcionrecurso}`;
    })
    .catch(function (error){
        console.error("Error al obtener datos basicos del recurso: ", error)
    });
}

// Consultar disponibilidad del recurso
function consultarDisponibilidad(horaInicio, diaDisponibilidad, fechaInput, horaFinal) {
    const data = {
        diaDisponibilidad: diaDisponibilidad,
        horaInicio: horaInicio,
        horaFinal: horaFinal,
        idRecurso: idRecurso
    };

    api.post('/user/disponibilidad', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function (response){
        const disp = response.data;
        console.log('Disponibilidad:', disp);

        if (disp) {
            flag = true;
            horaI = horaInicio;
            horaF = horaFinal;
            dia = diaDisponibilidad;
            alert(`Recurso disponible para reservar.\n\nFecha: ${fechaInput}\nHora: ${horaI} - ${horaF}`);
        } else {
            alert('Recurso no disponible en este horario, por favor seleccionar otro');
        }
    })
    .catch(function (error){
        console.error("Error: ", error);
    });
}

// Realizar reserva del recurso
function reservarRecurso() {
    const data = {
        horaInicio: horaI,
        horaFinal: horaF,
        dia: dia,
        idUsuario: userId,
        idRecurso: idRecurso
    };

    api.post('/user/reservar', data, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(function (response){
        const estado = response.data;
        console.log('horaInicio:', horaI);
        console.log('horaFinal:', horaF);
        console.log('Dia:', dia);
        console.log('idUser:', userId);
        console.log('idRecurso:', idRecurso);
        console.log('Estado Reserva:', estado);
        console.log(response);
        if(estado) {
            alert('Reserva exitosa');
            window.location.href = "micuenta.html";
        } else {
            alert('No se pudo realizar la reserva');
        }
        flag = false;
    })
    .catch(function (error){
        console.error("Error al realizar la reserva: ", error);
    });
}

// Mostrar horarios según el dia
document.getElementById('fecha').addEventListener('change', function() {
    const fechaInput = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('horaInicio');

    if (fechaInput) {
        const fecha = new Date(fechaInput);
        const diaSemana = fecha.getUTCDay();
        flag = false;
        let horarios = [];

        if (diaSemana >= 1 && diaSemana <= 6) {
            // Lunes a viernes, 6am - 8pm
            for (let i = 6; i < 20; i += 1) {
                horarios.push(`${i}:00`);
            }
        } else {
            // Domingo
            horarios.push('No disponible');
        }

        // Limpiar opciones previas
        horaInicio.innerHTML = '<option value="">Seleccionar horario</option>';

        if (horarios.length > 0) {
            horarios.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                horaInicio.appendChild(option);
            });
            horaInicio.disabled = false;
        } else {
            horaInicio.disabled = true;
        }
    } else {
        horaInicio.innerHTML = '<option value="">Seleccionar horario</option>';
        horaInicio.disabled = true;
    }

    
});


document.getElementById('horaInicio').addEventListener('change', function() {
    flag = false;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFinal = document.getElementById('horaFinal');

    if(horaInicio){
        let horarios = [];
        const partes = horaInicio.split(":")

        for (let i = Number(partes[0])+1; i < 21; i += 1) {
            horarios.push(`${i}:00`);
        }
        horaFinal.innerHTML = '<option value="">Seleccionar horario</option>';

        if (horarios.length > 0) {
            horarios.forEach(horario => {
                const option = document.createElement('option');
                option.value = horario;
                option.textContent = horario;
                horaFinal.appendChild(option);
            });
            horaFinal.disabled = false;
        } else {
            horaFinal.disabled = true;
        }
    }else{
        horaFinal.innerHTML = '<option value="">Seleccionar horario</option>';
        horaFinal.disabled = true;
    }

    

});

document.getElementById('horaFinal').addEventListener('change', function(){
    flag = false;
})

// Click en consultar
document.getElementById('consultar').addEventListener('click', function() {
    const fechaInput = document.getElementById('fecha').value;
    let horaInicio = document.getElementById('horaInicio').value;
    let horaFinal = document.getElementById('horaFinal').value;

    if (!(fechaInput && horaInicio && horaFinal)) {
        alert('Por favor, seleccione una fecha y un horario.');
        return;
    }

    horaInicio  += ":00";
    horaFinal += ":00";

    const fecha = new Date(fechaInput);
    const diaSiguiente = new Date(fecha);
    diaSiguiente.setDate(fecha.getDate() + 1);
    
    // Convertir el objeto Date a string en formato "YYYY-MM-DD"
    const diaConsulta = diaSiguiente.toISOString().split('T')[0];
    
    consultarDisponibilidad(horaInicio, diaConsulta, fechaInput, horaFinal);
});

// Click en reservar
document.getElementById('reservar').addEventListener('click', function() {
    if (!(flag)) {
        alert('Por favor, verifique si el recurso está disponibile para reservar.');
        return;
    }
    const fechaInput = document.getElementById('fecha').value;
    const accept = confirm(`Seguro que desea reservar este recurso en el siguiente horario?\n\nFecha: ${fechaInput}\nHora: ${horaI} - ${horaF}`);
    if (accept) {
        reservarRecurso();
    }
});

// Recuperar id del recurso
function recuperarId() {
    document.getElementById('fecha').value = "";

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id;
}
