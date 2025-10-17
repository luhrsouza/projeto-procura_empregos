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

export class CreateUserDto {
  @IsString()
  @MinLength(4, { message: 'O nome precisa ter no mínimo 4 caracteres.' })
  @MaxLength(150, { message: 'O nome pode ter no máximo 150 caracteres.' })
  @Transform(({ value }) => value.toUpperCase())
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'O nome de usuário não pode conter espaços ou caracteres especiais.',
  })
  username: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9!@#$%^&*]+$/, {
    message: 'A senha não pode conter espaços.',
  })
  password: string;

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