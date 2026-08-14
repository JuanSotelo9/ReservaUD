const api = axios.create({
    baseURL: 'http://localhost:8080'
})

function mover() {
    document.getElementById('btnInicioSesion').style.opacity = '0';

    // Agregar la clase de animación al contenedor
    document.querySelector('.derecha').classList.add('anima-desplazar');
    document.getElementById('btnInicioSesion').classList.add('anima-desplazar');

    setTimeout(function() {
        // Mostrar los botones "Iniciar sesión" y "Registrarse"
        document.getElementById('Iniciar').style.opacity = '1';
        document.getElementById('Registrar').style.opacity = '1';
        document.getElementById('MisionVision').style.opacity = '1';
        document.getElementById('regresar').style.opacity = '1';
        document.getElementById('Iniciar').style.pointerEvents = 'auto';
        document.getElementById('Registrar').style.pointerEvents = 'auto';
        document.getElementById('regresar').style.pointerEvents = 'auto';
    }, 2000);
}
document.getElementById('btnInicioSesion').addEventListener('click', mover);


// Acion de los botones registrar e iniciar sesión
function intentoiniciar() {
    window.location.href = '#modal2';
}
document.getElementById('Iniciar').addEventListener('click', intentoiniciar);

function intentoregistrar() {
    window.location.href = '#modal';
}
document.getElementById('Registrar').addEventListener('click', intentoregistrar);

function intentoregresar() {
    window.location.href = 'index.html';
}
document.getElementById('regresar').addEventListener('click', intentoregresar);

// Animacion de cambio de texto
window.onload = function() {
    var missionText = "<strong>Misión:</strong> <br> La Universidad Distrital Francisco José de Caldas es un espacio social y una organización institucional, ente autónomo del orden distrital, que tiene entre sus finalidades la formación de profesionales especializados y de ciudadanos activos; la producción y reproducción del conocimiento científico, además de la innovación tecnológica y la creación artística. Impulsa el diálogo de saberes y promueve una pedagogía, capaz de animar la reflexión y la curiosidad de los estudiantes; además, fomenta un espíritu crítico en la búsqueda de verdades abiertas; en la promoción de la ciencia y la creación; asimismo, de la ciudadanía y la democracia; y alienta la deliberación, fundada en la argumentación y en el diálogo razonado.";
    var visionText = "<strong>Visión:</strong> <br> Para el 2030 la Universidad Distrital Francisco José de Caldas será reconocida, nacional e internacionalmente, como una institución de alta calidad en la formación de ciudadanos responsables y profesionales del mejor nivel, en la producción de conocimiento científico, artístico y de innovación tecnológica; propósitos que desplegará en los campos de la docencia, la investigación y la extensión.";
    var container = document.getElementById("ContenedorPoliticadecalidad");
    var isMission = true;
    setInterval(function() {
        if (isMission) {
            container.innerHTML = "<div id='Politicadecalidad' class='Politicadecalidad'>" + visionText + "</div>";
            isMission = false;
        } else {
            container.innerHTML = "<div id='Politicadecalidad' class='Politicadecalidad'>" + missionText + "</div>";
            isMission = true;
        }
    }, 120000);
};

document.querySelector('.modal_close').addEventListener('click', function (e) {
    e.preventDefault();

    // Obtener los valores de los campos del formulario de registro
    const cedula = document.querySelector("input[name='Cedula']").value.trim();
    const nombre = document.querySelector("input[name='nombres']").value.trim();
    const apellidos = document.querySelector("input[name='Apellidos']").value.trim();
    const usuario = document.querySelector("input[name='Usuario']").value.trim();
    const email = document.querySelector("input[name='email']").value.trim();
    const contrasena = document.querySelector("input[name='Contraseña']").value.trim();

    // Limpiar mensajes de error anteriores
    document.getElementById('cedula-error').textContent = '';
    document.getElementById('nombres-error').textContent = '';
    document.getElementById('apellidos-error').textContent = '';
    document.getElementById('usuario-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('contrasena-error').textContent = '';

    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function validarContrasena(contrasena) {
        const tieneMayuscula = /[A-Z]/.test(contrasena);
        const tieneSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena);
        const longitudValida = contrasena.length >= 6;
        return tieneMayuscula && tieneSimbolo && longitudValida;
    }

    function validarSoloNumeros(cedula) {
        const re = /^[0-9]+$/;
        return re.test(cedula);
    }
    
    let valid = true;
    if (!cedula) {
        document.getElementById('cedula-error').textContent = 'La cédula es requerida.';
        valid = false;
    } else if (!validarSoloNumeros(cedula)) {
        document.getElementById('cedula-error').textContent = 'La cédula solo debe contener números.';
        valid = false;
    }
    if (!nombre) {
        document.getElementById('nombres-error').textContent = 'El nombre es requerido.';
        valid = false;
    }
    if (!apellidos) {
        document.getElementById('apellidos-error').textContent = 'El apellido es requerido.';
        valid = false;
    }
    if (!usuario) {
        document.getElementById('usuario-error').textContent = 'El usuario es requerido.';
        valid = false;
    }
    if (!email) {
        document.getElementById('email-error').textContent = 'El email es requerido.';
        valid = false;
    } else if (!validarEmail(email)) {
        document.getElementById('email-error').textContent = 'Por favor, ingrese un correo electrónico válido.';
        valid = false;
    }
    if (!contrasena) {
        document.getElementById('contrasena-error').textContent = 'La contraseña es requerida.';
        valid = false;
    } else if (!validarContrasena(contrasena)) {
        document.getElementById('contrasena-error').textContent = 'La contraseña debe tener al menos 6 caracteres, un símbolo y una letra mayúscula.';
        valid = false;
    }
    if (!valid) {
        return;
    }

    // Crear el objeto de datos para enviar al back-end
    const data = {
        id: cedula,
        nombre: nombre,
        apellido: apellidos,
        usuario: usuario,
        email: email,
        password: contrasena
    };

    var x1;
    // Enviar datos al back-end usando Axios
    api.post('/auth/register', data)
        .then(function (response) {
            x1 = response.data.response;
            const successMessage = document.getElementById('registration-success-message');
            successMessage.style.display = 'block';
            if(x1=='id ya registrado'){
                successMessage.textContent = 'Cedula ya registrada.';
                successMessage.style.color = 'red';
            }
            if(x1=='usuario ya registrado'){
                successMessage.textContent = 'Usuario ya registrado.';
                successMessage.style.color = 'red';
            }
            if(x1=='correo ya registrado'){
                successMessage.textContent = 'Correo ya registrado.';
                successMessage.style.color = 'red';
            }
            if (x1 == "Success") {
                successMessage.textContent = 'Registro exitoso.';
                successMessage.style.color = 'green';
            } else if (x1 == "Error") {
                successMessage.textContent = 'Registro fallido.';
                successMessage.style.color = 'red';
            }

            // Limpiar los campos del formulario (opcional)
            document.querySelector("input[name='Cedula']").value = '';
            document.querySelector("input[name='nombres']").value = '';
            document.querySelector("input[name='Apellidos']").value = '';
            document.querySelector("input[name='Usuario']").value = '';
            document.querySelector("input[name='email']").value = '';
            document.querySelector("input[name='Contraseña']").value = '';
        })
        .catch(function (error) {
            console.error("Error en la petición: ", error);
        });
});


document.querySelector('.modal_close2').addEventListener('click', function (e) {
    e.preventDefault();

    // Obtener los valores del formulario de inicio de sesión
    const usuario = document.querySelector(".form-register2 input[name='Usuario']").value;
    const contrasena = document.querySelector(".form-register2 input[name='Contraseña']").value;

    const data = {
        usuario: usuario,
        password: contrasena
    };

    let token
    var x2;
    var x3=0;
    api.post('/auth/login-user', data)
        .then(function (response){
            x2=response.data.response
            x3=response.data.id 
            token = response.data.response;

            if(x3!=null){
                localStorage.setItem('userId', x3);
                localStorage.setItem('token', token);
                window.location.href = 'homeUser.html';
            }

            if(x2=="Datos Incorrectos"){
                const successMessage2 = document.getElementById('login-success-message');
                successMessage2.style.display = 'block';
                successMessage2.textContent = 'Usuario o contraseña incorrectos';
            }
        })
        .catch(function (error){
            console.error("Error en la peticion: ", error)
        });

    // api.interceptors.request.use(config => {
    //     config.headers.Authorization = `Bearer ${token}`;
    //     return config;
    // }, error => {
    //     return Promise.reject(error);
    // });   
});
