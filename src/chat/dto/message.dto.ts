import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  author: string;

  @IsString()
  @IsOptional()
  room?: string;
}

export class MessageDto {
  id: string;
  content: string;
  author: string;
  room: string;
  timestamp: Date;
}

export class UserTypingDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  room?: string;
} 