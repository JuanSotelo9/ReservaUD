const api = axios.create({
    baseURL: 'http://localhost:8080'
})

const token = localStorage.getItem('token');

api.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
});   

const selectElement = document.getElementById('select2');
const idreservaparaenviar = recuperarId();

document.querySelector('.botondecalificar').addEventListener('click', function (e) {
    const calificacionapi = selectElement.value;

    const data = {
        idReserva: idreservaparaenviar,
        calificacion: calificacionapi
    };

    api.post(`/user/calificar`, data)
        .then(function (response){
            if(response.data=='calificado'){
                alert(`Recurso calificado correctamente`)
            }
            window.location.href = "micuenta.html";
        
        })
        .catch(function (error) {
            const msg = (error.response && error.response.data) ? error.response.data.message : 'error';
            if(msg=='reserva ya calificada'){
                alert(`Reserva ya calificada`)
            }
            else if(msg=='valor invalido'){
                alert(`Valor invalido`)
            }
            else if(msg=='reserva no ha finalizado'){
                alert(`Reserva no ha finalizado`)
            }
            else if(msg=='reserva no existe'){
                alert(`Reserva no existe`)
            }
            else if(msg=='no autorizado'){
                alert(`No autorizado`)
            }
            else {
                alert(`No se pudo calificar la reserva`)
            }
            window.location.href = "micuenta.html";
        });
    
    
})

function recuperarId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id;
}