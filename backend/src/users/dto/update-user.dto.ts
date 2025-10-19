import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @Transform(({ value }) => (value ? value.toUpperCase() : value))
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/)
  @IsOptional()
  password?: string;

  @IsEmail({}, { message: 'Formato de email inválido.' })
  @IsOptional()
  email?: string;

  @IsString()
  @Length(10, 14)
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(600)
  @IsOptional()
  experience?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(600)
  @IsOptional()
  education?: string;
}