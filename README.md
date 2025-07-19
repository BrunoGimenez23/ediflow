# 🏢 Ediflow

**Ediflow** es una plataforma web para la gestión integral de edificios, diseñada para administradores, empleados y residentes. Permite gestionar edificios, apartamentos, residentes, pagos de expensas y reservas de áreas comunes, con soporte multiusuario según el plan contratado.

---

## 🚀 Tecnologías

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Spring Boot (Java)
- **Base de datos:** MySQL
- **Autenticación:** JWT
- **Deploy Frontend:** Vercel (`https://ediflow.uy`)
- **Deploy Backend:** Railway (o el que estés usando)

---

## ✨ Funcionalidades principales

### 🔐 Autenticación
- Registro y login de usuarios (Administrador y Residente)
- Autenticación con JWT
- Prueba gratuita de 14 días para nuevos administradores

### 🏢 Administración de edificios
- Crear edificios y departamentos
- Asignar residentes a departamentos

### 👥 Multiusuario (Plan Premium Plus)
- Asociar empleados y soporte a una cuenta de administrador
- Roles personalizados: `ADMIN`, `EMPLOYEE`, `SUPPORT`

### 💸 Pagos de expensas
- Emisión, asignación y visualización de pagos
- Filtros por estado, edificio, fechas, etc.
- Vista personalizada para residentes con historial de pagos

### 📅 Reservas de áreas comunes
- Crear, listar y gestionar reservas por residente
- Administración de disponibilidad

---

## 🧪 Pruebas
- Pruebas unitarias y de integración con Spring Boot y MockMvc
- Mock de JWT para control de acceso en endpoints protegidos

📄 Licencia
MIT License

🙌 Autor
Desarrollado por Bruno Giménez
