import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Request() req, @Param('chatId') chatId: number) {
    return this.messagesService.getMessages(Number(chatId), req.user.sub);
  }

  @Post()
  async sendMessage(
    @Request() req,
    @Param('chatId') chatId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(Number(chatId), req.user.sub, dto);
  }
}
