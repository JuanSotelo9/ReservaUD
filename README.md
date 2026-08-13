# PrestamosUD — Sistema de Reserva de Recursos Universitarios

Aplicación web fullstack para la reserva de recursos de una universidad (laboratorios, aulas, tabletas, portátiles, video beams). Los usuarios pueden registrarse, iniciar sesión, consultar la disponibilidad de los recursos, realizar reservas por franjas horarias, cancelarlas y calificar el servicio.

> **Nota:** este es un proyecto académico en evolución. Actualmente se encuentra en proceso de refactorización hacia una arquitectura más profesional.

---

## Tecnologías

### Backend

| Tecnología | Uso |
|------------|-----|
| Java 17 | Lenguaje principal |
| Spring Boot 3.2.5 | Framework |
| Spring Data JPA | Persistencia / ORM |
| Spring Security + JWT (jjwt 0.11.5) | Autenticación y autorización |
| MySQL | Base de datos |
| Lombok | Reducción de boilerplate |
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
- Inicio de sesión con generación de token JWT.
- Consulta de tipos de recurso y recursos disponibles, con calificación promedio.
- Búsqueda y filtrado de recursos por tipo.
- Consulta de disponibilidad por fecha y franja horaria.
- Reserva de recursos (consume las franjas disponibles).
- Historial de reservas del usuario con su estado (`reservado`, `en progreso`, `finalizado`, `cancelado`).
- Cancelación de reservas (solo en estado `reservado` y con más de 2 horas de antelación).
- Calificación de reservas finalizadas (escala 1–5).
- Transición automática de estados mediante tarea programada (`@Scheduled` cada hora).
- Depuración automática de disponibilidades vencidas.

---

## Estructura del proyecto

```
Projecto-FIS/
├── backend/                  # API REST (Spring Boot)
│   └── src/main/java/com/api/backend/
│       ├── config/           # Security, CORS, beans de autenticación
│       ├── controller/       # Endpoints REST
│       ├── model/            # Entidades JPA y DTOs de request/response
│       ├── repository/       # Repositorios Spring Data JPA
│       ├── security/         # Filtro JWT y configuración de seguridad
│       ├── service/          # Lógica de negocio
│       └── shedule/          # Tareas programadas
├── Base de Datos/            # Scripts SQL (schema y datos de prueba)
│   ├── BaseDatos.sql
│   └── Datos de prueba.sql
└── Intento frond/            # Frontend (HTML/CSS/JS)
    ├── index.html            # Login / registro
    ├── homeUser.html         # Dashboard de tipos de recurso
    ├── recursos.html         # Listado y búsqueda de recursos
    ├── reservarRecurso.html  # Formulario de reserva
    ├── micuenta.html         # Perfil e historial de reservas
    ├── calificar.html        # Formulario de calificación
    ├── estilos/              # Hojas de estilo
    └── script/               # Lógica JavaScript por página
```

---

## Base de datos

Base de datos MySQL (`projectfis`), con las siguientes tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `usuario` | Usuarios del sistema (cliente o administrador) |
| `tipo_de_recurso` | Categorías de recurso (laboratorio, aula, tablet, etc.) |
| `recurso` | Recursos concretos disponibles |
| `disponibilidad` | Franjas horarias disponibles |
| `poseer` | Relación recurso ↔ disponibilidad |
| `reserva` | Reservas realizadas por los usuarios |

El esquema completo se encuentra en `Base de Datos/BaseDatos.sql` y los datos de prueba en `Base de Datos/Datos de prueba.sql`.

---

## API REST

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/login-user` | Iniciar sesión y obtener token JWT | No |
| `POST` | `/auth/register` | Registrar un nuevo usuario | No |
| `GET` | `/tipos` | Listar tipos de recurso | No |
| `GET` | `/tipos/{id}` | Obtener un tipo de recurso | No |
| `GET` | `/recursos` | Listar recursos con calificación promedio | No |
| `GET` | `/recursos/{id}` | Obtener un recurso | No |
| `GET` | `/recursos/tipo/{id}` | Listar recursos por tipo | No |
| `GET` | `/user/{id}` | Obtener usuario y su historial de reservas | USER |
| `POST` | `/user/disponibilidad` | Consultar disponibilidad de un recurso | USER |
| `POST` | `/user/reservar` | Reservar un recurso | USER |
| `GET` | `/user/cancelar/{id}` | Cancelar una reserva | USER |
| `POST` | `/user/calificar` | Calificar una reserva finalizada | USER |

---

## Requisitos previos

- **JDK 17** o superior
- **Maven** (o usar el wrapper `./mvnw`)
- **MySQL 8** corriendo en `localhost:3306`
- **Node.js** (solo para la extensión Live Server del frontend)

---

## Cómo ejecutar el proyecto

### 1. Base de datos

Crear la base de datos y cargar el esquema y los datos:

```sql
CREATE DATABASE projectfis;

-- Ejecutar en orden:
-- Base de Datos/BaseDatos.sql
-- Base de Datos/Datos de prueba.sql
```

Las credenciales por defecto de la base de datos son `root` / `1234` (configurables en `backend/src/main/resources/application.properties`).

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

### 3. Frontend

El frontend es estático y se sirve con un servidor local (por ejemplo, la extensión **Live Server** de VS Code), apuntando al puerto `5501`:

```bash
cd "Intento frond"
npx live-server --port=5501
```

Abrir `http://127.0.0.1:5501` en el navegador.

> El CORS del backend está configurado para permitir `http://127.0.0.1:5501`.

---

## Roadmap / mejoras pendientes

El proyecto se encuentra en proceso de mejora. Algunas áreas de trabajo identificadas:

- Migración del frontend de JavaScript vanilla a **React + TypeScript**.
- Separación de entidades JPA y DTOs.
- Manejo de errores centralizado con `@ControllerAdvice`.
- Persistencia del rol de usuario en la base de datos (actualmente se asigna en tiempo de ejecución).
- Migraciones de base de datos versionadas (Flyway/Liquibase).
- Cobertura de tests unitarios y de integración.
- Dockerización del stack completo.

