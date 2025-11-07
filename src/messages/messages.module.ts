import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatEventsService } from '../gateway/chat-events.service';

@Module({
  imports: [JwtModule],
  providers: [MessagesService, PrismaService, ChatEventsService],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
