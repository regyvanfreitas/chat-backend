import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  title!: string;

  @IsArray()
  participantIds!: number[];
}
