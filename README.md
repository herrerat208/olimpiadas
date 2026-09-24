# Gestor de taller mecánico

Sistema web desarrollado para la Olimpiada Institucional de Programación de 7.º año de la EEST N.º 6 "Chacabuco", Morón, Buenos Aires.

Permite autenticar usuarios y administrar clientes y vehículos de un taller mecánico. El proyecto está organizado como una aplicación full stack con backend REST, frontend React y PostgreSQL.

## Estado del proyecto

- Autenticación con JWT y contraseñas protegidas con bcrypt.
- Roles de usuario: `admin`, `mecanico` y `recepcionista`.
- CRUD protegido de clientes.
- CRUD protegido de vehículos relacionados con clientes.
- Integración con OpenStreetMap/Nominatim para geocodificación de direcciones.
- Integración con WhatsApp (`wa.me`) para notificar clientes.
- PostgreSQL inicializado mediante `schema.sql`.
- Tests de backend con Jest y Supertest.
- Docker y Docker Compose para backend, frontend y base de datos.
- Pipeline de CI/CD con GitHub Actions.

Las tablas de órdenes de trabajo, repuestos y turnos ya están definidas en el esquema, pero sus endpoints todavía no están implementados.

## Arquitectura

```mermaid
flowchart LR
    Browser[ navegador ] --> Frontend[React + Vite]
    Frontend -->|Axios + JWT| Backend[Node.js + Express + TypeScript]
    Backend --> Database[(PostgreSQL)]
    Backend --> Nominatim[OpenStreetMap Nominatim]
    Backend --> WhatsApp[WhatsApp - wa.me]
```

### Componentes

- **Frontend:** React, Vite, TypeScript, React Router y Axios.
- **Backend:** Node.js, Express y TypeScript, ejecutado con `tsx`.
- **Base de datos:** PostgreSQL 16.
- **Autenticación:** JWT (`jsonwebtoken`) y bcrypt.
- **Testing:** Jest y Supertest.
- **Infraestructura:** Docker y Docker Compose.
- **CI/CD:** GitHub Actions.

## Estructura

```text
.
├── .github/workflows/ci.yml
├── docker-compose.yml
├── olimpiadas-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   └── routes/
│   ├── tests/
│   ├── schema.sql
│   └── Dockerfile
└── olimpiadas-frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── Dockerfile
```

## Requisitos

- Node.js 20 o superior.
- npm.
- PostgreSQL 16, si se ejecuta sin Docker.
- Docker Desktop, si se utiliza Docker Compose.

## Ejecución local

### Backend

```powershell
cd olimpiadas-backend
npm install
```

Crear un archivo `.env` dentro de `olimpiadas-backend`:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASS=tu_contraseña
DB_NAME=taller_mecanico
DB_PORT=5432
JWT_SECRET=una_clave_secreta_segura
PORT=3000
```

Inicializar la base de datos ejecutando [schema.sql](./olimpiadas-backend/schema.sql) y arrancar el servidor:

```powershell
npm run dev
```

El backend queda disponible en `http://localhost:3000`.

### Frontend

```powershell
cd olimpiadas-frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:5173`.

## Ejecución con Docker

Desde la raíz del proyecto:

```powershell
docker compose up --build
```

Servicios publicados:

| Servicio | URL o puerto |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |
| Healthcheck backend | http://localhost:3000/health |
| PostgreSQL | localhost:5432 |

Al primer arranque, el contenedor de PostgreSQL ejecuta automáticamente `schema.sql` y crea las tablas.

Para detener los servicios:

```powershell
docker compose down
```

Para eliminar también los datos persistidos de PostgreSQL:

```powershell
docker compose down -v
```

## API

Todas las rutas de clientes, vehículos, geocodificación y WhatsApp requieren un token JWT en el header:

```http
Authorization: Bearer <token>
```

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Iniciar sesión y obtener JWT |

Ejemplo de login:

```json
{
  "email": "usuario@taller.com",
  "password": "contraseña"
}
```

### Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/clientes` | Listar clientes |
| `GET` | `/clientes/:id` | Obtener un cliente |
| `POST` | `/clientes` | Crear cliente |
| `PUT` | `/clientes/:id` | Actualizar cliente |
| `DELETE` | `/clientes/:id` | Eliminar cliente |

Campos principales: `nombre`, `apellido`, `telefono`, `email` y `dni`.

### Vehículos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/vehiculos` | Listar vehículos con datos del cliente |
| `GET` | `/vehiculos/:id` | Obtener un vehículo |
| `POST` | `/vehiculos` | Crear vehículo |
| `PUT` | `/vehiculos/:id` | Actualizar vehículo |
| `DELETE` | `/vehiculos/:id` | Eliminar vehículo |

Campos principales: `patente`, `marca`, `modelo`, `anio` y `cliente_id`.

### Geocodificación

Integra [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) para convertir una dirección en coordenadas.

```http
GET /geocoding/search?address=Avenida%20Rivadavia%2012000%2C%20Morón
Authorization: Bearer <token>
```

Respuesta:

```json
{
  "latitud": -34.65,
  "longitud": -58.62,
  "displayName": "Morón, Buenos Aires, Argentina",
  "mapaUrl": "https://www.openstreetmap.org/?mlat=-34.65&mlon=-58.62"
}
```

La consulta tiene un timeout de ocho segundos, informa errores del servicio externo y devuelve como máximo un resultado. Se utiliza desde la sección de Clientes, con un mapa embebido de OpenStreetMap.

### WhatsApp

Genera un enlace de contacto directo por WhatsApp (`wa.me`) para notificar a un cliente.

```http
POST /whatsapp/generar-link
Authorization: Bearer <token>
Content-Type: application/json

{
  "telefono": "1122334455",
  "mensaje": "Hola Juan, tu vehículo ya está listo."
}
```

Respuesta:

```json
{
  "link": "https://wa.me/541122334455?text=Hola%20Juan..."
}
```

Se usa desde la sección de Clientes, con el botón "WhatsApp" en cada fila de la tabla.

### Salud del servicio

```http
GET /health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "db": "connected"
}
```

## Base de datos

El esquema (`schema.sql`) contiene las siguientes tablas:

```text
usuario
cliente
mecanico
vehiculo
orden_trabajo
repuesto
detalle_orden
turno
```

Las tablas de órdenes de trabajo, repuestos y turnos quedan preparadas para una futura ampliación del sistema, pero todavía no tienen endpoints implementados.

## Tests

Backend (Jest + Supertest, requiere PostgreSQL corriendo):

```powershell
cd olimpiadas-backend
npm test
```

Los tests cubren:
- Registro y login de usuarios.
- Rechazo de login con credenciales incorrectas.
- Acceso denegado a rutas protegidas sin token.
- CRUD de clientes con autenticación.

## CI/CD

El pipeline de [GitHub Actions](./.github/workflows/ci.yml) se ejecuta en cada `push` a `main` y en cada pull request. Pasos:

1. Levanta un contenedor temporal de PostgreSQL.
2. Instala las dependencias del backend.
3. Crea las tablas ejecutando `schema.sql`.
4. Corre los tests automatizados.
5. Si los tests pasan, construye las imágenes Docker de backend y frontend.

## Seguridad y configuración

- No subir archivos `.env` al repositorio (ya excluido en `.gitignore`).
- Usar un `JWT_SECRET` diferente y seguro en cada entorno.
- No utilizar contraseñas reales en ejemplos o documentación.
- En producción, configurar credenciales mediante secretos del entorno o del proveedor de despliegue.

## Autor

Proyecto desarrollado por Tomás Herrera, Lara Leguizamón y Demián Iglesias.