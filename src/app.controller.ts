import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return {
      message: 'API de Chat en Tiempo Real con NestJS',
      version: '1.0.0',
      endpoints: {
        chat: 'http://localhost:3000/chat-client.html',
        api: {
          rooms: 'GET /api/chat/rooms',
          users: 'GET /api/chat/rooms/:room/users',
          messages: 'GET /api/chat/rooms/:room/messages',
          stats: 'GET /api/chat/stats'
        }
      },
      websocket: 'ws://localhost:3000',
      author: 'Desarrollado con NestJS + Socket.IO + Redis'
    };
  }

  @Get('demo')
  redirect(@Res() res: Response) {
    res.redirect('/chat-client.html');
  }
}
