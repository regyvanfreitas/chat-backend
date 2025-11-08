import { IsNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    description: 'Título do chat',
    example: 'Chat Importante',
  })
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'IDs dos usuários que participarão do chat',
    example: [2, 3],
    type: [Number],
  })
  @IsArray()
  participantIds!: number[];
}
