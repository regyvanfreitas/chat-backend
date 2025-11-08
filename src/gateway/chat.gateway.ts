import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ChatEventsService } from './chat-events.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [ChatEventsService],
})
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  allowEIO3: true,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private chatEvents: ChatEventsService,
  ) {}

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId: number =
      typeof (client.data as { user?: unknown }).user === 'string'
        ? Number((client.data as { user?: unknown }).user)
        : ((client.data as { user?: number }).user ?? 0);

    const participants = await this.prisma.participant.findMany({
      where: { chatId: data.chatId },
    });

    participants.forEach((p) => {
      if (p.userId !== userId) {
        this.server
          .to(`user_${p.userId}`)
          .emit('userTyping', { chatId: data.chatId, userId });
      }
    });

    client
      .to(`chat_${data.chatId}`)
      .emit('userTyping', { chatId: data.chatId, userId });
  }
  async handleConnection(client: Socket) {
    this.chatEvents.setServer(this.server);
    const token =
      client.handshake.auth.token ||
      client.handshake.headers['authorization']?.replace('Bearer ', '');
    if (!token || typeof token !== 'string') return client.disconnect();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret',
      });
      client.data.user = payload.sub;
      await client.join(`user_${client.data.user}`);

      this.server.emit('userOnline', { userId: payload.sub });
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId: number =
      typeof (client.data as { user?: unknown }).user === 'string'
        ? Number((client.data as { user?: unknown }).user)
        : ((client.data as { user?: number }).user ?? 0);

    const participant = await this.prisma.participant.findFirst({
      where: { chatId: data.chatId, userId },
    });

    if (!participant) {
      client.emit('joinChatError', { message: 'Acesso negado ao chat' });
      return;
    }

    await client.join(`chat_${data.chatId}`);
    client.emit('joinedChat', { chatId: data.chatId });

    const roomSize =
      this.server.sockets.adapter.rooms.get(`chat_${data.chatId}`)?.size || 0;
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @MessageBody() data: { chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    await client.leave(`chat_${data.chatId}`);
    client.emit('leftChat', { chatId: data.chatId });

    const userId: number =
      typeof (client.data as { user?: unknown }).user === 'string'
        ? Number((client.data as { user?: unknown }).user)
        : ((client.data as { user?: number }).user ?? 0);

    const roomSize =
      this.server.sockets.adapter.rooms.get(`chat_${data.chatId}`)?.size || 0;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId: number =
      typeof (client.data as { user?: unknown }).user === 'string'
        ? Number((client.data as { user?: unknown }).user)
        : ((client.data as { user?: number }).user ?? 0);

    const participant = await this.prisma.participant.findFirst({
      where: { chatId: data.chatId, userId },
    });

    if (!participant) {
      client.emit('sendMessageError', { message: 'Acesso negado ao chat' });
      return;
    }

    const message = await this.prisma.message.create({
      data: {
        chatId: data.chatId,
        authorId: userId,
        content: data.content,
      },
      include: { author: true },
    });

    const participants = await this.prisma.participant.findMany({
      where: { chatId: data.chatId },
    });

    this.server.to(`chat_${data.chatId}`).emit('messageCreated', message);

    participants.forEach((p) => {
      this.server.to(`user_${p.userId}`).emit('messageCreated', message);
    });
    return message;
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.user;

    if (userId) {
      this.server.emit('userOffline', { userId });
    }
  }
}
