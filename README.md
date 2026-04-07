# SportStore — E-Commerce Deportivo

Plataforma de comercio electrónico para la comercialización de productos deportivos, desarrollada con una arquitectura desacoplada y persistencia de datos relacional.

## Stack Tecnológico

* **Frontend**: React 18, Vite, Tailwind CSS, React Router.
* **Backend**: Node.js v20, Express, JWT (JSON Web Tokens).
* **Base de Datos**: MySQL.
* **Email**: Nodemailer (SMTP).
* **Pagos**: Stripe (Integración preparada).

## Estructura del Proyecto

```text
sportstore/
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes de interfaz
│   │   ├── pages/        # Vistas (Home, Login, Products, etc.)
│   │   ├── context/      # Estado global (Auth, Carrito)
│   │   └── App.jsx
├── backend/              # API REST Express
│   ├── src/
│   │   ├── models/       # Definición de tablas y esquemas
│   │   ├── routes/       # Endpoints de la API
│   │   ├── middleware/   # Seguridad y validación JWT
│   │   ├── services/     # Lógica de notificaciones (Email)
│   │   └── index.js
└── package.json          # Scripts raíz


project:
  name: "SportStore — E-Commerce Deportivo"
  description: "Plataforma de comercio electrónico para productos deportivos con arquitectura desacoplada y persistencia relacional."
  version: "1.0.0"

stack_tecnologico:
  frontend:
    - "React 18"
    - "Vite"
    - "Tailwind CSS"
    - "React Router"
  backend:
    - "Node.js v20"
    - "Express"
    - "JWT (JSON Web Tokens)"
  persistence:
    - "MySQL"
  integrations:
    - "Nodemailer (SMTP)"
    - "Stripe (Payments ready)"

estructura_proyecto:
  root: "sportstore/"
  folders:
    frontend: "Aplicación cliente (React, Context API)"
    backend: "API REST (Express, JWT Middleware)"
    models: "Esquemas y modelos de MySQL"

instalacion:
  requisitos:
    - "Node.js v20+"
    - "MySQL 8.0+"
  pasos:
    dependencias: "npm run install:all"
    configuracion: "Crear .env en /backend con credenciales de DB, JWT y SMTP"
    ejecucion: "npm run dev"

api_endpoints:
  autenticacion:
    - method: "POST"
      path: "/api/auth/register"
      desc: "Registro y vinculación de tarjeta"
    - method: "POST"
      path: "/api/auth/login"
      desc: "Inicio de sesión"
    - method: "GET"
      path: "/api/auth/verify-email"
      desc: "Verificación de cuenta"
  productos:
    - method: "GET"
      path: "/api/products"
      desc: "Listado de catálogo"
    - method: "POST"
      path: "/api/products"
      desc: "Creación (Admin)"
  ordenes:
    - method: "POST"
      path: "/api/orders"
      desc: "Generación de pedido"
    - method: "POST"
      path: "/api/orders/:id/return"
      desc: "Solicitud de devolución"

caracteristicas_clave:
  - "Seguridad robusta mediante JWT"
  - "Persistencia en base de datos relacional MySQL"
  - "Notificaciones automáticas por email"
  - "Diseño responsivo con Tailwind CSS"
  - "Estado global mediante Context API"