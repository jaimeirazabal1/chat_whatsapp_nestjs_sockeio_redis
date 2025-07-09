const { io } = require('socket.io-client');

// Configuración
const SERVER_URL = 'http://localhost:3000';
const TEST_ROOM = 'general';

// Función para crear un cliente de prueba
function createTestClient(username) {
  const socket = io(SERVER_URL);
  
  socket.on('connect', () => {
    console.log(`🟢 ${username} conectado`);
    
    // Unirse a la sala
    socket.emit('user:join', {
      username: username,
      room: TEST_ROOM
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔴 ${username} desconectado`);
  });

  socket.on('message:new', (message) => {
    console.log(`💬 [${message.room}] ${message.author}: ${message.content}`);
  });

  socket.on('user:joined', (user) => {
    console.log(`👋 ${user.username} se unió a la sala ${user.room}`);
  });

  socket.on('user:left', (user) => {
    console.log(`👋 ${user.username} dejó la sala ${user.room}`);
  });

  socket.on('user:typing', (data) => {
    console.log(`✏️  ${data.username} está escribiendo en ${data.room}`);
  });

  socket.on('user:stop-typing', (data) => {
    console.log(`✏️  ${data.username} dejó de escribir en ${data.room}`);
  });

  socket.on('room:users', (users) => {
    console.log(`👥 Usuarios en la sala: ${users.map(u => u.username).join(', ')}`);
  });

  socket.on('room:messages', (messages) => {
    console.log(`📝 Mensajes anteriores: ${messages.length} mensajes cargados`);
  });

  return socket;
}

// Función para enviar mensajes
function sendMessage(socket, username, content) {
  socket.emit('message:send', {
    content: content,
    author: username,
    room: TEST_ROOM
  });
}

// Función para simular tipeo
function simulateTyping(socket, username) {
  socket.emit('user:typing', {
    username: username,
    room: TEST_ROOM
  });
  
  setTimeout(() => {
    socket.emit('user:stop-typing', {
      username: username,
      room: TEST_ROOM
    });
  }, 2000);
}

// Función principal de pruebas
async function runTests() {
  console.log('🚀 Iniciando pruebas del chat...\n');
  
  // Crear clientes de prueba
  const cliente1 = createTestClient('AliceBot');
  const cliente2 = createTestClient('BobBot');
  
  // Esperar conexión
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Enviar algunos mensajes
  sendMessage(cliente1, 'AliceBot', '¡Hola! Soy Alice 👋');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  sendMessage(cliente2, 'BobBot', '¡Hola Alice! Soy Bob 🤖');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular tipeo
  simulateTyping(cliente1, 'AliceBot');
  
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  sendMessage(cliente1, 'AliceBot', '¿Cómo estás?');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  sendMessage(cliente2, 'BobBot', '¡Muy bien! Este chat funciona perfectamente 🎉');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Probar API REST
  console.log('\n🔍 Probando endpoints REST...');
  
  try {
    const fetch = require('node-fetch');
    
    // Obtener estadísticas
    const statsResponse = await fetch(`${SERVER_URL}/api/chat/stats`);
    const stats = await statsResponse.json();
    console.log('📊 Estadísticas:', JSON.stringify(stats, null, 2));
    
    // Obtener usuarios de la sala
    const usersResponse = await fetch(`${SERVER_URL}/api/chat/rooms/${TEST_ROOM}/users`);
    const users = await usersResponse.json();
    console.log('👥 Usuarios en la sala:', JSON.stringify(users, null, 2));
    
    // Obtener mensajes
    const messagesResponse = await fetch(`${SERVER_URL}/api/chat/rooms/${TEST_ROOM}/messages`);
    const messages = await messagesResponse.json();
    console.log('💬 Mensajes:', JSON.stringify(messages, null, 2));
    
  } catch (error) {
    console.error('❌ Error probando API REST:', error.message);
  }
  
  // Limpiar
  setTimeout(() => {
    cliente1.disconnect();
    cliente2.disconnect();
    console.log('\n✅ Pruebas completadas');
    process.exit(0);
  }, 3000);
}

// Instalar dependencias si es necesario
try {
  require('socket.io-client');
  require('node-fetch');
} catch (error) {
  console.log('📦 Instalando dependencias...');
  const { execSync } = require('child_process');
  execSync('npm install socket.io-client node-fetch', { stdio: 'inherit' });
}

// Ejecutar pruebas
runTests().catch(console.error); 