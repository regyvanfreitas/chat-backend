import { Injectable, Global } from '@nestjs/common';
import { Server } from 'socket.io';

@Global()
@Injectable()
export class ChatEventsService {
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  emitMessageCreated(chatId: number, userIds: number[], message: any) {
    if (!this.server) return;

    this.server.to(`chat_${chatId}`).emit('messageCreated', message);

    if (this.server) {
      userIds.forEach((userId) => {
        this.server!.to(`user_${userId}`).emit('messageCreated', message);
      });
    }
  }
}
