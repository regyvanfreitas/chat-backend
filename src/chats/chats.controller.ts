import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar chats do usuário',
    description: 'Retorna todos os chats que o usuário participa',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de chats retornada com sucesso',
    schema: {
      example: [
        {
          id: 1,
          name: 'Chat com Maria',
          isGroup: false,
          participants: [
            {
              id: 1,
              name: 'João Silva',
              email: 'joao@email.com',
              createdAt: '2023-01-01T00:00:00.000Z',
            },
            {
              id: 2,
              name: 'Maria Silva',
              email: 'maria@email.com',
              createdAt: '2023-01-01T00:00:00.000Z',
            },
          ],
          lastMessage: {
            id: 1,
            content: 'Olá, como você está?',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async getChats(@CurrentUser() userId: number) {
    return this.chatsService.findUserChats(userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo chat',
    description:
      'Cria um novo chat ou retorna um existente com os mesmos participantes',
  })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({
    status: 201,
    description: 'Chat criado ou retornado com sucesso',
    schema: {
      example: {
        id: 1,
        title: 'Chat Importante',
        participants: [
          {
            id: 1,
            userId: 1,
            chatId: 1,
          },
          {
            id: 2,
            userId: 2,
            chatId: 1,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async createChat(@CurrentUser() userId: number, @Body() dto: CreateChatDto) {
    return this.chatsService.createChat(userId, dto);
  }

  @Get(':id/participants')
  @ApiOperation({
    summary: 'Buscar participantes de um chat',
    description: 'Retorna todos os participantes de um chat específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do chat',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de participantes retornada com sucesso',
    schema: {
      example: [
        {
          id: 1,
          userId: 1,
          chatId: 1,
        },
        {
          id: 2,
          userId: 2,
          chatId: 1,
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat não encontrado',
  })
  async getChatParticipants(@Param('id') chatId: number) {
    return this.chatsService.getChatParticipants(Number(chatId));
  }
}
