import { IsArray, IsString } from 'class-validator';

export class NotificationDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly date: string;
}
