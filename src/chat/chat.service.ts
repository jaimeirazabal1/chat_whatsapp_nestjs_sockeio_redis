import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ChatMessage, ChatUser } from './interfaces/chat.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService implements OnModuleInit {
  private redisClient: RedisClientType;

  async onModuleInit() {
    this.redisClient = createClient({
      url: 'redis://localhost:6380'
    });

    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    await this.redisClient.connect();
    console.log('Connected to Redis');
  }

  // Crear un nuevo mensaje
  async createMessage(content: string, author: string, room: string): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: uuidv4(),
      content,
      author,
      room,
      timestamp: new Date()
    };

    // Guardar mensaje en Redis
    await this.redisClient.lPush(
      `room:${room}:messages`,
      JSON.stringify(message)
    );

    // Mantener solo los últimos 50 mensajes
    await this.redisClient.lTrim(`room:${room}:messages`, 0, 49);

    return message;
  }

  // Obtener mensajes de una sala
  async getMessagesForRoom(room: string): Promise<ChatMessage[]> {
    const messages = await this.redisClient.lRange(`room:${room}:messages`, 0, -1);
    return messages.map(msg => JSON.parse(msg)).reverse();
  }

  // Agregar usuario a una sala
  async addUserToRoom(username: string, room: string): Promise<ChatUser> {
    const user: ChatUser = {
      id: uuidv4(),
      username,
      room
    };

    await this.redisClient.sAdd(`room:${room}:users`, JSON.stringify(user));
    return user;
  }

  // Remover usuario de una sala
  async removeUserFromRoom(username: string, room: string): Promise<void> {
    const users = await this.redisClient.sMembers(`room:${room}:users`);
    
    for (const userStr of users) {
      const user = JSON.parse(userStr);
      if (user.username === username) {
        await this.redisClient.sRem(`room:${room}:users`, userStr);
        break;
      }
    }
  }

  // Obtener usuarios de una sala
  async getUsersInRoom(room: string): Promise<ChatUser[]> {
    const users = await this.redisClient.sMembers(`room:${room}:users`);
    return users.map(userStr => JSON.parse(userStr));
  }

  // Marcar usuario como escribiendo
  async setUserTyping(username: string, room: string, isTyping: boolean): Promise<void> {
    const key = `room:${room}:typing`;
    
    if (isTyping) {
      await this.redisClient.sAdd(key, username);
      // Auto-remove after 5 seconds
      await this.redisClient.expire(key, 5);
    } else {
      await this.redisClient.sRem(key, username);
    }
  }

  // Obtener usuarios que están escribiendo
  async getTypingUsers(room: string): Promise<string[]> {
    return await this.redisClient.sMembers(`room:${room}:typing`);
  }

  // Obtener todas las salas activas
  async getActiveRooms(): Promise<string[]> {
    const keys = await this.redisClient.keys('room:*:users');
    return keys.map(key => key.split(':')[1]);
  }

  // Limpiar todos los datos del chat
  async clearAllData(): Promise<void> {
    await this.redisClient.flushDb();
  }

  // Limpiar datos de una sala específica
  async clearRoomData(room: string): Promise<void> {
    await this.redisClient.del(`room:${room}:messages`);
    await this.redisClient.del(`room:${room}:users`);
    await this.redisClient.del(`room:${room}:typing`);
  }
} 