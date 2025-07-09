# 🚀 Chat en Tiempo Real con NestJS

Una API de chat en tiempo real construida con **NestJS**, **Socket.IO** y **Redis**. Perfecta para demostrar las capacidades de desarrollo backend moderno.

## ✨ Características

- 💬 **Chat en tiempo real** con WebSockets
- 🏠 **Múltiples salas** de chat
- 👥 **Usuarios online** en tiempo real
- ✏️ **Indicadores de escritura** (typing indicators)
- 📝 **Persistencia de mensajes** con Redis
- 🎨 **Cliente web moderno** incluido
- 🔧 **API REST** para consultas
- 📊 **Estadísticas en tiempo real**
- 🐳 **Docker** para desarrollo
- 🔒 **Validación de datos** automática

## 🛠️ Tecnologías Utilizadas

- **NestJS** 11.0.1 - Framework Node.js progresivo
- **Socket.IO** - Comunicación en tiempo real
- **Redis** - Base de datos en memoria
- **TypeScript** - Tipado estático
- **Docker** - Containerización
- **HTML5/CSS3/JavaScript** - Cliente web

## 🚀 Instalación y Uso

### 1. Clonar e instalar dependencias
```bash
git clone https://github.com/jaimeirazabal1/chat_whatsapp_nestjs_sockeio_redis
cd nestjs-chat
npm install
```

### 2. Iniciar Redis con Docker
```bash
docker-compose up -d redis
```

### 3. Iniciar el servidor
```bash
npm run start:dev
```

### 4. Acceder al chat
- **Cliente web**: http://localhost:3000/chat-client.html
- **API**: http://localhost:3000
- **Demo**: http://localhost:3000/demo

## 📡 Endpoints de la API

### REST API
- `GET /` - Información de la API
- `GET /api/chat/rooms` - Salas activas
- `GET /api/chat/rooms/:room/users` - Usuarios en una sala
- `GET /api/chat/rooms/:room/messages` - Mensajes de una sala
- `GET /api/chat/stats` - Estadísticas globales

### WebSocket Events

#### Cliente → Servidor
- `user:join` - Unirse a una sala
- `user:leave` - Salir de una sala
- `message:send` - Enviar mensaje
- `user:typing` - Indicar que está escribiendo
- `user:stop-typing` - Parar de escribir

#### Servidor → Cliente
- `message:new` - Nuevo mensaje recibido
- `user:joined` - Usuario se unió
- `user:left` - Usuario se fue
- `user:typing` - Usuario escribiendo
- `user:stop-typing` - Usuario paró de escribir
- `room:users` - Lista de usuarios actualizada
- `room:messages` - Mensajes de la sala

## 🧪 Pruebas

### Prueba automática
```bash
node test-chat.js
```

### Prueba manual
1. Abre http://localhost:3000/chat-client.html
2. Ingresa tu nombre de usuario
3. Comienza a chatear
4. Abre otra pestaña para simular múltiples usuarios

## 📁 Estructura del Proyecto

```
src/
├── chat/
│   ├── dto/               # Data Transfer Objects
│   ├── interfaces/        # TypeScript interfaces
│   ├── chat.controller.ts # REST API endpoints
│   ├── chat.gateway.ts    # WebSocket handlers
│   ├── chat.service.ts    # Lógica de negocio
│   └── chat.module.ts     # Módulo de chat
├── app.controller.ts      # Controlador principal
├── app.module.ts          # Módulo principal
└── main.ts               # Punto de entrada

public/
└── chat-client.html      # Cliente web

docker-compose.yml        # Configuración Docker
test-chat.js             # Script de pruebas
```


## 📝 Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Linting
npm run lint

# Docker
docker-compose up -d
docker-compose down
```

## 🔧 Configuración

### Variables de entorno
```env
PORT=3000
REDIS_URL=redis://localhost:6380
```

### Redis
- **Host**: localhost
- **Puerto**: 6380
- **Base de datos**: 0

## 🤝 Características Técnicas

- **Validación automática** con class-validator
- **Documentación automática** con decoradores
- **Manejo de errores** centralizado
- **CORS** habilitado
- **Archivos estáticos** servidos
- **Logging** estructurado
- **TypeScript** estricto

## 🎨 Cliente Web

El cliente incluye:
- 🎨 **Diseño moderno** y responsive
- 🌓 **Tema oscuro** en sidebar
- 📱 **Mobile-friendly**
- ⚡ **Tiempo real** sin recargas
- 🔔 **Notificaciones** visuales
- 🎯 **UX intuitiva**

## 🚀 Próximos Pasos

Ideas para extender el proyecto:
- 🔐 Autenticación JWT
- 📁 Upload de archivos
- 🔔 Notificaciones push
- 📊 Dashboard admin
- 🌐 Múltiples idiomas
- 📱 App móvil

