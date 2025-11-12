import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  Length,
  IsNumberString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCompanyDto {
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @Transform(({ value }) => value.toUpperCase())
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(150)
  business: string;

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
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'A senha não pode conter espaços ou caracteres especiais.',
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  street: string;

  @IsNumberString()
  @MinLength(1)
  @MaxLength(8)
  number: string;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  city: string;

  @IsString()
  @Length(2, 2, { message: 'O estado deve ser uma sigla válida (ex: PR).' })
  state: string;

  @IsNumberString()
  @Length(10, 14)
  phone: string;

  @IsEmail()
  @MinLength(10)
  @MaxLength(150)
  email: string;
}