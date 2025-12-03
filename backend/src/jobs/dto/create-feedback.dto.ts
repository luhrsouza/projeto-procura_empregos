import { IsInt, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  message: string;
}