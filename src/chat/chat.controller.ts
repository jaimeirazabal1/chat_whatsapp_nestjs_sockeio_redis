import { Controller, Get, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  async getActiveRooms() {
    const rooms = await this.chatService.getActiveRooms();
    return {
      success: true,
      data: rooms,
      message: 'Salas activas obtenidas correctamente'
    };
  }

  @Get('rooms/:room/users')
  async getUsersInRoom(@Param('room') room: string) {
    const users = await this.chatService.getUsersInRoom(room);
    return {
      success: true,
      data: users,
      message: `Usuarios en la sala ${room} obtenidos correctamente`
    };
  }

  @Get('rooms/:room/messages')
  async getMessagesForRoom(@Param('room') room: string) {
    const messages = await this.chatService.getMessagesForRoom(room);
    return {
      success: true,
      data: messages,
      message: `Mensajes de la sala ${room} obtenidos correctamente`
    };
  }

  @Get('rooms/:room/typing')
  async getTypingUsers(@Param('room') room: string) {
    const typingUsers = await this.chatService.getTypingUsers(room);
    return {
      success: true,
      data: typingUsers,
      message: `Usuarios escribiendo en la sala ${room} obtenidos correctamente`
    };
  }

  @Get('stats')
  async getChatStats() {
    const activeRooms = await this.chatService.getActiveRooms();
    const roomStats = await Promise.all(
      activeRooms.map(async (room) => {
        const users = await this.chatService.getUsersInRoom(room);
        const messages = await this.chatService.getMessagesForRoom(room);
        return {
          room,
          userCount: users.length,
          messageCount: messages.length,
          users: users.map(u => u.username)
        };
      })
    );

    return {
      success: true,
      data: {
        totalRooms: activeRooms.length,
        totalUsers: roomStats.reduce((sum, room) => sum + room.userCount, 0),
        totalMessages: roomStats.reduce((sum, room) => sum + room.messageCount, 0),
        rooms: roomStats
      },
      message: 'Estadísticas del chat obtenidas correctamente'
    };
  }

  @Get('clear')
  async clearAllData() {
    await this.chatService.clearAllData();
    return {
      success: true,
      message: 'Todos los datos del chat han sido eliminados'
    };
  }

  @Get('rooms/:room/clear')
  async clearRoomData(@Param('room') room: string) {
    await this.chatService.clearRoomData(room);
    return {
      success: true,
      message: `Datos de la sala ${room} eliminados correctamente`
    };
  }
} 