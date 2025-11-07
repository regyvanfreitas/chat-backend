import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatEventsService } from '../gateway/chat-events.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatEvents: ChatEventsService,
  ) {}

  async getMessages(chatId: number, userId: number) {
    const participant = await this.prisma.participant.findFirst({
      where: { chatId, userId },
    });
    if (!participant) throw new ForbiddenException('Acesso negado ao chat');
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }

  async sendMessage(chatId: number, userId: number, dto: CreateMessageDto) {
    const participant = await this.prisma.participant.findFirst({
      where: { chatId, userId },
    });
    if (!participant) throw new ForbiddenException('Acesso negado ao chat');

    const message = await this.prisma.message.create({
      data: {
        chatId,
        authorId: userId,
        content: dto.content,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    const participants = await this.prisma.participant.findMany({
      where: { chatId },
    });
    const userIds = participants.map((p) => p.userId);
    this.chatEvents.emitMessageCreated(chatId, userIds, message);

    return message;
  }
}
