import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, ValidationPipe, UsePipes } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto, UserTypingDto } from './dto/message.dto';
import { ServerToClientEvents, ClientToServerEvents } from './interfaces/chat.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  private logger: Logger = new Logger('ChatGateway');
  private userSockets: Map<string, { socket: Socket; username: string; room: string }> = new Map();

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    const userInfo = this.userSockets.get(client.id);
    if (userInfo) {
      await this.chatService.removeUserFromRoom(userInfo.username, userInfo.room);
      
      // Notificar a otros usuarios que el usuario se fue
      client.to(userInfo.room).emit('user:left', {
        id: client.id,
        username: userInfo.username,
        room: userInfo.room,
      });

      // Enviar lista actualizada de usuarios
      const users = await this.chatService.getUsersInRoom(userInfo.room);
      this.server.to(userInfo.room).emit('room:users', users);
      
      this.userSockets.delete(client.id);
    }
  }

  @SubscribeMessage('user:join')
  async handleUserJoin(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room } = data;
    
    // Unirse a la sala
    await client.join(room);
    
    // Agregar usuario a Redis
    const user = await this.chatService.addUserToRoom(username, room);
    
    // Guardar información del usuario
    this.userSockets.set(client.id, { socket: client, username, room });
    
    // Notificar a otros usuarios
    client.to(room).emit('user:joined', user);
    
    // Enviar mensajes existentes al nuevo usuario
    const messages = await this.chatService.getMessagesForRoom(room);
    client.emit('room:messages', messages);
    
    // Enviar lista de usuarios a todos en la sala
    const users = await this.chatService.getUsersInRoom(room);
    this.server.to(room).emit('room:users', users);
    
    this.logger.log(`User ${username} joined room ${room}`);
  }

  @SubscribeMessage('user:leave')
  async handleUserLeave(
    @MessageBody() data: { username: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room } = data;
    
    await client.leave(room);
    await this.chatService.removeUserFromRoom(username, room);
    
    // Notificar a otros usuarios
    client.to(room).emit('user:left', {
      id: client.id,
      username,
      room,
    });

    // Enviar lista actualizada de usuarios
    const users = await this.chatService.getUsersInRoom(room);
    this.server.to(room).emit('room:users', users);
    
    this.userSockets.delete(client.id);
    this.logger.log(`User ${username} left room ${room}`);
  }

  @SubscribeMessage('message:send')
  @UsePipes(new ValidationPipe())
  async handleMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { content, author, room = 'general' } = createMessageDto;
    
    // Crear mensaje
    const message = await this.chatService.createMessage(content, author, room);
    
    // Enviar mensaje a todos en la sala
    this.server.to(room).emit('message:new', message);
    
    this.logger.log(`Message sent by ${author} in room ${room}: ${content}`);
    
    return message;
  }

  @SubscribeMessage('user:typing')
  async handleUserTyping(
    @MessageBody() data: UserTypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room = 'general' } = data;
    
    await this.chatService.setUserTyping(username, room, true);
    
    // Notificar a otros usuarios (excepto al que está escribiendo)
    client.to(room).emit('user:typing', { username, room });
    
    // Auto-stop typing after 3 seconds
    setTimeout(async () => {
      await this.chatService.setUserTyping(username, room, false);
      client.to(room).emit('user:stop-typing', { username, room });
    }, 3000);
  }

  @SubscribeMessage('user:stop-typing')
  async handleUserStopTyping(
    @MessageBody() data: UserTypingDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { username, room = 'general' } = data;
    
    await this.chatService.setUserTyping(username, room, false);
    
    // Notificar a otros usuarios
    client.to(room).emit('user:stop-typing', { username, room });
  }
} 