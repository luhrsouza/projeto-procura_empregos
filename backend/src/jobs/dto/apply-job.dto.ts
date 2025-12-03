import { IsString, IsOptional, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  education: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(600)
  experience: string;
}