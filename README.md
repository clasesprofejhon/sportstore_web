SportStore — Sistema Completo
Plataforma e-commerce deportiva con tres componentes integrados:
SportStore_Completo/
├── backend/ ← API REST (Node.js + Express + MySQL)
├── frontend/ ← Aplicación Web (React 18 + Vite + Tailwind CSS)
└── android/ ← App Android Nativa (Kotlin + Retrofit)

---

Inicio Rápido

1. Backend (API REST)
   cd backend
   cp .env.example .env
   Edita .env con tus credenciales de MySQL
   npm install
   npm run dev
   Servidor en http://localhost:5000
2. Frontend Web
   cd frontend
   npm install
   npm run dev
   Abre http://localhost:3000
3. App Android
4. Abre la carpeta android/ en Android Studio
5. Edita app/src/main/java/com/sportstore/app/api/ApiClient.kt
6. Cambia BASE_URL a la IP de tu máquina:
   o Emulador: http://10.0.2.2:5000/
   o Dispositivo físico: http://192.168.X.X:5000/
7. Presiona Run

---

Requisitos
Componente Requisito
Backend Node.js 18+, MySQL 8+
Frontend Node.js 18+, navegador moderno
Android Android Studio Hedgehog+, SDK API 26+

---

Endpoints de la API
Método Endpoint Auth Descripción
POST /api/auth/register Pública Registro de usuario
POST /api/auth/login Pública Login (JWT token)
GET /api/auth/me JWT Perfil del usuario
GET /api/products Pública Catálogo (filtros: category, search)
POST /api/orders JWT Crear pedido
GET /api/orders/my JWT Mis pedidos
POST /api/orders/:id/return JWT Solicitar devolución
GET /api/health Pública Estado del servidor

---

Tecnologías
Backend: Node.js, Express, MySQL2, JWT, bcryptjs, Nodemailer
Frontend: React 18, React Router 6, Vite, Tailwind CSS, Axios
Android: Kotlin, Retrofit2, OkHttp3, Jetpack Navigation, MVVM, ViewModel, LiveData

---

Variables de entorno (backend/.env)
PORT=5000
CLIENT_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=tienda_deportiva
JWT_SECRET=cambia_este_secreto_largo_y_seguro
JWT_EXPIRES_IN=7d
