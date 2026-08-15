# ReservaUD — Sistema de Reserva de Recursos Universitarios

Aplicación web fullstack para la reserva de recursos de una universidad (laboratorios, aulas, tabletas, portátiles, video beams). Los usuarios pueden registrarse, iniciar sesión, consultar la disponibilidad de los recursos, realizar reservas por franjas horarias, cancelarlas y calificar el servicio.

---

## Tecnologías

### Backend

| Tecnología | Uso |
|------------|-----|
| Java 17 | Lenguaje principal |
| Spring Boot 3.2.5 | Framework |
| Spring Data JPA | Persistencia / ORM |
| Spring Security + JWT (jjwt 0.11.5) | Autenticación y autorización (roles `ROLE_USER` / `ROLE_ADMIN` persistidos en BD) |
| Flyway | Migraciones de base de datos versionadas |
| springdoc-openapi (Swagger) | Documentación interactiva de la API |
| MySQL | Base de datos |
| Lombok | Reducción de boilerplate |
| java-dotenv | Lectura de variables de entorno desde `.env` |
| Maven | Build y dependencias |

### Frontend

| Tecnología | Uso |
|------------|-----|
| HTML5 / CSS3 | Estructura y estilos |
| JavaScript (vanilla) | Lógica por página |
| Axios | Cliente HTTP |
| Font Awesome | Iconos |

---

## Funcionalidades

- Registro de usuarios con validación de datos (cédula, nombre, usuario, email, contraseña).
- Inicio de sesión con generación de token JWT (el rol del usuario viaja como *claim* del token).
- Roles: `/usuarios/**` y `/reservas/**` requieren `ROLE_USER`; `/admin/**` requiere `ROLE_ADMIN`.
- Consulta paginada de tipos de recurso y recursos (con orden por columna), incluyendo calificación promedio y características de cada recurso.
- Búsqueda y filtrado de recursos por tipo.
- Consulta de disponibilidad por fecha y franja horaria.
- Reserva de recursos (consume las franjas disponibles).
- Historial de reservas del usuario con su estado (`reservado`, `en progreso`, `finalizado`, `cancelado`).
- Cancelación de reservas (solo en estado `reservado`, con más de 2 horas de antelación y solo las propias).
- Calificación de reservas finalizadas (escala 1–5, solo las propias).
- Transición automática de estados mediante tarea programada (`@Scheduled` cada hora) y depuración de disponibilidades vencidas.
- Manejo centralizado de errores (`@RestControllerAdvice`) con respuestas JSON `{ message, status }`.
- Capa de DTOs: los controllers nunca exponen entidades JPA.
- Migraciones de esquema y datos de prueba automáticas con Flyway.
- Swagger UI en `/swagger-ui.html`.

---

## Estructura del proyecto

```
ReservaUD/
├── backend/                  # API REST (Spring Boot)
│   └── src/main/
│       ├── java/com/api/backend/
│       │   ├── config/           # CORS, beans de autenticación
│       │   ├── controller/       # Endpoints REST (solo DTOs)
│       │   ├── dto/              # Capa de DTOs
│       │   │   ├── request/      #   Body de las peticiones
│       │   │   └── response/     #   Respuestas de la API
│       │   ├── exception/        # Excepciones de negocio + @ControllerAdvice
│       │   ├── model/            # Entidades JPA
│       │   ├── repository/       # Repositorios Spring Data JPA
│       │   ├── security/         # Filtro JWT y configuración de seguridad
│       │   ├── service/          # Lógica de negocio
│       │   └── sheduled/         # Tareas programadas
│       └── resources/
│           ├── db/migration/     # Migraciones Flyway (V1, V2, V3)
│           └── application.properties
├── Base de Datos/            # Scripts SQL manuales (fallback)
│   ├── BaseDatos.sql
│   └── Datos de prueba.sql
├── frontend/                 # Frontend (HTML/CSS/JS)
│   ├── index.html            # Login / registro
│   ├── homeUser.html         # Dashboard de tipos de recurso
│   ├── recursos.html         # Listado y búsqueda de recursos
│   ├── reservarRecurso.html  # Formulario de reserva
│   ├── micuenta.html         # Perfil e historial de reservas
│   ├── calificar.html        # Formulario de calificación
│   ├── estilos/              # Hojas de estilo
│   └── script/               # Lógica JavaScript por página
└── postman/                  # Colección Postman para probar la API
```

---

## Base de datos

Base de datos MySQL. El esquema y los datos se aplican automáticamente con **Flyway** al arrancar el backend (`backend/src/main/resources/db/migration/`):

| Migración | Contenido |
|-----------|-----------|
| `V1__schema_inicial.sql` | Esquema inicial (8 tablas) |
| `V2__agregar_role_usuario.sql` | Columna `n_role` en `usuario` |
| `V3__seed_data.sql` | Datos de prueba con fechas relativas a `CURDATE()` |

Tablas:

| Tabla | Descripción |
|-------|-------------|
| `usuario` | Usuarios del sistema con rol (`ROLE_USER` / `ROLE_ADMIN`) |
| `tipo_de_recurso` | Categorías de recurso (laboratorio, aula, tablet, etc.) |
| `recurso` | Recursos concretos disponibles |
| `caracteristicas` | Catálogo de características |
| `ser_caracterisado` | Relación recurso ↔ característica |
| `disponibilidad` | Franjas horarias disponibles |
| `poseer` | Relación recurso ↔ disponibilidad |
| `reserva` | Reservas realizadas por los usuarios |

> Los scripts `Base de Datos/BaseDatos.sql` y `Base de Datos/Datos de prueba.sql` se mantienen como **fallback manual**; la fuente de verdad es Flyway.

---

## API REST

Formato de error uniforme (400/403/404): `{ "message": "...", "status": <código> }`.

Los endpoints de listado (`GET /recursos`, `GET /tipos`) son **paginados**: `?page=0&size=5&sort=nombre,asc` (los campos de orden usan nombres del DTO).

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login-user` | Iniciar sesión y obtener token JWT | No |
| `POST` | `/auth/register` | Registrar un nuevo usuario | No |
| `GET` | `/recursos` | Listar recursos (paginado), con calificación y características | Bearer |
| `GET` | `/recursos/{id}` | Obtener un recurso | Bearer |
| `GET` | `/recursos/tipo/{id}` | Listar recursos por tipo | Bearer |
| `POST` | `/recursos/disponibilidad` | Consultar disponibilidad de un recurso | Bearer |
| `GET` | `/tipos` | Listar tipos de recurso (paginado) | Bearer |
| `GET` | `/tipos/{id}` | Obtener un tipo de recurso | Bearer |
| `GET` | `/usuarios/{id}` | Obtener el usuario autenticado y su historial (solo el propio) | USER |
| `POST` | `/reservas` | Reservar un recurso | USER |
| `PATCH` | `/reservas/{id}/cancelar` | Cancelar una reserva propia | USER |
| `PATCH` | `/reservas/{id}/calificar` | Calificar una reserva propia finalizada | USER |

Documentación Swagger: `http://localhost:8080/swagger-ui.html` (spec en `/v3/api-docs`).

### Ejemplo de respuesta de `GET /recursos`

```json
{
  "content": [
    {
      "id": 1,
      "nombre": "Laboratorio 501",
      "descripcion": "Laboratorio de fisica",
      "idTipoRecurso": 1,
      "nombreTipoRecurso": "Laboratorio",
      "calificacionPromedio": 0.0,
      "caracteristicas": ["Tiene aire acondicionado", "Tiene video beam"]
    }
  ],
  "totalElements": 8,
  "totalPages": 2,
  ...
}
```

---

## Requisitos previos

- **JDK 17** o superior
- **Maven** (o usar el wrapper `./mvnw`)
- **MySQL 8** corriendo en `localhost:3306`
- **Node.js** (opcional, para servir el frontend con Live Server)

---

## Cómo ejecutar el proyecto

### 1. Base de datos

Crear la base de datos (Flyway crea las tablas y los datos de prueba al arrancar):

```sql
CREATE DATABASE reservasUD;
```

### 2. Variables de entorno

Copiar `backend/.env.example` a `backend/.env` y ajustar las credenciales:

```env
DB_URL=jdbc:mysql://localhost:3306/reservasUD
DB_USERNAME=root
DB_PASSWORD=tu_password
JWT_SECRET=genera_un_secreto_base64_de_al_menos_256_bits
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

`CORS_ORIGINS` debe incluir el origen donde se sirve el frontend.

### 3. Backend

```bash
cd backend
./mvnw spring-boot:run
```

Al arrancar, Flyway aplica las migraciones (`V1` → `V2` → `V3`). La API queda en `http://localhost:8080`.

> Si ya existía una BD con datos previos sin historial de Flyway, bórrala y vuelve a crearla para una instalación limpia:
> `DROP DATABASE reservasUD; CREATE DATABASE reservasUD;`

### 4. Frontend

El frontend es estático; se sirve con un servidor local (por ejemplo, la extensión **Live Server** de VS Code):

```bash
cd frontend
npx live-server --port=5501
```

Abrir `http://127.0.0.1:5501`. El origen usado debe estar incluido en `CORS_ORIGINS`.

---

## Pruebas con Postman

La colección `postman/ReservaUD.postman_collection.json` incluye pruebas de todos los endpoints, casos de éxito y de error (400, 401, 403, 404).

Flujo sugerido:
1. **Importar** la colección en Postman (File → Import).
2. Ejecutar **"1. Login usuario"** (`user` / `123456`) — guarda automáticamente `{{token}}` y `{{userId}}`.
3. Consultar disponibilidad y crear reservas (la variable `{{fecha}}` se calcula como "mañana" automáticamente; el seed deja el recurso 1 a las 14:00 disponible).
4. **"9. Obtener usuario"** captura `{{reservaCancelarId}}` y `{{reservaCalificarId}}` para cancelar/calificar.

Usuarios sembrados por `V3__seed_data.sql`: `admin` / `123456` (ROLE_ADMIN) y `user` / `123456` (ROLE_USER).

---

## Roadmap / mejoras pendientes

- Migración del frontend de JavaScript vanilla a **React + TypeScript**.
- Cobertura de tests unitarios y de integración.
- Dockerización del stack completo (backend + frontend + MySQL).
- Endpoints de administración de recursos y tipos.
