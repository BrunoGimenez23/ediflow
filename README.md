Ediflow


Ediflow es una plataforma web para la administración de edificios y consorcios, que integra gestión de residentes, apartamentos, pagos, reservas de áreas comunes y proveedores mediante un marketplace. Soporta multiusuario y pagos online con Mercado Pago.

Tabla de Contenidos

Características

Tecnologías

Instalación

Estructura del Proyecto

Funcionalidades

Roles y Permisos

Flujos Principales

Contribución

Licencia

Características

Gestión completa de edificios, apartamentos y residentes

Creación y administración de pagos de expensas

Pagos online mediante Mercado Pago para residentes y proveedores

Reservas de áreas comunes

Gestión de portería y control de acceso

Soporte multiusuario para administradores (Plan Premium Plus)

Dashboard moderno con filtros, paginación y permisos dinámicos

Tecnologías

Frontend: React, Vite, Tailwind CSS, React Router, Axios
Backend: Java 17, Spring Boot, Spring Security, JWT, MySQL
Despliegue: Frontend en Vercel, Backend en Railway o servidor compatible

Instalación
Backend
git clone https://github.com/BrunoGimenez23/ediflow.git
cd ediflow/backend
# Configurar base de datos en application.properties
./mvnw spring-boot:run

Frontend
cd ../frontend/ediflow-frontend
npm install
npm run dev

Estructura del Proyecto
ediflow/
├─ backend/               # Backend Spring Boot
├─ frontend/              # Frontend React + Tailwind
├─ README.md
└─ ...

Funcionalidades
1. Autenticación y Usuarios

Registro y login (Admin, Residente)

Roles: ADMIN, RESIDENT, EMPLOYEE, SUPPORT

Prueba gratuita de 14 días para administradores

Control de permisos según rol y plan

2. Gestión de Edificios y Apartamentos

CRUD de edificios y apartamentos

Asignación y reasignación de residentes

Listados con filtros y paginación

3. Gestión de Residentes

CRUD de residentes

Historial de pagos y reservas

Filtros avanzados

4. Pagos de Expensas

Crear, modificar y eliminar pagos

Filtros por estado, edificio y fechas

Integración con Mercado Pago

Actualización automática del estado del pago

5. Marketplace y Pagos a Proveedores

CRUD de proveedores

Pagos online con Mercado Pago

Historial de pagos

Control de errores y validaciones

6. Reservas de Áreas Comunes

Crear y administrar reservas

Gestión de disponibilidad por área y fecha

Listado de reservas por residente

7. Portería

Registro de visitas

Control de acceso de residentes, visitas y proveedores

Envío de avisos internos

Verificación de reservas y pagos

8. Multiusuario y AdminAccount

Gestión de usuarios secundarios (empleados, soporte)

Permisos según rol dentro del AdminAccount

Datos filtrados por AdminAccount para todos los módulos

Roles y Permisos
Rol	Funcionalidades principales
ADMIN	Gestión completa de edificios, residentes, pagos, reservas, marketplace y portería
RESIDENT	Visualizar pagos, historial, reservas y realizar pagos online
EMPLOYEE	Funciones limitadas según permisos del AdminAccount
SUPPORT	Funciones de soporte y control interno, sin acceso a pagos sensibles
Flujos Principales

Flujo de pago de residente

Admin crea pago → Pago registrado en backend → Residente recibe link Mercado Pago → Realiza pago → Estado actualizado


Flujo de marketplace

Admin registra proveedor → Admin crea pago a proveedor → Generación de preferencia Mercado Pago → Pago completado → Estado actualizado


Flujo de reservas

Residente selecciona espacio y fecha → Reserva creada → Disponibilidad bloqueada → Visualización en portería y dashboard


Flujo portería

Visita llega al edificio → Portería registra visita → Verifica reservas/pagos → Acceso permitido o denegado → Avisos enviados a residente

Contribución

Se aceptan contribuciones mediante pull requests. Abrir un issue antes de realizar cambios significativos.

Licencia

MIT
