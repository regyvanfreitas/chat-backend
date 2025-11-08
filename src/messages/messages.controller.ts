import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('Messages')
@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar mensagens de um chat',
    description: 'Retorna todas as mensagens de um chat específico',
  })
  @ApiParam({
    name: 'chatId',
    description: 'ID do chat',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de mensagens retornada com sucesso',
    schema: {
      example: [
        {
          id: 1,
          content: 'Olá, como você está?',
          chatId: 1,
          authorId: 1,
          createdAt: '2023-01-01T00:00:00.000Z',
          author: {
            id: 1,
            name: 'João Silva',
            email: 'joao@email.com',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
        },
        {
          id: 2,
          content: 'Estou bem, obrigado!',
          chatId: 1,
          authorId: 2,
          createdAt: '2023-01-01T01:00:00.000Z',
          author: {
            id: 2,
            name: 'Maria Silva',
            email: 'maria@email.com',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado ao chat',
  })
  async getMessages(
    @CurrentUser() userId: number,
    @Param('chatId') chatId: number,
  ) {
    return this.messagesService.getMessages(Number(chatId), userId);
  }

  @Post()
  @ApiOperation({
    summary: 'Enviar mensagem',
    description: 'Envia uma nova mensagem para o chat',
  })
  @ApiParam({
    name: 'chatId',
    description: 'ID do chat',
    example: 1,
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Mensagem enviada com sucesso',
    schema: {
      example: {
        id: 1,
        content: 'Olá, como você está?',
        chatId: 1,
        authorId: 1,
        createdAt: '2023-01-01T00:00:00.000Z',
        author: {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          createdAt: '2023-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado ao chat',
  })
  async sendMessage(
    @CurrentUser() userId: number,
    @Param('chatId') chatId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(Number(chatId), userId, dto);
  }
}
