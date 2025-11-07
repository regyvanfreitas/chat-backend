import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async findUserChats(userId: number) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return chats.map((chat) => ({
      id: chat.id,
      name: chat.title ?? '',
      isGroup: chat.participants.length > 2,
      participants: chat.participants.map((p) => p.user),
      lastMessage: chat.messages[0] ?? undefined,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt ?? chat.createdAt,
    }));
  }

  async createChat(userId: number, dto: CreateChatDto) {
    const allParticipantIds = [
      userId,
      ...dto.participantIds.filter((id) => id !== userId),
    ].sort();

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: allParticipantIds },
          },
        },
        AND: allParticipantIds.map((participantId) => ({
          participants: {
            some: { userId: participantId },
          },
        })),
      },
      include: { participants: true },
    });

    if (
      existingChat &&
      existingChat.participants.length === allParticipantIds.length
    ) {
      return existingChat;
    }

    const chat = await this.prisma.chat.create({
      data: {
        title: dto.title,
        participants: {
          create: allParticipantIds.map((id) => ({ userId: id })),
        },
      },
      include: { participants: true },
    });
    return chat;
  }

  async getChatParticipants(chatId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    });
    if (!chat) throw new NotFoundException('Chat não encontrado');
    return chat.participants;
  }
}
