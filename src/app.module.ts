import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { ChatEventsService } from './gateway/chat-events.service';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    JwtModule.register({}),
  ],
  controllers: [],
  providers: [ChatGateway, PrismaService, ChatEventsService],
  exports: [ChatEventsService],
})
export class AppModule {}
