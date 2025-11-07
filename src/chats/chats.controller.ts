import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  async getChats(@Request() req) {
    const userId =
      typeof req.user === 'object' && 'sub' in req.user
        ? Number(req.user.sub)
        : 0;
    return this.chatsService.findUserChats(userId);
  }

  @Post()
  async createChat(@Request() req, @Body() dto: CreateChatDto) {
    const userId =
      typeof req.user === 'object' && 'sub' in req.user
        ? Number(req.user.sub)
        : 0;
    return this.chatsService.createChat(userId, dto);
  }
}
