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
            if(response.data=='reserva ya calificada'){
                alert(`Reserva ya calificada`)
            }
            if(response.data=='valor invalido'){
                alert(`Valor invalido`)
            }
            if(response.data=='reserva no ha finalizado'){
                alert(`Reserva no ha finalizado`)
            }
            if(response.data=='reserva no existe'){
                alert(`Reserva no existe`)
            }
            window.location.href = "micuenta.html";
        
        })
        .catch(function (error) {
            console.error("Error en la petición: ", error);
        });
    
    
})

function recuperarId() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id;
}