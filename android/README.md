# SportStore Android App

Aplicación Android nativa (Kotlin) que consume la API REST del backend **SportStore**.

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Android Studio | Hedgehog (2023.1.1) o superior |
| JDK | 17 (incluido en Android Studio) |
| Android SDK | API 26 (Android 8.0) |
| Gradle | 8.4 (se descarga automáticamente) |

## Configuración rápida

### 1. Abrir el proyecto
```
File → Open → selecciona la carpeta SportStoreApp
```
Espera a que Gradle sincronice todas las dependencias.

### 2. Configurar la URL del backend

Edita el archivo:
```
app/src/main/java/com/sportstore/app/api/ApiClient.kt
```

Cambia `BASE_URL` según tu entorno:

```kotlin
// Para emulador de Android Studio:
const val BASE_URL = "http://10.0.2.2:5000/"

// Para dispositivo físico (misma red Wi-Fi):
const val BASE_URL = "http://192.168.X.X:5000/"  // IP de tu PC

// Para producción:
const val BASE_URL = "https://tu-dominio.com/"
```

### 3. Configurar IPs permitidas para HTTP

Edita `app/src/main/res/xml/network_security_config.xml` y agrega tu IP real:

```xml
<domain includeSubdomains="true">192.168.X.X</domain>
```

### 4. Levantar el backend primero

```bash
cd sportstore/backend
npm run dev
# Debe mostrar: 🚀 Servidor en http://localhost:5000
```

### 5. Ejecutar la app

- **Emulador**: Selecciona un AVD con API 26+ → Run ▶
- **Dispositivo físico**: Activa depuración USB → conecta → Run ▶

---

## Estructura del proyecto

```
app/src/main/
├── java/com/sportstore/app/
│   ├── api/
│   │   ├── ApiClient.kt       ← Configuración Retrofit + URL base
│   │   ├── ApiService.kt      ← Endpoints de la API REST
│   │   └── Models.kt          ← Data classes (User, Product, Order…)
│   ├── utils/
│   │   ├── AuthManager.kt     ← Gestión del token JWT
│   │   ├── CartManager.kt     ← Carrito local (singleton)
│   │   └── Extensions.kt      ← Funciones de extensión Kotlin
│   ├── viewmodel/
│   │   ├── AuthViewModel.kt   ← Login / registro
│   │   ├── ProductsViewModel.kt
│   │   └── OrdersViewModel.kt ← Pedidos y devoluciones
│   └── ui/
│       ├── MainActivity.kt    ← Actividad principal + BottomNav
│       ├── auth/
│       │   ├── LoginActivity.kt
│       │   └── RegisterActivity.kt
│       ├── home/HomeFragment.kt
│       ├── products/
│       │   ├── ProductsFragment.kt
│       │   └── ProductsAdapter.kt
│       ├── cart/
│       │   ├── CartFragment.kt
│       │   └── CartAdapter.kt
│       └── orders/
│           ├── OrdersFragment.kt
│           ├── OrdersAdapter.kt
│           └── OrderItemsAdapter.kt
└── res/
    ├── layout/                ← Todos los XML de pantallas e items
    ├── navigation/nav_graph.xml
    ├── menu/                  ← BottomNav y toolbar
    ├── values/                ← colors, strings, themes
    ├── color/                 ← Selectores de color
    ├── drawable/              ← Iconos vectoriales
    └── xml/network_security_config.xml
```

## Endpoints consumidos

| Pantalla | Endpoint |
|---|---|
| Login | `POST /api/auth/login` |
| Registro | `POST /api/auth/register` |
| Catálogo | `GET /api/products?category=&search=` |
| Carrito → Pedido | `POST /api/orders` |
| Mis Pedidos | `GET /api/orders/my` |
| Devolución | `POST /api/orders/:id/return` |
| Health check | `GET /api/health` |

## Generar APK

```
Build → Build Bundle(s)/APK(s) → Build APK(s)
```
El archivo queda en: `app/build/outputs/apk/debug/app-debug.apk`
