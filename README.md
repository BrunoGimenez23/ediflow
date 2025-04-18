🏢 Ediflow
Ediflow es una aplicación web para la administración de consorcios y edificios. Este MVP (Producto Mínimo Viable) está diseñado para facilitar la gestión de unidades, propietarios, expensas y reclamos, ofreciendo una interfaz moderna y fácil de usar.

🚀 Características principales del MVP
📋 Gestión de unidades y propietarios

💸 Carga y visualización de expensas

🛠️ Registro de reclamos por parte de los propietarios

👤 Panel administrativo para administradores

📬 Notificaciones básicas de estado de reclamos

🧱 Tecnologías utilizadas
Frontend
React + Vite

Tailwind CSS para estilos responsivos y modernos

React Router para navegación

Backend
Spring Boot

Spring Security (configuración básica)

JPA / Hibernate para persistencia

MySQL como base de datos

📦 Estructura del proyecto
css
Copiar
Editar
ediflow/
├── backend/
│   └── src/
│       └── main/
│           ├── java/com/ediflow/
│           └── resources/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
🛠️ Instalación y ejecución
Backend
Configurá tu archivo application.properties con tus credenciales de MySQL.

Desde la raíz del backend:

bash
Copiar
Editar
./mvnw spring-boot:run
Frontend
Desde la carpeta frontend:

bash
Copiar
Editar
npm install
npm run dev
⚠️ Es necesario tener Node.js y Java 17 o superior instalados.

🎯 Roadmap (futuro)
📱 Versión responsive 100%

✉️ Notificaciones por correo

📊 Dashboard con estadísticas

🔐 Gestión de permisos más granular

🤝 Contribuciones
Las contribuciones están abiertas. Si querés colaborar, podés abrir un issue o hacer un pull request. ¡Toda ayuda es bienvenida!

📄 Licencia
Este proyecto está bajo la Licencia MIT.

