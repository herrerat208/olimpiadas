CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'mecanico', 'recepcionista')),
  creado_en TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cliente (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(30),
  email VARCHAR(150),
  dni VARCHAR(20) UNIQUE
);

CREATE TABLE mecanico (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  especialidad VARCHAR(100),
  usuario_id INT REFERENCES usuario(id)
);

CREATE TABLE vehiculo (
  id SERIAL PRIMARY KEY,
  patente VARCHAR(15) UNIQUE NOT NULL,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  anio INT,
  cliente_id INT REFERENCES cliente(id) NOT NULL
);

CREATE TABLE orden_trabajo (
  id SERIAL PRIMARY KEY,
  vehiculo_id INT REFERENCES vehiculo(id) NOT NULL,
  mecanico_id INT REFERENCES mecanico(id),
  fecha_ingreso TIMESTAMP DEFAULT NOW(),
  fecha_estimada_entrega DATE,
  estado VARCHAR(20) NOT NULL DEFAULT 'recibido'
    CHECK (estado IN ('recibido', 'en_reparacion', 'listo', 'entregado')),
  descripcion_problema TEXT,
  total NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE repuesto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  stock INT DEFAULT 0,
  precio NUMERIC(10,2) NOT NULL,
  proveedor VARCHAR(100)
);

CREATE TABLE detalle_orden (
  id SERIAL PRIMARY KEY,
  orden_id INT REFERENCES orden_trabajo(id) NOT NULL,
  repuesto_id INT REFERENCES repuesto(id) NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL
);

CREATE TABLE turno (
  id SERIAL PRIMARY KEY,
  cliente_id INT REFERENCES cliente(id) NOT NULL,
  vehiculo_id INT REFERENCES vehiculo(id),
  fecha_hora TIMESTAMP NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'confirmado', 'cancelado'))
);